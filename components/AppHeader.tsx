import { PropsWithChildren, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { Status } from '@/constants/Status';
import { StatusContext } from '@/services/connection';

const STATUS = {
    [Status.DISCONNECTED]: 'Desconectado',
    [Status.SCANNING]: 'Buscando',
    [Status.CONNECTING]: 'Conectando',
    [Status.CONNECTED]: 'Conectado',
}

export function AppHeader(Props: PropsWithChildren) {
    const status = useContext(StatusContext);

    return <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{STATUS[status]}</ThemedText>
    </ThemedView>;
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
});
