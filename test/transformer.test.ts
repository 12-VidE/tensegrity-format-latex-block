import { describe, expect, it } from "vitest";
import { TensegrityFormatLatexBlockTransformer } from "../src/transformer";
import { createCtx } from "./helpers";

describe("TensegrityFormatLatexBlock", () => {
  it("forces single-line $$ math into strictly isolated multi-line blocks", () => {
    const ctx = createCtx();
    const transformer = TensegrityFormatLatexBlockTransformer();

    const input = "The equation $$x^2 + y^2 = z^2$$ sits inline.";
    const expected = "The equation \n$$\nx^2 + y^2 = z^2\n$$\n sits inline.";

    const result = transformer.textTransform!(ctx, input);

    expect(result).toBe(expected);
  });

  it("trims and normalizes existing sloppy multi-line math blocks", () => {
    const ctx = createCtx();
    const transformer = TensegrityFormatLatexBlockTransformer();

    const input = "$$\n   \\frac{1}{2}   \n$$";
    const expected = "\n$$\n\\frac{1}{2}\n$$\n";

    const result = transformer.textTransform!(ctx, input);

    expect(result).toBe(expected);
  });
});