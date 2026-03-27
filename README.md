# @philiprehberger/pretty-ms

[![CI](https://github.com/philiprehberger/ts-pretty-ms/actions/workflows/ci.yml/badge.svg)](https://github.com/philiprehberger/ts-pretty-ms/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@philiprehberger/pretty-ms)](https://www.npmjs.com/package/@philiprehberger/pretty-ms)
[![License](https://img.shields.io/github/license/philiprehberger/ts-pretty-ms)](LICENSE)
[![Sponsor](https://img.shields.io/badge/sponsor-GitHub%20Sponsors-ec6cb9)](https://github.com/sponsors/philiprehberger)

Convert milliseconds to human-readable strings and back.

## Installation

```bash
npm install @philiprehberger/pretty-ms
```

## Usage

```ts
import { prettyMs, parseMs } from '@philiprehberger/pretty-ms';

prettyMs(9015000);
// => "2h 30m 15s"

prettyMs(9015000, { compact: true });
// => "2h"

prettyMs(9015000, { verbose: true });
// => "2 hours 30 minutes 15 seconds"

prettyMs(9015000, { colonNotation: true });
// => "2:30:15"

prettyMs(9015000, { unitCount: 2 });
// => "2h 30m"

parseMs('2h 30m 15s');
// => 9015000

parseMs('2:30:15');
// => 9015000
```

## API

### `prettyMs(ms: number, options?: PrettyMsOptions): string`

Convert milliseconds to a human-readable string.

**Options:**

| Option | Type | Default | Description |
|---|---|---|---|
| `compact` | `boolean` | `false` | Show only the most significant unit |
| `verbose` | `boolean` | `false` | Use full unit names |
| `colonNotation` | `boolean` | `false` | Use colon notation (H:MM:SS) |
| `unitCount` | `number` | `undefined` | Limit to N most significant units |

### `parseMs(str: string): number`

Parse a human-readable duration string back to milliseconds. Supports unit notation (`2h 30m 15s`) and colon notation (`2:30:15`).

## Development

```bash
npm install
npm run build
npm test
```

## License

MIT
