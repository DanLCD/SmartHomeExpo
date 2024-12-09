import { Status } from "@/constants/Status";
import { createContext, Dispatch, SetStateAction } from "react";
import { Alert, BackHandler, PermissionsAndroid, Platform } from "react-native";
import { openSettings } from "react-native-permissions";
import * as ExpoDevice from 'expo-device';
import RNBluetoothClassic, { BluetoothDevice } from "react-native-bluetooth-classic";
import { deleteDevice, deletePlace, updateDevice, updatePlace } from "@/state/reducers";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { Payload } from "@/types/net";

// DEBUG

const LivingRoom = {
    id: '7f50fd9c-2c96-4283-a0bb-092618082c98',
    name: 'Sala de estar',
    devices: [
        '79feff08-e947-4a45-ab57-10c062ce3de6',
        '1c8c8f7f-1b6d-4b9d-8b1c-4d5d3d6f6e8c',
        '48c2c7b2-d4a2-4d54-81d0-d6919377ed9c'
    ]
};

const Devices = [
    {
        id: '79feff08-e947-4a45-ab57-10c062ce3de6',
        type: 'light',
        name: 'Luz principal',
        characteristics: [
            {
                id: 'ef06bfd1-f81e-44a0-97cf-f7e3abad9d1a',
                name: 'Encendido',
                type: 'boolean',
                value: false,
                writable: true
            },
            {
                id: 'a1b5d4f1-1b6d-4b9d-8b1c-4d5d3d6f6e8c',
                name: 'Intensidad',
                type: 'number',
                value: 0,
                minimumValue: 0,
                maximumValue: 100,
                writable: true
            }
        ]
    },
    {
        id: '1c8c8f7f-1b6d-4b9d-8b1c-4d5d3d6f6e8c',
        type: 'servo',
        name: 'Puerta automática',
        characteristics: [
            {
                id: 'c1b5d4f1-1b6d-4b9d-8b1c-4d5d3d6f6e8c',
                name: 'Grado',
                type: 'number',
                value: 0,
                minimumValue: 0,
                maximumValue: 180,
                writable: true
            }
        ]
    },
    {
        id: '48c2c7b2-d4a2-4d54-81d0-d6919377ed9c',
        type: 'fan',
        name: 'Ventilador de techo',
        characteristics: [
            {
                id: 'b0b4b1f1-1b6d-4b9d-8b1c-4d5d3d6f6e8c',
                name: 'Encendido',
                type: 'boolean',
                value: false,
                writable: true
            }
        ]
    }
];

export const StatusContext = createContext<[Status, Dispatch<SetStateAction<Status>>]>([Status.DISCONNECTED, () => { }]);
export const DeviceContext = createContext<[BluetoothDevice | null, Dispatch<SetStateAction<BluetoothDevice | null>>]>([null, () => { }]);

export async function requestAndroid31Permissions() {
    const fineLocationPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
            title: "Permitir acceso a la ubicación",
            message: "Bluetooth requiere acceso a la ubicación",
            buttonPositive: "OK",
        }
    );

    return fineLocationPermission === PermissionsAndroid.RESULTS.GRANTED;
};

export async function requestPermissions() {
    if (Platform.OS === "android") {
        if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Permitir acceso a la ubicación",
                    message: "Bluetooth requiere acceso a la ubicación",
                    buttonPositive: "OK",
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
            return await requestAndroid31Permissions();
        }
    } else {
        return true;
    }
};

export async function alertPermissionsMissing() {
    Alert.alert('Error', 'Se necesitan permisos de conectividad para usar esta aplicación', [
        {
            text: 'Ok',
            isPreferred: true,
            onPress: () => openSettings()
        }
    ]);
}

export async function alertBluetoothUnavailable() {
    Alert.alert('Error', 'Bluetooth no está disponible en este dispositivo', [
        {
            text: 'Ok',
            isPreferred: true,
            onPress: () => BackHandler.exitApp()
        }
    ]);
}

export async function connect(reconnect: boolean, setStatus: Dispatch<SetStateAction<Status>>, setDevice: Dispatch<SetStateAction<BluetoothDevice | null>>, dispatch: ReturnType<typeof useAppDispatch>) {
    if (!(await RNBluetoothClassic.isBluetoothAvailable())) {
        alertBluetoothUnavailable();
        return false;
    }

    if (!(await RNBluetoothClassic.isBluetoothEnabled()) && !(await RNBluetoothClassic.requestBluetoothEnabled())) {
        alertPermissionsMissing();
        return false;
    }

    let device: BluetoothDevice;
    let found = false;
    /*
    setStatus(Status.SCANNING);
    dispatch(updatePlace(LivingRoom));
    for (const device of Devices) {
        dispatch(updateDevice(device));
    }
    */

    while (!found) {
        const devices = await RNBluetoothClassic.startDiscovery();
        for (device of devices) {
            const isHub = device.extra.get('ARDUINO_HUB') ?? false;
            if (isHub) {
                try {
                    setStatus(Status.CONNECTING);
                    await device.connect({ serviceName: 'ARDUINO_HUB' });
                } catch (e) {
                    continue;
                }

                await RNBluetoothClassic.cancelDiscovery();
                found = true;
                break;
            }
        }
    }

    setDevice(device!);
    setStatus(Status.CONNECTED);

    while (await device!.isConnected()) {
        let payload: Payload;
        try {
            payload = JSON.parse(await device!.read() as string);
        } catch (e) {
            console.error(e);
            continue;
        }

        switch (payload.op) {
            case 'UPDATE_PLACE':
                dispatch(updatePlace(payload.d));
                break;
            case 'DELETE_PLACE':
                dispatch(deletePlace(payload.d));
                break;
            case 'UPDATE_DEVICE':
                dispatch(updateDevice(payload.d));
                break;
            case 'DELETE_DEVICE':
                dispatch(deleteDevice(payload.d));
                break;
            default:
                console.warn('Unknown operation', payload.op);
                continue;
        }
    }

    setStatus(Status.DISCONNECTED);
    if (reconnect) {
        await connect(reconnect, setStatus, setDevice, dispatch);
        return true;
    }

    return true;
};
