
var exec = require('cordova/exec');
var channel = require('cordova/channel');

module.exports = {

  _channels: {},
  createEvent: function(type, data) {
      var event = document.createEvent('Event');
      event.initEvent(type, false, false);
      if (data) {
          for (var i in data) {
              if (data.hasOwnProperty(i)) {
                  event[i] = data[i];
              }
          }
      }
      return event;
  },
  fireNativeEvent: function (eventname, data, success, error) {
     exec(success, error, "broadcaster", "fireNativeEvent", [ eventname, data ]);
  },
  fireEvent: function (type, data) {
     var event = this.createEvent( type, data );
     if (event && (event.type in this._channels)) {
         this._channels[event.type].fire(event);
     }
  },
  //removeChannel: function( eventname ) {
  //  delete this._channels[eventname];
  //},
  addEventListener: function (eventname,f) {
     if (!(eventname in this._channels)) {
         this._channels[eventname] = channel.create(eventname);
     }
     this._channels[eventname].subscribe(f);
  },
  removeEventListener: function(eventname, f) {
     if (eventname in this._channels) {
         this._channels[eventname].unsubscribe(f);
     }
  }

};