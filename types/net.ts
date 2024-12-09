export type DeviceType = 'light' | 'motor' | 'servo' | 'fan' | 'other';

export type DeviceCharacteristicType = 'number' | 'boolean' | 'string';

export type DeviceCharacteristic<T = any> = {
    id: string;
    name: string;
    type: DeviceCharacteristicType;
    value: T;
    minimumValue?: number;
    maximumValue?: number;
    writable: boolean;
};

export type Device = {
    id: string;
    name: string,
    type: DeviceType;
    characteristics: DeviceCharacteristic[];
};

export type Place = {
    id: string;
    name: string;
    devices: string[];
};

export type Payload = {
    op: string;
    d: any;
};
