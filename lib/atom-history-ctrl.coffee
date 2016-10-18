#extension controller singleton
self = module.exports =
  storageKey: 'atom-history-cache'
  max_length: 20
  files: []

  init: ->
    string = localStorage[@storageKey] or '[]'
    @files = JSON.parse(string)

    atom.workspace.onDidOpen (@append.bind(this))
    @update()

  getTemplate: () ->
    template = atom.menu.template.filter (v) ->
      v.label == 'History'

    return if template.length > 0 then template[0] else null

  append: (event) ->
    uri = event.uri.trim()

    if uri
      index = @files.indexOf(uri)

      if index != -1
        @files.splice index, 1

      @files.unshift uri

      if @files.length > @max_length
        @files.splice(@max_length)

      setTimeout (->
        localStorage[@storageKey] = JSON.stringify(@files)
      ).bind(this), 0

      @update()

  update: () ->
    template = @getTemplate()

    if template
      template.submenu = @files.map (v, i) ->
        { label: v, command: 'atom-history:open.' + i }

      atom.menu.update()

  clear: () ->
    @files = []
    localStorage[@storageKey] = '[]'

  subscribeTo: (i) ->
    fn = {}
    fn['atom-history:open.' + i] = @open.bind(this, i)
    return atom.commands.add('atom-workspace', fn)

  open: (i) ->
    template = @getTemplate()

    if template
      submenu = template.submenu[i]

      if submenu
        atom.workspace.open(submenu.label)
