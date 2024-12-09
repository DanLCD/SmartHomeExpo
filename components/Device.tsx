import { Device as DeviceProps } from "@/types/net";
import { ThemedView } from "./ThemedView";

export function Device(props: DeviceProps) {
    return <ThemedView>
        {props.type}
    </ThemedView>;
}
