var Collection = require('./collection');
var collection = new Collection('atom-history-cache');

var getTemplate = () => {
  return atom.menu.template
    .filter(v => v.label === 'History')[0];
}

var init = () => {
  atom.workspace.onDidOpen(append);
  render();
}

var render = () => {
  var template = getTemplate();
  if (template) {
    template.submenu = collection.files
      .map((v, i) => {
        return {
          label: v.title,
          command: 'atom-history:open.' + i
      };
    });

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

var subscribe = (i) => {
  var fn = {};
  fn['atom-history:open.' + i] = open.bind(null, i);
  return atom.commands.add('atom-workspace', fn);
}

var open = (i) => {
  var file = collection.files[i];

  if (file) {
    return atom.workspace.open(file.uri);
  }
}

module.exports = {init, subscribe, collection};
