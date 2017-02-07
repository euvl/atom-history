var os = require('os');
var homedir = os.homedir();

var Collection = function(storageKey) {
  this.max = 20;
  this.storageKey = storageKey;
  this.files = JSON.parse(localStorage[this.storageKey] || '[]');

  this.append = (uri, callback) => {
    if (uri.indexOf('atom://') === 0) {
      return;
    }

    var title = uri.indexOf(homedir) === 0
      ? uri.replace(homedir, '~')
      : uri;

    var record = {uri: uri, title: title};

    this.files = this.files.filter(v => v.uri !== record.uri);

    if (this.files.length >= this.max) {
      this.files.splice(this.max - 1);
    }

    this.files = [record].concat(this.files);

    localStorage[this.storageKey] = JSON.stringify(this.files);
    callback && callback(record);
  };

  this.clean = () => {
    localStorage[this.storageKey] = '[]';
    this.files = [];
  };
}

module.exports = Collection;
