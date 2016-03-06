angular.module('starter.services', [])
.factory('Maker', function($http, Locations, Settings) {
  // TODO more format?
  function replaceValue(value) {
    if (value) {
      if (value == "Location") {
        var position = Locations.position();

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
  var CURRENT_POSITION_KEY = "currentPosition";
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

    position : function( /**/ position) {
      var result;
      if (position === undefined) {
        result = JSON.parse(localStorage.getItem(CURRENT_POSITION_KEY));
      } else {
        result = localStorage.setItem(CURRENT_POSITION_KEY, JSON.stringify(position));
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

.factory('Locations', function($http) {
  var cachePosition;
  var MAX_RETRY = 3; // retry 3 times to get more accuracy
  var ACCURACY = 5; // meter
  function getPosition(times) {
    navigator.geolocation.getCurrentPosition(function(position) {
      if (position.coords.accuracy && position.coords.accuracy < ACCURACY
        || times > MAX_RETRY) {
          cachedPosition = position;
          var url = 'http://nominatim.openstreetmap.org/reverse?format=json&lat=' + position.coords.latitude + '&lon=' + position.coords.longitude + '&zoom=18&addressdetails=1';
          $http(
            {
              url: url,
              type: 'json'
            }).then(function successCallback(response) {
              console.log(response);
              // this callback will be called asynchronously
              // when the response is available
            }, function errorCallback(response) {
              console.log(response);
              // called asynchronously if an error occurs
              // or server returns response with an error status.
            });
          // TODO show a warning when the accuracy is still not statisfied.
      } else {
        getPosition(++times);
      }
    }, function(error) {
      console.log(error);
    }, {
      enableHighAccuracy: true
    });
  };

  getPosition(0);
  return {
    position: function() {
      return cachedPosition;
    }
  };
});
