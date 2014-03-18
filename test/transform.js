var fs = require('fs')
  , should = require('should')
  , path = require('path')
  , through = require('through')
  , staticFileMap = require('./fixtures/static-file-map.json')
  , transform = require('..')(staticFileMap)

describe('transform()', function () {
  it('should do some transform thing', function (done) {
    var testFile = path.join(__dirname, 'fixtures', 'pre', 'basic.jade')
      , resultFile = path.join(__dirname, 'fixtures', 'post', 'basic.jade')
      , data = ''

    fs.createReadStream(testFile)
      .pipe(transform(testFile))
      .pipe(through(write, end))

    function write (buf) { data += buf }
    function end () {
      fs.readFile(resultFile, 'utf-8', function (error, result) {
        if (error) return done(error)

        should.equal(data, result)
        done()
      })
    }
  })
})