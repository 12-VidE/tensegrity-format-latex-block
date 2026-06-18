import { QuartzTransformerPlugin } from '@quartz-community/types';
export { PageGenerator, PageMatcher, QuartzComponent, QuartzComponentConstructor, QuartzComponentProps, QuartzEmitterPlugin, QuartzFilterPlugin, QuartzPageTypePlugin, QuartzPageTypePluginInstance, QuartzTransformerPlugin, StringResource, VirtualPage } from '@quartz-community/types';

/**
 * @returns Converts "$$...$$" to "$$\n ...\n $$" to render correctly
 * respecting blockquote prefixes and preventing redundant newlines.
 * No user options needed
 */
declare const TensegrityFormatLatexBlockTransformer: QuartzTransformerPlugin;

export { TensegrityFormatLatexBlockTransformer };
