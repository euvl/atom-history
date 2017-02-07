var AtomHistory;
//var CompositeDisposable = require('atom').CompositeDisposable;
var controller = require('./atom-history-ctrl');

module.exports = {
  activate: (state) => {
    controller.init();
    this.subscription = controller.subscribe();
    //this.subscriptions = new CompositeDisposable();
    //for (var i = 0; i < controller.collection.max; i++) {
    //  this.subscriptions.add(controller.subscribe(i));
    //}
  },
  deactivate: () => {
    this.subscription.dispose();
  }
};
