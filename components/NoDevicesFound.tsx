import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { StyleSheet } from "react-native";
import { IconSymbol } from "./ui/IconSymbol";
import { useContext } from "react";
import { StatusContext } from "@/services/connection";
import { Status } from "@/constants/Status";

const messages: Record<Status, string> = {
    [Status.DISCONNECTED]: "Asegúrate que el dispositivo esté conectado y sea visible, y que Bluetooth esté encendido.",
    [Status.SCANNING]: "Asegúrate que el dispositivo esté conectado y sea visible, y que Bluetooth esté encendido.",
    [Status.CONNECTING]: "Dispositivo encontrado. Conectando...",
    [Status.CONNECTED]: "No hay dispositivos disponibles.",
};

export function NoDevicesFound() {
    const [status, getStatus] = useContext(StatusContext);

    return <ThemedView style={styles.container}>
        <IconSymbol size={128} name="icloud.slash" color="grey" />
        <ThemedText type="title" style={styles.centered}>No se encontraron dispositivos :{"("}</ThemedText>
        <ThemedText style={styles.centered}>{messages[status]}</ThemedText>
    </ThemedView>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centered: {
        textAlignVertical: "center",
        textAlign: "center"
    }
});
