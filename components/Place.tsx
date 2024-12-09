import { Place as PlaceProps } from "@/types/net";
import { Collapsible } from "./Collapsible";
import { Device } from "./Device";

export function Place(props: PlaceProps) {
    return <Collapsible title={props.name}>
        {props.devices.map(device => <Device {...device} />)}
    </Collapsible>;
}
