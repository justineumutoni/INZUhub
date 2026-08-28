import { Ionicons } from "@expo/vector-icons";
type IconName = React.ComponentProps<typeof Ionicons>['name'];

// icons in footer
export interface FooterIconProps {
    id: string,
    name:string,
    iconName: IconName,
}