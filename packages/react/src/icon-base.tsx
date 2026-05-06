import { type ReactNode, type Ref, type SVGProps, forwardRef } from "react";

import type { CloudIconProps } from "./types";

export function createIcon(
  name: string,
  viewBox: string,
  renderFn: (props: SVGProps<SVGSVGElement>) => ReactNode,
) {
  const Icon = forwardRef(
    (
      { size = 24, color, className, ...rest }: CloudIconProps,
      ref: Ref<SVGSVGElement>,
    ) => (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox={viewBox}
        fill={color ?? "currentColor"}
        className={className}
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        {...rest}
      >
        {renderFn(rest)}
      </svg>
    ),
  );

  Icon.displayName = name;
  return Icon;
}
