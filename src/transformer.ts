import type { QuartzTransformerPlugin, BuildCtx } from "@quartz-community/types";

/**
 * @returns Converts "$$...$$" to "$$\n ...\n $$" to render correctly
 * No user options needed
 */
export const TensegrityFormatLatexBlockTransformer: QuartzTransformerPlugin = () => {
  return {
    name: "TensegrityFormatLatexBlock",

    textTransform(_ctx: BuildCtx, src: string) {
      let text = src
      // Match ANY $$...$$ block globally, regardless of where it sits on the line
      const blockMathRegex = /\$\$(.*?)\$\$/gs;
      text = text.replace(blockMathRegex, (_match, content, offset, fullString) => {
        // 1. Look backward from the $$ to find the start of the current line
        const textBeforeMatch = fullString.substring(0, offset);
        const lastNewlineIndex = textBeforeMatch.lastIndexOf('\n');
        const currentLineStart = textBeforeMatch.substring(lastNewlineIndex + 1);
        
        // 2. Extract the blockquote prefix (e.g., "> ", "> > ") if it exists on this line
        const prefixMatch = currentLineStart.match(/^[ \t]*(?:>[ \t]*)*/);
        const prefix = prefixMatch ? prefixMatch[0] : '';
        
        // 3. Clean the internal math content of any existing matching prefixes 
        // to prevent double-prefixing if you typed a multi-line equation in a callout
        let cleanContent = content;
        if (prefix) {
          const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          cleanContent = cleanContent.replace(new RegExp(`^${escapedPrefix}`, 'gm'), '');
        }
        cleanContent = cleanContent.trim();
        
        // 4. Rebuild the block. 
        // The final trailing ${prefix} ensures that any inline text occurring AFTER 
        // the $$ block safely continues on a correctly prefixed line.
        return `\n${prefix}$$\n${prefix}${cleanContent}\n${prefix}$$\n`;
      });

      return text;
    }

    // NOT needed: markdownPlugins, htmlPlugins, externalResources
  };
};
      
      
      
      