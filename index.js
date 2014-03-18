var through = require('through')

function browversionator(staticFileMap) {
  this.staticFileMap = staticFileMap

  function compile(file, data, callback) {
    var versionPathRegex = /versionPath\(['"](.*)(['"])\)/gm
      , match = versionPathRegex.exec(data)

    while (match !== null) {
      var replacement = match[1]

      if (this.staticFileMap[replacement]) {
        replacement = this.staticFileMap[replacement]
      }

      var escapedMatch = match[0].replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1')
        , instanceRegex = new RegExp(escapedMatch, 'gm')

      data = data.replace(instanceRegex, match[2] + replacement + match[2])

      match = versionPathRegex.exec(data)
    }

    callback(null, data)
  }

  function transform(file) {
    var data = ''
      , stream = through(write, end)

    return stream

    function write(buf) {
      data += buf
    }

    function end() {
      compile(file, data, function(error, result) {
        if (error) stream.emit('error', error)
        stream.queue(result)
        stream.queue(null)
      })
    }
  }

  return transform
}

module.exports = browversionator