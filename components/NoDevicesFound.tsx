import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { StyleSheet } from "react-native";
import { IconSymbol } from "./ui/IconSymbol";

export function NoDevicesFound() {
    return <ThemedView style={styles.container}>
        <IconSymbol size={128} name="icloud.slash" color="grey" />
        <ThemedText type="title" style={styles.centered}>No se encontraron dispositivos :{"("}</ThemedText>
        <ThemedText style={styles.centered}>Asegúrate que el dispositivo esté conectado y sea visible, y que Bluetooth esté encendido.</ThemedText>
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
