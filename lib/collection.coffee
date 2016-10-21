os = require 'os'
homedir = os.homedir()

class Collection
  files: [],
  max: 20,
  constructor: (@storageKey) ->
    @files = JSON.parse(localStorage[@storageKey] or '[]')

  append: (uri, callback) ->
    title = uri

    if title.indexOf homedir == 0
      title = title.replace homedir, '~'

    record = {
      uri: uri,
      title: title
    }

    duplicates = @files.filter (v) ->
      v.uri == record.uri

    if duplicates.length > 0
      @files.splice @files.indexOf duplicates[0], 1

    if @files >= @max
      @files.splice(@max - 1)

    @files.unshift record
    localStorage[@storageKey] = JSON.stringify @files

    if callback
      callback record
  clean: () ->
    localStorage[@storageKey] = '[]'
    @files = []

 module.exports = Collection
