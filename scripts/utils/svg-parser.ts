const SELF_CLOSING_TAGS = new Set([
  "circle",
  "ellipse",
  "line",
  "path",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "use",
  "image",
]);

const SVG_TO_JSX_ATTRS: Record<string, string> = {
  "clip-path": "clipPath",
  "clip-rule": "clipRule",
  "fill-opacity": "fillOpacity",
  "fill-rule": "fillRule",
  "flood-color": "floodColor",
  "flood-opacity": "floodOpacity",
  "font-family": "fontFamily",
  "font-size": "fontSize",
  "font-weight": "fontWeight",
  "letter-spacing": "letterSpacing",
  "lighting-color": "lightingColor",
  "marker-end": "markerEnd",
  "marker-mid": "markerMid",
  "marker-start": "markerStart",
  "stop-color": "stopColor",
  "stop-opacity": "stopOpacity",
  "stroke-dasharray": "strokeDasharray",
  "stroke-dashoffset": "strokeDashoffset",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-miterlimit": "strokeMiterlimit",
  "stroke-opacity": "strokeOpacity",
  "stroke-width": "strokeWidth",
  "text-anchor": "textAnchor",
  "text-decoration": "textDecoration",
  "transform-origin": "transformOrigin",
  "xlink:href": "xlinkHref",
  "xml:space": "xmlSpace",
  class: "className",
  "dominant-baseline": "dominantBaseline",
  "alignment-baseline": "alignmentBaseline",
  "baseline-shift": "baselineShift",
  "color-interpolation": "colorInterpolation",
  "color-interpolation-filters": "colorInterpolationFilters",
  "enable-background": "enableBackground",
  "glyph-orientation-horizontal": "glyphOrientationHorizontal",
  "glyph-orientation-vertical": "glyphOrientationVertical",
  "pointer-events": "pointerEvents",
  "shape-rendering": "shapeRendering",
  "image-rendering": "imageRendering",
  "word-spacing": "wordSpacing",
  "writing-mode": "writingMode",
};

export function extractSvgContent(svgString: string): {
  innerContent: string;
  viewBox: string;
} {
  const viewBoxMatch = svgString.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch?.[1] ?? "0 0 24 24";

  const innerMatch = svgString.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  const innerContent = innerMatch?.[1]?.trim() ?? "";

  return { innerContent, viewBox };
}

export function svgToJsx(innerContent: string): string {
  let jsx = innerContent;

  for (const [svgAttr, jsxAttr] of Object.entries(SVG_TO_JSX_ATTRS)) {
    jsx = jsx.replaceAll(`${svgAttr}=`, `${jsxAttr}=`);
  }

  for (const tag of SELF_CLOSING_TAGS) {
    const regex = new RegExp(
      `<${tag}(\\s[^>]*?)\\s*>\\s*<\\/${tag}>`,
      "g",
    );
    jsx = jsx.replace(regex, `<${tag}$1 />`);
  }

  // Convert style="fill:#abc;fill-rule:evenodd" to style={{fill:"#abc",fillRule:"evenodd"}}
  jsx = jsx.replace(/style="([^"]+)"/g, (_match, cssString: string) => {
    const props = cssString
      .split(";")
      .filter(Boolean)
      .map((prop) => {
        const [key, ...valueParts] = prop.split(":");
        const value = valueParts.join(":").trim();
        const jsxKey = key
          .trim()
          .replace(/-([a-z])/g, (_m, c: string) => c.toUpperCase());
        return `${jsxKey}:"${value}"`;
      })
      .join(",");
    return `style={{${props}}}`;
  });

  return jsx;
}
