export type DeviceType = 'light' | 'motor' | 'servo' | 'fan' | 'other';

export type DeviceCharacteristicType = 'number' | 'boolean' | 'string';

export type DeviceCharacteristic<T = any> = {
    id: string;
    name: string;
    type: DeviceCharacteristicType;
    value: T;
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
    devices: Device[];
};

export type Payload = {
    op: string;
    d: any;
};

const LivingRoom = {
    id: '7f50fd9c-2c96-4283-a0bb-092618082c98',
    name: 'Sala de estar',
    devices: [
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
    ]
}
