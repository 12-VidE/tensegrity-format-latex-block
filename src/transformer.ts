import type { QuartzTransformerPlugin, BuildCtx } from "@quartz-community/types";

/**
 * @returns Converts "$$...$$" to "$$\n ...\n $$" to render correctly
 * No user options needed
 */
export const TensegrityFormatLatexBlockTransformer: QuartzTransformerPlugin = () => {
  return {
    name: "TensegrityFormatLatexBlock",

    textTransform(_ctx: BuildCtx, src: string) {
      // Get inline $$...$$
      const blockMathRegex = /\$\$(.*?)\$\$/gs;

      return src.replace(blockMathRegex, (_match, content) => {
        return `\n$$\n${content.trim()}\n$$\n`;
      })
    }

    // NOT needed: markdownPlugins, htmlPlugins, externalResources
  };
};
