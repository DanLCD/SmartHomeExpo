import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Place } from '@/components/Place';
import { Place as PlaceData } from '@/types/net';
import { NoDevicesFound } from '@/components/NoDevicesFound';

export default function TabTwoScreen() {
    const places: PlaceData[] = [];
    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Dispositivos</ThemedText>
            </ThemedView>
            <ThemedView style={styles.deviceContainer}>
            {
                places.length === 0 ? <NoDevicesFound /> : places.map(place => <Place {...place} />)
            }
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        gap: 16,
        overflow: 'hidden',
    },
    deviceContainer: {
        flex: 1,
        padding: 16
    },
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
    },
});
