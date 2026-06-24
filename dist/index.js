import { createRequire } from 'module';

createRequire(import.meta.url);

// src/transformer.ts
var TensegrityFormatLatexBlockTransformer = () => {
  return {
    name: "TensegrityFormatLatexBlock",
    textTransform(_ctx, src) {
      const codeBlocks = [];
      let text = src.replace(/(`{1,3})[\s\S]*?\1/g, (match) => {
        codeBlocks.push(match);
        return `__TENSEGRITY_CODE_MASK_${codeBlocks.length - 1}__`;
      });
      const blockMathRegex = /\$\$(.*?)\$\$/gs;
      text = text.replace(blockMathRegex, (match, content, offset, fullString) => {
        const textBeforeMatch = fullString.substring(0, offset);
        const lastNewlineIndex = textBeforeMatch.lastIndexOf("\n");
        const currentLineStart = textBeforeMatch.substring(lastNewlineIndex + 1);
        const prefixMatch = currentLineStart.match(/^[ \t]*(?:>[ \t]*)*/);
        const prefix = prefixMatch ? prefixMatch[0] : "";
        let cleanContent = content;
        if (prefix.trim() !== "") {
          const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          cleanContent = cleanContent.replace(new RegExp(`^${escapedPrefix}`, "gm"), "");
        }
        cleanContent = cleanContent.trim();
        const isMathAtStart = currentLineStart === prefix;
        const prepend = isMathAtStart ? "" : `
${prefix}`;
        const textAfterMatch = fullString.substring(offset + match.length);
        const lineAfterMatch = textAfterMatch.split(/\r?\n/)[0];
        const isMathAtEnd = lineAfterMatch.trim() === "";
        const append = isMathAtEnd ? "" : `
${prefix}`;
        return `${prepend}$$
${prefix}${cleanContent}
${prefix}$$${append}`;
      });
      text = text.replace(/__TENSEGRITY_CODE_MASK_(\d+)__/g, (match, index) => {
        const blockIndex = Number(index);
        return codeBlocks[blockIndex] ?? match;
      });
      return text;
    }
    // NOT needed: markdownPlugins, htmlPlugins, externalResources
  };
};

export { TensegrityFormatLatexBlockTransformer };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map