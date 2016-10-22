var os = require('os');
var homedir = os.homedir();

var Collection = function(storageKey) {
  this.max = 20;
  this.storageKey = storageKey;
  this.files = JSON.parse(localStorage[this.storageKey] || '[]');

  this.append = (uri, callback) => {
    var title = uri;

    if (title.indexOf(homedir) === 0) {
      title = title.replace(homedir, '~');
    }

    var record = {
      uri: uri,
      title: title
    };

    var duplicates = this.files
      .filter(v => v.uri === record.uri);

    if (duplicates.length > 0) {
      var i = this.files.indexOf(duplicates[0]);
      this.files.splice(i, 1);
    }

    if (this.files >= this.max) {
      this.files.splice(this.max - 1);
    }

    this.files.unshift(record);
    localStorage[this.storageKey] = JSON.stringify(this.files);
    callback && callback(record);
  };

  this.clean = () => {
    localStorage[this.storageKey] = '[]';
    this.files = [];
  };
}

module.exports = Collection;
