import { createRequire } from 'module';

createRequire(import.meta.url);

// src/transformer.ts
var TensegrityFormatLatexBlockTransformer = () => {
  return {
    name: "TensegrityFormatLatexBlock",
    textTransform(_ctx, src) {
      let text = src;
      const blockMathRegex = /\$\$(.*?)\$\$/gs;
      text = text.replace(blockMathRegex, (_match, content, offset, fullString) => {
        const textBeforeMatch = fullString.substring(0, offset);
        const lastNewlineIndex = textBeforeMatch.lastIndexOf("\n");
        const currentLineStart = textBeforeMatch.substring(lastNewlineIndex + 1);
        const prefixMatch = currentLineStart.match(/^[ \t]*(?:>[ \t]*)*/);
        const prefix = prefixMatch ? prefixMatch[0] : "";
        let cleanContent = content;
        if (prefix) {
          const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          cleanContent = cleanContent.replace(new RegExp(`^${escapedPrefix}`, "gm"), "");
        }
        cleanContent = cleanContent.trim();
        return `
${prefix}$$
${prefix}${cleanContent}
${prefix}$$
`;
      });
      return text;
    }
    // NOT needed: markdownPlugins, htmlPlugins, externalResources
  };
};

export { TensegrityFormatLatexBlockTransformer };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map