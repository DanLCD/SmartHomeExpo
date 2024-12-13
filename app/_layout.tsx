import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Provider } from 'react-redux';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AppHeader } from '@/components/AppHeader';
import { AppStatus } from '@/components/AppStatus';
import { store } from '@/state/store';
import BluetoothConnection from '@/services/connection';
import { Bluetooth } from '@/components/Bluetooth';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <Provider store={store}>
            <BluetoothConnection>
                <Bluetooth />
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
            </BluetoothConnection>
        </Provider>
    );
}
