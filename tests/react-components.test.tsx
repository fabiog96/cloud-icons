import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { AwsEc2, AwsLambda } from "../packages/react/src/aws";
import { createIcon } from "../packages/react/src/icon-base";

describe("createIcon", () => {
  it("creates a component with displayName", () => {
    const Icon = createIcon("TestIcon", "0 0 24 24", () => <path d="M0 0" />);
    expect(Icon.displayName).toBe("TestIcon");
  });

  it("renders an svg element with role img", () => {
    const Icon = createIcon("TestIcon", "0 0 24 24", () => <path d="M0 0" />);
    render(<Icon />);

    const svg = screen.getByRole("img");
    expect(svg).toBeInTheDocument();
    expect(svg.tagName).toBe("svg");
  });

  it("applies default size of 24", () => {
    const Icon = createIcon("TestIcon", "0 0 24 24", () => <path d="M0 0" />);
    render(<Icon />);

    const svg = screen.getByRole("img");
    expect(svg).toHaveAttribute("width", "24");
    expect(svg).toHaveAttribute("height", "24");
  });

  it("applies custom size", () => {
    const Icon = createIcon("TestIcon", "0 0 24 24", () => <path d="M0 0" />);
    render(<Icon size={48} />);

    const svg = screen.getByRole("img");
    expect(svg).toHaveAttribute("width", "48");
    expect(svg).toHaveAttribute("height", "48");
  });

  it("applies color, defaults to currentColor", () => {
    const Icon = createIcon("TestIcon", "0 0 24 24", () => <path d="M0 0" />);
    const { rerender } = render(<Icon />);

    const svg = screen.getByRole("img");
    expect(svg).toHaveAttribute("fill", "currentColor");

    rerender(<Icon color="#FF9900" />);
    expect(svg).toHaveAttribute("fill", "#FF9900");
  });

  it("applies className", () => {
    const Icon = createIcon("TestIcon", "0 0 24 24", () => <path d="M0 0" />);
    render(<Icon className="my-icon" />);

    const svg = screen.getByRole("img");
    expect(svg).toHaveClass("my-icon");
  });

  it("forwards ref", () => {
    const Icon = createIcon("TestIcon", "0 0 24 24", () => <path d="M0 0" />);
    const ref = createRef<SVGSVGElement>();
    render(<Icon ref={ref} />);

    expect(ref.current).toBeInstanceOf(SVGSVGElement);
  });

  it("sets viewBox from parameter", () => {
    const Icon = createIcon("TestIcon", "0 0 64 64", () => <path d="M0 0" />);
    render(<Icon />);

    const svg = screen.getByRole("img");
    expect(svg).toHaveAttribute("viewBox", "0 0 64 64");
  });
});

describe("generated AWS components", () => {
  it("AwsEc2 renders with correct viewBox and size", () => {
    render(<AwsEc2 size={32} />);

    const svg = screen.getByRole("img");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "32");
    expect(svg).toHaveAttribute("viewBox", "0 0 64 64");
  });

  it("AwsEc2 has correct displayName", () => {
    expect(AwsEc2.displayName).toBe("AwsEc2");
  });

  it("AwsLambda renders with default size", () => {
    render(<AwsLambda />);

    const svg = screen.getByRole("img");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "24");
  });

  it("AwsEc2 contains SVG paths", () => {
    const { container } = render(<AwsEc2 />);

    const paths = container.querySelectorAll("path");
    expect(paths.length).toBeGreaterThan(0);
  });
});
