import { createRequire } from 'module';

createRequire(import.meta.url);

// src/transformer.ts
var TensegrityFormatLatexBlockTransformer = () => {
  return {
    name: "TensegrityFormatLatexBlock",
    textTransform(_ctx, src) {
      let text = src;
      const blockMathRegex = /\$\$(.*?)\$\$/gs;
      text = src.replace(blockMathRegex, (match, content, offset, fullString) => {
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
      return text;
    }
    // NOT needed: markdownPlugins, htmlPlugins, externalResources
  };
};

export { TensegrityFormatLatexBlockTransformer };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map