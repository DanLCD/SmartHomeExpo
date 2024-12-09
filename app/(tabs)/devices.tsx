import { SectionList, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { NoDevicesFound } from '@/components/NoDevicesFound';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Device } from '@/components/Device';

export default function TabTwoScreen() {
    const places = useAppSelector(state => state.place);
    const devices = useAppSelector(state => state.device);

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Dispositivos</ThemedText>
            </ThemedView>
            <ThemedView style={styles.deviceContainer}>
            {
                places.length === 0 ? <NoDevicesFound /> : (
                    <SectionList
                        sections={places.map(place => { return { title: place.name, data: place.devices }; })}
                        renderSectionHeader={({ section }) => {
                            return <ThemedText type="title">{section.title}</ThemedText>
                        }}
                        renderItem={({ item }) => {
                            const data = devices.filter(d => d.id === item)[0];
                            return <Device style={styles.device} data={data} />;
                        }}
                        keyExtractor={item => `device-${item}`}
                        contentContainerStyle={{ gap: 16 }}
                    />
                )
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
    device: {
        //paddingLeft: 16,
        backgroundColor: '#f0f0f0',
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
