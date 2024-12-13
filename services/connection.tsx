import { Status } from "@/constants/Status";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import RNBluetoothClassic, { BluetoothDevice } from "react-native-bluetooth-classic";
import { BluetoothEventSubscription, StateChangeEvent } from "react-native-bluetooth-classic/lib/BluetoothEvent";

export type Encodings = NonNullable<Parameters<BluetoothDevice['write']>[1]>;

export type BluetoothContextType = {
    status: Status;
    statusText: string;
    connectToHub: () => Promise<void>;
    btStatus: "IDLE" | StateChangeEvent;
    isBluetoothEnabled: boolean;
    devices: BluetoothDevice[];
    connectedDevice: BluetoothDevice | null;
    receivedData: string;
    error: Error | null;
    isScanning: boolean;
    scanForDevices: () => Promise<void>;
    connectToDevice: (deviceAddress: string) => Promise<void>;
    disconnectDevice: () => Promise<void>;
    writeToDevice: (
        address: string,
        data: any,
        encoding?: Encodings
    ) => Promise<void>;
};

export const BluetoothContext = createContext<BluetoothContextType>({
    status: Status.DISCONNECTED,
    statusText: '',
    connectToHub: async () => { },
    btStatus: 'IDLE',
    isBluetoothEnabled: false,
    devices: [],
    connectedDevice: null,
    receivedData: '',
    error: null,
    isScanning: false,
    scanForDevices: async () => { },
    connectToDevice: async () => { },
    disconnectDevice: async () => { },
    writeToDevice: async () => { },
});

export function isHub(device: BluetoothDevice | null) {
    return device?.name === 'PACOTITI';
}

