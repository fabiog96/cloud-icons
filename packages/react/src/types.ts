import type { SVGProps } from "react";

export type IconSize = number | string;

export interface CloudIconProps extends Omit<SVGProps<SVGSVGElement>, "ref"> {
  size?: IconSize;
  color?: string;
}
