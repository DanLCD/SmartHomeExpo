import { StyleSheet } from 'react-native';
import { NativeStackHeaderLeftProps } from '@react-navigation/native-stack';
import { IconSymbol } from './ui/IconSymbol';
import { useContext } from 'react';
import { StatusContext } from '@/services/connection';
import { Status } from '@/constants/Status';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { Colors } from '@/constants/Colors';

const ICONS: Record<Status, import('expo-symbols').SymbolViewProps['name']> = {
    [Status.DISCONNECTED]: 'icloud.slash',
    [Status.SCANNING]: 'arrow.clockwise.icloud',
    [Status.CONNECTING]: 'arrow.clockwise.icloud',
    [Status.CONNECTED]: 'link.icloud.fill',
};

export function AppStatus(props: NativeStackHeaderLeftProps) {
    const status = useContext(StatusContext);
    const theme = useColorScheme() ?? 'light';
    return <IconSymbol size={28} name={ICONS[status]} color={theme === 'light' ? Colors.light.icon : Colors.dark.icon} style={status == Status.DISCONNECTED ? styles.symbol : styles.symbolActive} />;
}

const styles = StyleSheet.create({
    symbolActive: {
        padding: 16,
        opacity: 1,
    },
    symbol: {
        padding: 16,
        opacity: 0.5,
    }
});
