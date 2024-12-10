import { Image, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme.web';

export default function HomeScreen() {
    const theme = useColorScheme() ?? 'light';
    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={
                <ThemedView style={styles.logoContainer}>
                    <Image
                        source={require('@/assets/images/Logo-utez.png')}
                        style={styles.otherLogo}
                    />
                    <Image
                        source={require('@/assets/gifs/clapping-gif-club-penguin.gif')}
                        style={styles.appLogo}
                    />
                </ThemedView>
            }>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">¡Bienvenido!</ThemedText>
                <HelloWave />
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText>Este es un proyecto para demostrar la capacidad del módulo Bluetooth HC-05 con Arduino para controlar dispositivos inalámbricamente.</ThemedText>
                <ThemedText>¡Espero que te guste!</ThemedText>
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Para comenzar, asegúrate de que tu dispositivo esté encendido y visible.</ThemedText>
                <ThemedText>¡No te preocupes! No necesitas emparejar tu dispositivo, la conexión es automática.</ThemedText>
                <ThemedText>Una vez conectado, podrás ver la lista de dispositivos controlables en la pestaña <ThemedText type="defaultSemiBold"><Link href="/devices"><IconSymbol name="list.bullet" color={theme} /> Dispositivos</Link></ThemedText></ThemedText>
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="title">Integrantes</ThemedText>
                <ThemedText>Este proyecto fue desarrollado por:</ThemedText>
                <ThemedText>👨‍💻 <ThemedText type="defaultSemiBold">Luis Daniel Cásares Ramírez</ThemedText></ThemedText>
                <ThemedText>👨‍💻 <ThemedText type="defaultSemiBold">Ricardo Marín Esquivel</ThemedText></ThemedText>
                <ThemedText>👨‍💻 <ThemedText type="defaultSemiBold">René Bermudez Maxines</ThemedText></ThemedText>
                <ThemedText>👨‍💻 <ThemedText type="defaultSemiBold">Francisco Jared Meza</ThemedText></ThemedText>
            </ThemedView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    logoContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    appLogo: {
        transform: [{scaleX: -1}]
    },
    otherLogo: {
        position: 'absolute',
        transform: [{scale: 0.5}]
    }
});
