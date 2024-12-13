import React, { useEffect } from "react";
import { useBluetooth } from "@/hooks/useBluetooth";
import { Alert } from "react-native";

export function Bluetooth() {
    const { connectToHub, connectedDevice, receivedData, error } = useBluetooth();

    useEffect(() => {
        if (error) {
            console.error(error);
            Alert.alert('Error', error.message);
        }
    }, [error]);

    useEffect(() => {
        connectToHub();
    }, []);

    useEffect(() => {
        if (connectedDevice) {
            console.log('Requesting ready');
            connectedDevice.write(JSON.stringify({
                op: 'READY',
                d: {}
            }));
        }
    }, [connectedDevice]);

    useEffect(() => { 
        console.log('Received', receivedData);
    }, [receivedData]);

    return <></>;
}
