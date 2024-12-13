import React, { useEffect } from "react";
import { useBluetooth } from "@/hooks/useBluetooth";
import { Alert } from "react-native";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { resetDevices, resetPlaces, updateDevice, updatePlace } from "@/state/reducers";

export function Bluetooth() {
    const { connectToHub, connectedDevice, receivedData, error } = useBluetooth();
    const dispatch = useAppDispatch();

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
            dispatch(resetPlaces());
            dispatch(resetDevices());
            console.log('Requesting ready');
            connectedDevice.write(JSON.stringify({
                op: 'READY',
                d: {}
            }));
        }
    }, [connectedDevice]);

    useEffect(() => { 
        console.log('Received', receivedData);
        let data: any;
        try {
            data = JSON.parse(receivedData);
        } catch (e) {
            console.error('Error parsing data', e);
            return;
        }

        if (data.op == 'UPDATE_PLACE') {
            dispatch(updatePlace(data.d));
        } else if (data.op == 'UPDATE_DEVICE') {
            dispatch(updateDevice(data.d));
        } else {
            console.warn('Unknown op', data.op);
        }

    }, [receivedData]);

    return <></>;
}
