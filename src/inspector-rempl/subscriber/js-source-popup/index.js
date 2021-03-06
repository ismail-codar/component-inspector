var Value = require('basis.data').Value;
var Popup = require('basis.ui.popup').Popup;
var getSourceFragment = require('../remote.js').getRemoteMethod('getSourceFragment');
var sourceLoc = new Value();
var source = new Value({ value: '' });

sourceLoc.as(function(loc) {
  if (loc && getSourceFragment.available) {
    getSourceFragment(loc, function(result) {
      if (loc === sourceLoc.value) {
        source.set(result);
        popup.realign();
      }
    });
  }

  source.set('');
});

var popup = new Popup({
  loc: sourceLoc,

  dir: 'top left bottom left',
  autorotate: [
    'bottom left top left'
  ],
  template: resource('./template/popup.tmpl'),
  binding: {
    isOpenFileSupported: basis.fn.$const(true), // FIXME: use real value
    loc: sourceLoc.as(function(loc) {
      return (loc || '').replace(/(:\d+){1,4}$/, '');
    }),
    source: source
  },

  setZIndex: function() {
    this.element.style.zIndex = 65000;
  }
});

source.link(popup, function(source) {
  if (source) {
    this.show();
  } else {
    this.hide();
  }
});

module.exports = popup;
