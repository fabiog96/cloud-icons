import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { extractSvgContent, svgToJsx } from "../scripts/utils/svg-parser";
import { toCamelCase, toPascalCase } from "../scripts/utils/naming";

describe("naming utils", () => {
  it("converts kebab-case to PascalCase", () => {
    expect(toPascalCase("ec2")).toBe("Ec2");
    expect(toPascalCase("app-mesh")).toBe("AppMesh");
    expect(toPascalCase("api-gateway-endpoint")).toBe("ApiGatewayEndpoint");
  });

  it("converts kebab-case to camelCase", () => {
    expect(toCamelCase("ec2")).toBe("ec2");
    expect(toCamelCase("app-mesh")).toBe("appMesh");
  });
});

describe("svg-parser", () => {
  it("extracts inner content and viewBox", () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M0 0h64"/></svg>`;
    const { innerContent, viewBox } = extractSvgContent(svg);

    expect(viewBox).toBe("0 0 64 64");
    expect(innerContent).toBe(`<path d="M0 0h64"/>`);
  });

  it("defaults viewBox to 0 0 24 24 if missing", () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg"><path d="M0"/></svg>`;
    const { viewBox } = extractSvgContent(svg);

    expect(viewBox).toBe("0 0 24 24");
  });

  it("converts SVG attributes to JSX", () => {
    const input = `<path fill-rule="evenodd" clip-path="url(#a)" stroke-width="2"/>`;
    const output = svgToJsx(input);

    expect(output).toContain("fillRule=");
    expect(output).toContain("clipPath=");
    expect(output).toContain("strokeWidth=");
    expect(output).not.toContain("fill-rule=");
  });
});

describe("generated files snapshot", () => {
  const coreDir = join(import.meta.dirname, "..", "packages", "core", "src", "aws");
  const reactDir = join(import.meta.dirname, "..", "packages", "react", "src", "aws");

  it("core/aws/ec2.ts matches snapshot", () => {
    const content = readFileSync(join(coreDir, "ec2.ts"), "utf-8");
    expect(content).toMatchSnapshot();
  });

  it("core/aws/lambda.ts matches snapshot", () => {
    const content = readFileSync(join(coreDir, "lambda.ts"), "utf-8");
    expect(content).toMatchSnapshot();
  });

  it("core/aws/simple-storage-service.ts matches snapshot", () => {
    const content = readFileSync(join(coreDir, "simple-storage-service.ts"), "utf-8");
    expect(content).toMatchSnapshot();
  });

  it("react/aws/ec2.tsx matches snapshot", () => {
    const content = readFileSync(join(reactDir, "ec2.tsx"), "utf-8");
    expect(content).toMatchSnapshot();
  });

  it("react/aws/lambda.tsx matches snapshot", () => {
    const content = readFileSync(join(reactDir, "lambda.tsx"), "utf-8");
    expect(content).toMatchSnapshot();
  });

  it("core barrel exports key icons", () => {
    const barrel = readFileSync(join(coreDir, "index.ts"), "utf-8");
    expect(barrel).toContain("awsEc2Svg");
    expect(barrel).toContain("awsLambdaSvg");
    expect(barrel).toContain("awsSimpleStorageServiceSvg");
  });

  it("react barrel exports key icons", () => {
    const barrel = readFileSync(join(reactDir, "index.ts"), "utf-8");
    expect(barrel).toContain("AwsEc2");
    expect(barrel).toContain("AwsLambda");
    expect(barrel).toContain("AwsSimpleStorageService");
  });
});
