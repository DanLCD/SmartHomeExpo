import { BluetoothContext } from '@/services/connection';
import { useContext } from 'react';

export function useBluetooth() {
    return useContext(BluetoothContext);
}
