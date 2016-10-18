AtomHistoryView = require './atom-history-view'
{CompositeDisposable} = require 'atom'

module.exports = AtomHistory =
  atomHistoryView: null
  modalPanel: null
  subscriptions: null

  activate: (state) ->
    @atomHistoryView = new AtomHistoryView(state.atomHistoryViewState)
    @modalPanel = atom.workspace.addModalPanel(item: @atomHistoryView.getElement(), visible: false)

    # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    @subscriptions = new CompositeDisposable

    # Register command that toggles this view
    @subscriptions.add atom.commands.add 'atom-workspace', 'atom-history:toggle': => @toggle()

  deactivate: ->
    @modalPanel.destroy()
    @subscriptions.dispose()
    @atomHistoryView.destroy()

  serialize: ->
    atomHistoryViewState: @atomHistoryView.serialize()

  toggle: ->
    console.log 'AtomHistory was toggled!'

    if @modalPanel.isVisible()
      @modalPanel.hide()
    else
      @modalPanel.show()
