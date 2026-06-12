import { createRequire } from 'module';

createRequire(import.meta.url);

// src/transformer.ts
var TensegrityFormatLatexBlockTransformer = () => {
  return {
    name: "TensegrityFormatLatexBlock",
    textTransform(_ctx, src) {
      const blockMathRegex = /\$\$(.*?)\$\$/gs;
      return src.replace(blockMathRegex, (_match, content) => {
        return `
$$
${content.trim()}
$$
`;
      });
    }
    // NOT needed: markdownPlugins, htmlPlugins, externalResources
  };
};

export { TensegrityFormatLatexBlockTransformer };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map