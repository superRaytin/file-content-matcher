# file-content-matcher
Search files recursively using content match.

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]

[npm-url]: https://npmjs.org/package/file-content-matcher
[downloads-image]: http://img.shields.io/npm/dm/file-content-matcher.svg
[npm-image]: http://img.shields.io/npm/v/file-content-matcher.svg

## Install

```
npm i file-content-matcher
```

## Quick Start

```js
import FileContentMatcher from 'file-content-matcher'

const matcher = new FileContentMatcher()
matcher.match(
  {
    path: 'path to search',
    filter: {
      namePatterns: ['**/*.js'],
      contentRegExp: /test/,
    },
  }
).then(files => {
  // ...
})
```

## API

### matcher.match(criteria)

Returns a Promise, resolved with an array of filepaths that matched the criteria.

- **path:** Path to search. Example: `./src/`
- **filter:** Options for filtering files.
  - **namePatterns:** Glob pattern for looking for files. Example: `['**/*.js']`. Default: `[]`.
  - **contentRegExp:** RegExp to match file content, ie: `/test/i`. Default: `null`.
  - **readOptions:** These options will be used in the Node.js `fs.ReadFile` function. Default: `{ encoding:'utf8', flag: 'r' }`
- **recursiveDepth:** Tells the finder how to search recursively from the given path. Default: `0`.
- **readFileConcurrency:** The concurrency behavior for reading files. Useful when we search a large folder which may cause `EMFILE: too many open files` errors. Default: `1000`
- **micromatchOptions:** These options will be used in `micromatch.match` function. For more details, refer to [micromatch#options](https://github.com/micromatch/micromatch#options).