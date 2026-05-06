import type { SVGProps } from "react";

export interface CloudIconProps extends Omit<SVGProps<SVGSVGElement>, "ref"> {
  size?: number | string;
  color?: string;
}
