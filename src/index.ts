import type { LoadContext, OptionValidationContext, Plugin } from '@docusaurus/types'
import { Joi } from '@docusaurus/utils-validation'

export interface Options {
  /** The Site ID from your Foresite line (Settings → Install), like s_k3v9q2m7xw4a. */
  siteId: string
  /**
   * Where the Tracking Script is served from: t.foresite.dev, or your own
   * Custom Domain or Self-Hosted Proxy, like stats.example.com.
   */
  host?: string
  /** false leaves the script out, for example on a staging deploy. */
  enabled?: boolean
}

export type PluginOptions = Required<Options>

/** "s_" and 12 characters from Foresite's alphabet, which leaves out l, o, 0 and 1. */
const SITE_ID = /^s_[a-km-np-z2-9]{12}$/

const schema = Joi.object<PluginOptions>({
  siteId: Joi.string().pattern(SITE_ID).required().messages({
    'string.pattern.base': `"siteId" must be your Foresite Site ID, like s_k3v9q2m7xw4a. Copy it from Settings → Install.`,
  }),
  host: Joi.string()
    // Accept https:// and a trailing slash, since people paste addresses.
    .custom((v: string) => v.replace(/^https?:\/\//, '').replace(/\/+$/, ''))
    .pattern(/^[a-z0-9.-]+(:\d+)?$/i)
    .default('t.foresite.dev'),
  enabled: Joi.boolean().default(true),
})

export function validateOptions({ validate, options }: OptionValidationContext<Options, PluginOptions>): PluginOptions {
  return validate(schema, options)
}

/**
 * Adds the Tracking Script to the <head> of every page of a production build.
 * The script counts Docusaurus's client-side page changes itself.
 */
export default function pluginForesite(_context: LoadContext, options: PluginOptions): Plugin | null {
  if (!options.enabled || process.env.NODE_ENV !== 'production') return null
  return {
    name: 'docusaurus-plugin-foresite',
    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: 'script',
            attributes: { defer: true, src: `https://${options.host}/s/${options.siteId}.js` },
          },
        ],
      }
    },
  }
}
