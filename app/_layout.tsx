import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AppHeader } from '@/components/AppHeader';
import { AppStatus } from '@/components/AppStatus';
import { alertPermissionsMissing, connect, requestPermissions, StatusContext } from '@/services/connection';
import { Status } from '@/constants/Status';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [status, setStatus] = useState(Status.DISCONNECTED);
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            requestPermissions().then(granted => {
                if (!granted) {
                    alertPermissionsMissing();
                } else {
                    connect(setStatus, true);
                }
            });
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <StatusContext.Provider value={status}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                    <Stack.Screen 
                        name="(tabs)" 
                        options={{
                            headerShown: true,
                            headerLeft: props => <AppStatus {...props}/>,
                            headerTitle: props => <AppHeader {...props} />,
                            headerTitleAlign: 'center'
                        }} />
                    <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="auto" />
            </ThemeProvider>
        </StatusContext.Provider>
    );
}
