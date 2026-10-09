# docusaurus-plugin-foresite

[Foresite](https://foresite.dev) for Docusaurus: privacy-first website analytics with no cookies and nothing that identifies your readers.

The plugin adds the Foresite Tracking Script to every page of your production build. Docusaurus's client-side page changes are counted as pageviews automatically, and you see which searches and sites send readers to your docs.

## Setup

```sh
npm install docusaurus-plugin-foresite
```

```js
// docusaurus.config.js
export default {
  // ...
  plugins: [
    ['docusaurus-plugin-foresite', { siteId: 's_k3v9q2m7xw4a' }], // from Settings → Install in Foresite
  ],
}
```

Don't have a Site ID yet? [Start a free 7-day trial](https://app.foresite.dev), no card required, or open the [live demo](https://app.foresite.dev/demo).

## Options

| Option | Default | |
|---|---|---|
| `siteId` | required | Your Site ID, from **Settings → Install**. |
| `host` | `t.foresite.dev` | Where the script is served from. Set it to your [custom domain](https://foresite.dev/docs/custom-domain) (like `stats.example.com`) so ad blockers don't hide your readers. |
| `enabled` | `true` | `false` leaves the script out, for example on a staging deploy. |

The script is only added to production builds (`docusaurus build`), not to `docusaurus start`. Visits to `localhost` are never counted, so `docusaurus serve` won't add test traffic either.

## Custom events

To count actions such as downloads or signups, call `window.foresite('download')` from your own components. See [custom events, goals and revenue](https://foresite.dev/docs/custom-events).

## License

MIT. The Tracking Script itself is [open source](https://github.com/devontheriault/foresite-tracker) too.
