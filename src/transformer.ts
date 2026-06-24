import type { QuartzTransformerPlugin, BuildCtx } from "@quartz-community/types";

/**
 * @returns Converts "$$...$$" to "$$\n ...\n $$" to render correctly
 * respecting blockquote prefixes and preventing redundant newlines.
 * No user options needed
 */
export const TensegrityFormatLatexBlockTransformer: QuartzTransformerPlugin = () => {
  return {
    name: "TensegrityFormatLatexBlock",

    textTransform(_ctx: BuildCtx, src: string) {
      // 1. Mask code blocks to protect them from regex mutations
      const codeBlocks: string[] = [];
      // Matches 1 to 3 backticks, then lazily matches content until the same number of backticks
      let text = src.replace(/(`{1,3})[\s\S]*?\1/g, (match) => {
        codeBlocks.push(match);
        return `__TENSEGRITY_CODE_MASK_${codeBlocks.length - 1}__`;
      });

      // 2. Match ANY $$...$$ block globally, regardless of where it sits on the line
      const blockMathRegex = /\$\$(.*?)\$\$/gs;
      text = text.replace(blockMathRegex, (match, content, offset, fullString) => {
        // 1. Analyze the context BEFORE the $$
        const textBeforeMatch = fullString.substring(0, offset);
        const lastNewlineIndex = textBeforeMatch.lastIndexOf('\n');
        const currentLineStart = textBeforeMatch.substring(lastNewlineIndex + 1);
        
        // 2. Extract the blockquote prefix (e.g., "> ", "> > ")
        const prefixMatch = currentLineStart.match(/^[ \t]*(?:>[ \t]*)*/);
        const prefix = prefixMatch ? prefixMatch[0] : '';
        
        // 3. Clean the internal math content
        let cleanContent = content;
        if (prefix.trim() !== '') {
          const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          cleanContent = cleanContent.replace(new RegExp(`^${escapedPrefix}`, 'gm'), '');
        }
        cleanContent = cleanContent.trim();
        
        // 4. Condition BEFORE: Is the $$ the first non-prefix string on the line?
        // If not, we must force a newline and append the prefix.
        const isMathAtStart = currentLineStart === prefix;
        const prepend = isMathAtStart ? '' : `\n${prefix}`;
        
        // 5. Condition AFTER: Is there text immediately after the closing $$ on the same line?
        // If there is, we must push it to a new line and give it the prefix.
        const textAfterMatch = fullString.substring(offset + match.length);
        const lineAfterMatch = textAfterMatch.split(/\r?\n/)[0]; // Look only at the rest of the current line
        const isMathAtEnd = lineAfterMatch.trim() === '';
        const append = isMathAtEnd ? '' : `\n${prefix}`;
        
        // 6. Rebuild the block
        return `${prepend}$$\n${prefix}${cleanContent}\n${prefix}$$${append}`;
      });
      text = text.replace(/__TENSEGRITY_CODE_MASK_(\d+)__/g, (match: string, index: string) => {
        const blockIndex = Number(index);
        return codeBlocks[blockIndex] ?? match;
      });

      return text;
    }
    
    // NOT needed: markdownPlugins, htmlPlugins, externalResources
  };
};
      
      
      
      