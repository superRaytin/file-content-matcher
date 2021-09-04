import sysPath from 'path'
import fs from 'fs'
import micromatch from 'micromatch'
import asyncPool from 'tiny-async-pool'

class FileContentMatcher {
  constructor() {
    this.defaultOptions = {
      filter: {
        namePatterns: [],
        contentRegExp: null,
        readOptions: {
          encoding: 'utf8',
          flag: 'r',
        },
      },
      recursiveDepth: 0,
      readFileConcurrency: 1000,
    }
    this.files = []
  }

  getNegationFilter() {
    const negationFilter = ['**/**']
    if (this.filter.namePatterns) {
      this.filter.namePatterns.forEach((item) => {
        if (item.indexOf('!') === 0) {
          negationFilter.push(item)
        }
      })
    }
    return negationFilter
  }

  init(criteria) {
    this.path = criteria.path
    this.recursiveDepth = criteria.recursiveDepth
    this.filter = criteria.filter ? { ...this.defaultOptions.filter, ...criteria.filter } : this.defaultOptions.filter
    this.readFileConcurrency = criteria.readFileConcurrency || this.defaultOptions.readFileConcurrency
    this.negationFilter = this.getNegationFilter()
    this.micromatchOptions = criteria.micromatchOptions || {}
  }

  match(criteria = {}) {
    this.init(criteria)

    if (!this.path) {
      throw new Error('The path is required')
    }

    return this.readDirectory(this.path).then(() => this.filterFileContent())
  }

  readDirectory(dir, depth = this.recursiveDepth) {
    return new Promise((resolve, reject) => {
      fs.readdir(dir, (err, list) => {
        if (err) return reject(err)

        const filteredList = micromatch(list, this.negationFilter, this.micromatchOptions)
        Promise.all(filteredList.map((item) => this.applyFilter(sysPath.resolve(dir, item), depth))).then(() => {
          resolve()
        })
      })
    })
  }

  applyFilter(filePath, depth) {
    return new Promise((resolve, reject) => {
      depth--
      fs.stat(filePath, (err, stats) => {
        if (err) return reject(err)
        if (stats.isDirectory()) {
          if (depth === 0) {
            resolve()
          } else {
            this.readDirectory(filePath, depth).then(() => {
              resolve()
            })
          }
        } else {
          const isFileMatch = micromatch.isMatch(filePath, this.filter.namePatterns, this.micromatchOptions)
          if (isFileMatch) {
            this.files.push(filePath)
          }
          resolve()
        }
      })
    })
  }

  readFileContent(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, this.filter.readOptions, (err, data) => {
        if (err) return reject(err)
        resolve(this.filter.contentRegExp.test(data) ? filePath : null)
      })
    })
  }

  filterFileContent() {
    if (!this.files.length || !this.filter.contentRegExp) {
      return Promise.resolve(this.files)
    }

    const readFileWrapper = (filePath) => this.readFileContent(filePath)

    return asyncPool(this.readFileConcurrency, this.files, readFileWrapper).then(res => res.filter(i => !!i))
  }
}

module.exports = FileContentMatcher
