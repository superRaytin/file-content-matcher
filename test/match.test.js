import path from 'path'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import FileContentMatcher from '../lib'

chai.use(chaiAsPromised)

const expect = chai.expect

describe('GitLabDB', function() {
  this.timeout(200000)
  
  let matcher

  before((done) => {
    matcher = new FileContentMatcher()
    done()
  })

  it('Should return the .md files only', () => {
    return matcher.match({
      path: path.resolve(process.env.PWD, 'test/testFiles'),
      filter: {
        namePatterns: ['**/*.md'],
      },
    }).then(files => {
      expect(files.length).to.equal(1)
      expect(files[0]).to.equal(path.resolve(process.env.PWD, 'test/testFiles/r.md'))
    })
  })

  it('Should return the .less files and content contains ".container" class', () => {
    return matcher.match({
      path: path.resolve(process.env.PWD, 'test/testFiles'),
      filter: {
        namePatterns: ['**/*.less'],
        contentRegExp: /\.container/,
      },
    }).then(files => {
      expect(files[0]).to.equal(path.resolve(process.env.PWD, 'test/testFiles/a/a1/index.less'))
    })
  })

  it('Should return the .js files not in "c" folder and content match /Modal.*@\/components/', () => {
    return matcher.match({
      path: path.resolve(process.env.PWD, 'test/testFiles'),
      filter: {
        namePatterns: ['**/*.js', '!c'],
        contentRegExp: /Modal.*@\/components/,
      },
    }).then(files => {
      expect(files.length).to.equal(1)
      expect(files[0]).to.equal(path.resolve(process.env.PWD, 'test/testFiles/a/modal.js'))
    })
  })
})