export default function BluetoothConnection({ children }: PropsWithChildren<{}>) {
    const [status, setStatus] = useState(Status.DISCONNECTED);
    const [statusText, setStatusText] = useState('');
    const [btStatus, setBtStatus] = useState<StateChangeEvent | "IDLE">("IDLE");
    const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);
    const [devices, setDevices] = useState<BluetoothDevice[]>([]);
    const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
    const [receivedData, setReceivedData] = useState<string>("");
    const [error, setError] = useState<Error | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [hasPermissions, setHasPermissions] = useState(false);
    const [subscription, setSubscription] = useState<BluetoothEventSubscription | null>(null);
    const [attemptingToConnect, setAttemptingToConnect] = useState(false);

    useEffect(() => {
        if (connectedDevice) {
            setStatus(Status.CONNECTED);
        } else if (attemptingToConnect) {
            setStatus(Status.CONNECTING);
        } else if (isScanning) {
            setStatus(Status.SCANNING);
        } else {
            setStatus(Status.DISCONNECTED);
        }
    }, [setStatus, connectedDevice, attemptingToConnect, isScanning]);

    /**
     * Request necessary Bluetooth permissions on Android
     */
    const requestBluetoothPermissions = async (): Promise<void> => {
        if (Platform.OS !== "android") return;

        const reqPerms = [
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ];

        const grantedPermissions = await PermissionsAndroid.requestMultiple(
            reqPerms
        );
        const deniedPermissions = reqPerms.filter(
            (perm) => grantedPermissions[perm] !== PermissionsAndroid.RESULTS.GRANTED
        );

        if (deniedPermissions.length > 0) {
            setError(new Error('Algunos permisos no fueron otorgados'));
        }
        setHasPermissions(deniedPermissions.length === 0);
    };

    /**
     * Scan for available Bluetooth devices
     */
    const scanForDevices = async (): Promise<any> => {
        if (Platform.OS === "android" && !hasPermissions) {
            await requestBluetoothPermissions();
            if (!hasPermissions) return;
        }

        const available = await RNBluetoothClassic.isBluetoothAvailable();
        if (!available) {
            setError(new Error('Bluetooth no disponible'));
            return;
        }

        const enabled = await RNBluetoothClassic.isBluetoothEnabled();
        setIsBluetoothEnabled(enabled);
        if (!enabled) {
            RNBluetoothClassic.openBluetoothSettings();
            setError(new Error('Bluetooth no habilitado'));
            return;
        }

        setIsScanning(true);
        try {
            const foundDevices = await RNBluetoothClassic.startDiscovery();
            if (!foundDevices) {
                setError(new Error('No se encontraron dispositivos'));
                return;
            }
            setDevices((prevDevices) => {
                const newDevices = foundDevices.filter(
                    (device) =>
                        !prevDevices.some((prev) => prev.address === device.address)
                );
                return [...prevDevices, ...newDevices];
            });
            return foundDevices;
        } catch (e: any) {
            setError(new Error(`Error escaneando dispositivos: ${e.message}`));
        } finally {
            setIsScanning(false);
        }
    };

    /**
     * Connect to a Bluetooth device
     * @param {string} address - The address of the device to connect to
     */
    const connectToDevice = async (address: string): Promise<any> => {
        setAttemptingToConnect(true);
        setStatusText(`Conectando a ${address}`);
        try {
            let device;
            // Try binary connection first
            try {
                device = await RNBluetoothClassic.connectToDevice(address, {
                    charset: 'binary',
                    connectionType: 'binary'
                });
            } catch (binaryError) {
                // If binary fails, try ASCII
                device = await RNBluetoothClassic.connectToDevice(address, {
                });
            }

            setConnectedDevice(device);
            setStatusText(`Conectado a ${device.name}`);

            const sub = device.onDataReceived((data: any) => {
                setReceivedData(data.data);
            });
            setSubscription(sub);
            setError(null);
            return device;
        } catch (e: any) {
            setError(new Error(`Error de conexión: ${e.message}`));
        } finally {
            setAttemptingToConnect(false);
        }
    };

    const connectToHub = async () => {
        const boundDevices = await RNBluetoothClassic.getBondedDevices();
        let hub = boundDevices.find(isHub);
        if (hub) {
            await connectToDevice(hub.address);
        } else {
            const devices = await scanForDevices();
            hub = devices.find(isHub);
        }

        if (!hub) {
            setError(new Error('Hub no encontrado'));
        } else {
            if (!(await hub.isConnected())) await connectToDevice(hub.address);
        }
    };

    /**
     * Disconnect from the currently connected Bluetooth device
     */
    const disconnectDevice = async (): Promise<void> => {
        if (subscription) {
            subscription.remove();
            setSubscription(null);
        }
        if (connectedDevice) {
            try {
                await connectedDevice.disconnect();
            } catch (e: any) {
                setError(new Error(`Error disconnecting device: ${e.message}`));
            } finally {
                setConnectedDevice(null);
                setReceivedData("");
            }
        }
    };

    /**
     * Write data to the connected Bluetooth device
     * @param {any} data - The data to write
     * @param {Encodings} encoding - The encoding to use (default: 'utf8')
     */
    const writeToDevice = async (
        deviceAddress: string,
        data: any,
        encoding: Encodings = "utf8"
    ): Promise<void> => {
        try {
            await RNBluetoothClassic.writeToDevice(deviceAddress, data, encoding);
        } catch (e: any) {
            setError(new Error(`Error writing to device: ${e.message}`));
        }
    };

    useEffect(() => {
        const initializeBluetooth = async () => {
            await requestBluetoothPermissions();
            await scanForDevices();
        };

        initializeBluetooth().catch((e) =>
            setError(new Error(`Error de inicialización: ${e.message}`))
        );

        // Set up state change listener
        const sub = RNBluetoothClassic.onStateChanged((state) => {
            setBtStatus(state);
            if (state.toString() !== "PoweredOn") {
                disconnectDevice();
            }
        });

        return () => {
            if (subscription) {
                subscription.remove();
            }
            disconnectDevice();
            sub.remove();
        };
    }, []);

    return (
        <BluetoothContext.Provider
            value={{
                status,
                statusText,
                connectToHub,
                btStatus,
                isBluetoothEnabled,
                devices: devices,
                connectedDevice,
                receivedData,
                error,
                isScanning,
                scanForDevices,
                connectToDevice,
                disconnectDevice,
                writeToDevice,
            }}
        >
            {children}
        </BluetoothContext.Provider>
    );
}
