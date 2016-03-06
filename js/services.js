angular.module('starter.services', [])
.factory('Maker', function($http, Settings) {
  // TODO more format?
  function replaceValue(value) {
    if (value) {
      if (value == "Location") {
        var position = Settings.data(IFTTT.CURRENT_LOCATION);

        return position.coords.latitude + "," + position.coords.longitude;
      } else if (value == "Time") {
        return Date.now();
      }
      return value;
    }
  }

  return {
    triggerEvent : function (/*Object*/ trigger) {
          // increse the counter for selected trigger
          // trigger.counter++;

          var makerUrl = "https://maker.ifttt.com/trigger/" + trigger.event + "/with/key/" + Settings.makerKey();
          var value = {
            value1: replaceValue(trigger.value1),
            value2: replaceValue(trigger.value2),
            value3: replaceValue(trigger.value3)
          };

          console.log(makerUrl);
          console.log(value);

          $http({
              url: makerUrl,
              method: 'post',
              type: 'json',
              data: value
            }).then(function successCallback(response) {
              console.log(response);
              // this callback will be called asynchronously
              // when the response is available
            }, function errorCallback(response) {
              console.log(response);
              // called asynchronously if an error occurs
              // or server returns response with an error status.
            });
    }
  };
})

.factory('Settings', function() {
  var EVENTS_KEY = "events";
  var VALUES_KEY = "values";

  var TRIGGERS_DATA = "triggers";
  var MAKER_KEY = "maker_key";
  var rev = 0;
  return {
    events : function( /**/ events) {
      var result;
      if (events === undefined) {
        result = JSON.parse(localStorage.getItem(EVENTS_KEY));
      } else {
        result = localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
      }

      if (!result) {
        result = [];
      }
      return result;
    },

    values : function( /**/ values) {
      var result;
      if (values === undefined) {
        result = JSON.parse(localStorage.getItem(VALUES_KEY));
      } else {
        result = localStorage.setItem(VALUES_KEY, JSON.stringify(values));
      }

      if (!result) {
        result = [];
      }
      return result;
    },

    triggers : function( /**/ triggers) {
      var result;
      if (triggers === undefined) {
        result = JSON.parse(localStorage.getItem(TRIGGERS_DATA));
      } else {
        rev++;
        result = localStorage.setItem(TRIGGERS_DATA, JSON.stringify(triggers));
      }

      if (!result) {
        result = {};
      }
      return result;
    },

    triggersRev : function () {
      return rev;
    },

    deleteTrigger : function( /**trigger*/ trigger) {
      var triggers = localStorage.getItem(TRIGGERS_DATA);
      var pos = triggers.indexOf(trigger);
      console.log("Delete trigger at : " + pos);
      triggers.splice(pos, 1);
      localStorage.setItem(TRIGGERS_DATA, triggers);
    },

    updateTrigger : function( /**Object*/ trigger) {
      // Update triggers
      var triggers = localStorage.getItem(TRIGGERS_DATA);
      var pos = triggers.indexOf(trigger);
      if (pos >= 0) {
        triggers.splice(pos, 1, trigger);
        localStorage.setItem(TRIGGERS_DATA, triggers);
      } else {
        console.log("Unable to find trigger to update");
      }
    },

    genUUID : function() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
        function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
    },

    makerKey: function(/**/ key) {
      var result;
      if (key === undefined) {
        result = localStorage.getItem(MAKER_KEY);
      } else {
        result = localStorage.setItem(MAKER_KEY, key);
      }
      return result;
    }
  };
})
.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
