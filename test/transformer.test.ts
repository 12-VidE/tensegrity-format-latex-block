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

  it("safely expands inline $$ math INSIDE a callout without breaking the blockquote", () => {
    const ctx = createCtx();
    const transformer = TensegrityFormatLatexBlockTransformer();

    // Math is written on a single line with a blockquote prefix
    const input = "> $$E = mc^2$$";
    
    // The script must maintain the "> " prefix on the injected empty spacer lines
    const expected = "\n> $$\n> E = mc^2\n> $$\n";

    const result = transformer.textTransform!(ctx, input);
    expect(result).toBe(expected);
  });

  it("cleans up sloppy multi-line math inside deeply nested callouts", () => {
    const ctx = createCtx();
    const transformer = TensegrityFormatLatexBlockTransformer();

    // Math inside a nested quote, where the user manually typed the prefixes inside the block
    const input = "> > $$a^2$$";
    
    // It should strip the redundant internal prefixes, trim, and rebuild the block perfectly
    const expected = "\n> > $$\n> > a^2\n> > $$\n";

    const result = transformer.textTransform!(ctx, input);
    expect(result).toBe(expected);
  });
});