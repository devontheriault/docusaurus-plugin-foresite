import { afterEach, describe, expect, it } from 'vitest'
import { normalizePluginOptions } from '@docusaurus/utils-validation'
import type { LoadContext } from '@docusaurus/types'
import pluginForesite, { validateOptions, type Options } from '../src/index'

const validate = (options: Partial<Options>) =>
  validateOptions({ options: options as Options, validate: normalizePluginOptions as never })

const headTags = (options: Partial<Options>) => {
  const plugin = pluginForesite({} as LoadContext, validate(options))
  return plugin && (plugin.injectHtmlTags!({ content: null }) as { headTags: unknown[] }).headTags
}

const env = process.env.NODE_ENV
afterEach(() => {
  process.env.NODE_ENV = env
})

describe('docusaurus-plugin-foresite', () => {
  it('adds the Tracking Script to production builds', () => {
    process.env.NODE_ENV = 'production'
    expect(headTags({ siteId: 's_k3v9q2m7xw4a' })).toEqual([
      { tagName: 'script', attributes: { defer: true, src: 'https://t.foresite.dev/s/s_k3v9q2m7xw4a.js' } },
    ])
  })

  it('uses a Custom Domain, however it was written', () => {
    process.env.NODE_ENV = 'production'
    for (const host of ['stats.example.com', 'https://stats.example.com', 'https://stats.example.com/']) {
      expect(headTags({ siteId: 's_k3v9q2m7xw4a', host })).toEqual([
        { tagName: 'script', attributes: { defer: true, src: 'https://stats.example.com/s/s_k3v9q2m7xw4a.js' } },
      ])
    }
  })

  it('is off in development and when disabled', () => {
    process.env.NODE_ENV = 'development'
    expect(headTags({ siteId: 's_k3v9q2m7xw4a' })).toBeNull()
    process.env.NODE_ENV = 'production'
    expect(headTags({ siteId: 's_k3v9q2m7xw4a', enabled: false })).toBeNull()
  })

  it('rejects a missing or mistyped Site ID with a helpful message', () => {
    expect(() => validate({})).toThrow(/"siteId" is required/)
    expect(() => validate({ siteId: 's_k3v9q2m7xw4l' })).toThrow(/Copy it from Settings → Install/)
    expect(() => validate({ siteId: 's_k3v9q2m7xw4a', host: 'stats.example.com/path' })).toThrow(/host/)
  })
})
