#extension controller singleton
os = require 'os'
Collection = require './collection'

self = module.exports =
  collection: new Collection('atom-history-cache'),

  init: ->
    atom.workspace.onDidOpen (@append.bind(this))
    @render()

  getTemplate: () ->
    template = atom.menu.template.filter (v) ->
      v.label == 'History'
    return if template.length > 0 then template[0] else null

  append: (event) ->
    uri = event.uri

    if uri
      @collection.append(uri)
      @render()

  render: () ->
    template = @getTemplate()

    if template
      template.submenu = @collection.files
        .map (v, i) -> {
          label: v.title,
          command: 'atom-history:open.' + i
        }
      atom.menu.update()

  subscribeTo: (i) ->
    fn = {}
    fn['atom-history:open.' + i] = @open.bind(this, i)
    return atom.commands.add('atom-workspace', fn)

  open: (i) ->
    file = @collection.files[i]
    if file
      atom.workspace.open(file.uri)
