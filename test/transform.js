var fs = require('fs')
  , should = require('should')
  , path = require('path')
  , through = require('through')
  , staticFileMap = require('./fixtures/static-file-map.json')
  , transform = require('..')(staticFileMap)

describe('transform()', function () {
  it('should return the mapped version path if it exists in the map', function (done) {
    var testFile = path.join(__dirname, 'fixtures', 'pre', 'basic.jade')
      , resultFile = path.join(__dirname, 'fixtures', 'post', 'basic.jade')

    testPrePost(testFile, resultFile, done)
  })

  it('should return the original path if it does not exist in the map', function (done) {
    var testFile = path.join(__dirname, 'fixtures', 'pre', 'not-mapped.jade')
      , resultFile = path.join(__dirname, 'fixtures', 'post', 'not-mapped.jade')

    testPrePost(testFile, resultFile, done)
  })

  it('should return double quotes if double quotes are used', function (done) {
    var testFile = path.join(__dirname, 'fixtures', 'pre', 'double-quotes.jade')
      , resultFile = path.join(__dirname, 'fixtures', 'post', 'double-quotes.jade')

    testPrePost(testFile, resultFile, done)
  })

  it('should do nothing if no versionPath is found', function (done) {
    var testFile = path.join(__dirname, 'fixtures', 'pre', 'no-version-path.jade')
      , resultFile = path.join(__dirname, 'fixtures', 'post', 'no-version-path.jade')

    testPrePost(testFile, resultFile, done)
  })

  function testPrePost(pre, post, callback) {
    var data = ''

    fs.createReadStream(pre)
      .pipe(transform(pre))
      .pipe(through(write, end))

    function write (buf) { data += buf }
    function end () {
      fs.readFile(post, 'utf-8', function (error, result) {
        if (error) return callback(error)

        should.equal(data, result)
        callback()
      })
    }
  }
})