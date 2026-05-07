import type { Config } from "svgo";

const config: Config = {
  multipass: true,
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          removeViewBox: false,
          inlineStyles: {
            onlyMatchedOnce: false,
          },
        },
      },
    },
    {
      name: "prefixIds",
      params: {
        delim: "-",
        prefix: (_element, info) => {
          if (!info.path) return "icon";
          const filename = info.path
            .replace(/\.svg$/, "")
            .split("/")
            .pop() ?? "icon";
          return filename;
        },
      },
    },
    "removeDimensions",
    "sortAttrs",
  ],
};

export default config;
