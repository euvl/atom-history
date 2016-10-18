{CompositeDisposable} = require 'atom'
controller = require './atom-history-ctrl'

module.exports = AtomHistory =
  subscriptions: null

  activate: (state) ->
    controller.init()
    @subscriptions = new CompositeDisposable

    i = 0

    while i < controller.max_length
      subscription = controller.subscribeTo i
      i++

  deactivate: ->
    @subscriptions.dispose()
