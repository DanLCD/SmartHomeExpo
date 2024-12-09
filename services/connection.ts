import { Status } from "@/constants/Status";
import { createContext } from "react";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import { openSettings } from "react-native-permissions";
import * as ExpoDevice from 'expo-device';
import RNBluetoothClassic, { BluetoothDevice } from "react-native-bluetooth-classic";

export const StatusContext = createContext(Status.DISCONNECTED);

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

export async function connect(setStatus: React.Dispatch<React.SetStateAction<Status>>, reconnect: boolean) {
    if (!(await RNBluetoothClassic.isBluetoothEnabled()) && !(await RNBluetoothClassic.requestBluetoothEnabled())) {
        alertPermissionsMissing();
        return;
    }

    let device: BluetoothDevice;
    let found = false;
    setStatus(Status.SCANNING);

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

    setStatus(Status.CONNECTED);

    while (await device!.isConnected()) {
        const payload = await device!.read();
        if (payload) {
            console.log(payload);
        }
    }

    setStatus(Status.DISCONNECTED);
    if (reconnect) return await connect(setStatus, reconnect);
};
