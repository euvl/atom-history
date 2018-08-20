var Collection = require('./collection');
var CompositeDisposable = require('atom').CompositeDisposable;

var collection = new Collection('atom-history-cache');
var defaultButtons = [
  {
    type: 'separator'
  },
  {
    label: 'Clear items',
    command: 'atom-history:clear'
  }
];

var getTemplate = () => {
  return atom.menu.template.filter(v => v.label === 'History')[0];
}

var render = () => {
  var template = getTemplate();

  if (template) {
    var submenu = collection.files.map((v, i) => ({
        label: v.title,
        command: 'atom-history:open.' + i
      })
    );

    template.submenu = submenu.concat(defaultButtons);
    atom.menu.update();
  }
}

var append = (event) => {
  var uri = event.uri;

  if (uri) {
    collection.append(uri);
    render();
  }
}

var openCallback = (i) => {
  var file = collection.files[i];

  if (file) {
    return atom.workspace.open(file.uri);
  }
}

var clearCallback = () => {
  collection.clean();
  render();
}

module.exports = {
  init() {
    atom.workspace.onDidOpen(append);
    render();
  },
  subscribe() {
    var handlers = {};

    for (var i = 0; i < collection.files.length; i++) {
      handlers['atom-history:open [' + collection.files[i].uri + ']'] = openCallback.bind(null, i);
      // handlers['atom-history:open.' + i] = openCallback.bind(null, i);
    }

    handlers['atom-history:clear'] = clearCallback;
    return atom.commands.add('atom-workspace', handlers);
  },
  collection
};
