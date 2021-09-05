#! /usr/bin/env node
const program = require('commander')
const pkg = require('../package')
const FileContentMatcher = require('../lib')
const fileContentMatcher = new FileContentMatcher()

const list = (val) => {
  return val.split(/\s*,\s*/)
}

const regexp = (regStr) => {
  return new RegExp(regStr)
}

program
  .version(pkg.version, '-v, --version')
  .option('-p, --path <path>', 'set the path to be searched', process.cwd())
  .option('-n, --namePatterns <**/*.js,...>', 'set glob patterns for looking for files', list, [])
  .option('-c, --contentRegExp </test/i>', 'set regular expression to match file content', regexp, null)
  .option('-d, --depth <number>', 'set the search recursively depth from the given path', 0)
  .option('-concurrency, --readFileConcurrency <number>', 'set the concurrency behavior for reading files', 1000)
  .parse(process.argv)

const options = program.opts()

if (!options.path) {
  program.help()
  process.exit(0)
}

fileContentMatcher.match(
  {
    path: options.path,
    recursiveDepth: options.depth,
    readFileConcurrency: options.readFileConcurrency,
    filter: {
      namePatterns: options.namePatterns,
      contentRegExp: options.contentRegExp,
    },
  }
).then(files => {
  console.log(`[file-content-matcher] Done! ${files.length} files has been found`, files);
})