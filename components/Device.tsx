import { DeviceCharacteristic, Device as DeviceData } from "@/types/net";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { StyleProp, ViewStyle, StyleSheet, Image, FlatList, Switch, TextInput } from "react-native";
import Slider from '@react-native-community/slider';
import { useCallback, useContext } from "react";
import { DeviceContext } from "@/services/connection";

export function getIcon(type: string) {
    switch (type) {
        case 'light':
            return require('@/assets/images/icon-bulb.png');
        case 'motor':
            return require('@/assets/images/icon-motor.png');
        case 'servo':
            return require('@/assets/images/icon-angle.png');
        case 'fan':
            return require('@/assets/images/icon-fan.png');
        default:
            return require('@/assets/images/icon-config.png');
    }
}

export function getCharacteristic(updateCharacteristic: (value: any) => void, characteristic: DeviceCharacteristic) {
    switch (characteristic.type) {
        case 'number':
            return <>
                <ThemedText>{characteristic.value}</ThemedText>
                <Slider
                    style={{ width: 200, height: 40 }}
                    value={characteristic.value}
                    disabled={!characteristic.writable}
                    minimumValue={characteristic.minimumValue ?? 0}
                    maximumValue={characteristic.maximumValue ?? 1}
                    onValueChange={value => updateCharacteristic(value)}
                />
            </>;
        case 'boolean':
            return <Switch
                value={characteristic.value}
                disabled={!characteristic.writable}
                onValueChange={value => updateCharacteristic(value)}
            />;
        case 'string':
            return characteristic.writable ? <TextInput
                onChangeText={text => updateCharacteristic(text)}
                value={characteristic.value}
            /> : <ThemedText>{characteristic.value}</ThemedText>;
    }

    return <></>;
}

export function Device({ data, style }: { data: DeviceData, style?: StyleProp<ViewStyle> }) {
    const [device, setDevice] = useContext(DeviceContext);
    const updateCharacteristic = useCallback((id: string, value: any) => {
        if (!device) return;

        device.write(JSON.stringify({
            op: 'WRITE_CHARACTERISTIC',
            d: {
                id,
                value
            }
        }));
    }, [device]);

    return <ThemedView style={[styles.container, style]}>
        <Image source={getIcon(data.type)} style={styles.icon} />
        <ThemedView style={[styles.innerContainer, style]}>
            <ThemedText type="subtitle">{data.name}</ThemedText>
            <FlatList
                data={data.characteristics}
                renderItem={({ item }) => <ThemedView style={style}>
                    <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                    <ThemedView style={[styles.characteristicsContainer, style]}>
                        {getCharacteristic(updateCharacteristic.bind(null, item.id), item)}
                    </ThemedView>
                </ThemedView>}
            />
        </ThemedView>
    </ThemedView>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        padding: 16,
        borderRadius: 8,
    },
    icon: {
        width: 64,
        height: 64,
        marginRight: 16
    },
    innerContainer: {
        flex: 1
    },
    characteristicsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }
});
