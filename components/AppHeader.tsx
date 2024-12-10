import { PropsWithChildren, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { Status } from '@/constants/Status';
import { StatusContext, StatusTextContext } from '@/services/connection';
import { useEffect } from 'react';
import { Animated } from 'react-native';
import { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

const STATUS = {
    [Status.DISCONNECTED]: 'Desconectado',
    [Status.SCANNING]: 'Buscando',
    [Status.CONNECTING]: 'Conectando',
    [Status.CONNECTED]: 'Conectado',
}

export function AppHeader(Props: PropsWithChildren) {
    const [status, setStatus] = useContext(StatusContext);
    const [message, setMessage] = useContext(StatusTextContext);
    const fadeAnimation = useSharedValue(1);

    useEffect(() => {
        if (status === Status.CONNECTING || status === Status.SCANNING) {
            fadeAnimation.value = withRepeat(
                withSequence(withTiming(0, { duration: 1000 }), withTiming(1, { duration: 1000 })),
                10000000 // Run the animation indefinitely
            );
        }
    }, [status]);

    const style = useAnimatedStyle(() => ({
        opacity: fadeAnimation.value,
    }));

    return (
        <Animated.View style={{...styles.titleContainer, ...(message ? styles.reducedPadding : styles.padding), ...style }}>
            <ThemedText type="subtitle">{STATUS[status]}</ThemedText>
            {
                message ? <ThemedText>{message}</ThemedText> : null
            }
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    reducedPadding: {
        paddingTop: 16,
        paddingBottom: 4
    },
    padding: {
        padding: 16
    }
});
