import { Tabs } from 'expo-router';
import React, { useContext, useEffect } from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { alertPermissionsMissing, connect, DeviceContext, disconnect, requestPermissions, StatusContext, StatusTextContext } from '@/services/connection';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const [status, setStatus] = useContext(StatusContext);
    const [message, setMessage] = useContext(StatusTextContext);
    const [device, setDevice] = useContext(DeviceContext);
    const dispatch = useAppDispatch();

    useEffect(() => {
        setMessage('Esperando permisos');
        requestPermissions().then(granted => {
            if (!granted) {
                setMessage('No se han otorgado permisos');
                alertPermissionsMissing();
            } else {
                setMessage('Empezando conexión');
                connect(true, setStatus, setMessage, setDevice, dispatch);
            }

            return () => {
                disconnect();
            };
        });
    }, [setStatus, setMessage, setDevice, dispatch]);

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        // Use a transparent background on iOS to show the blur effect
                        position: 'absolute',
                    },
                    default: {},
                }),
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
                }}
            />
            <Tabs.Screen
                name="devices"
                options={{
                    title: 'Dispositivos',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="list.bullet" color={color} />,
                }}
            />
        </Tabs>
    );
}
