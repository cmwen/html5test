'use strict'

angular.module('starter.controllers', [])

.controller('TriggersCtrl', function($scope, $stateParams, Settings, $location, Maker) {
  $scope.triggers = Settings.triggers();

  $scope.$watch(function(){return Settings.triggersRev();}, function (newVal, oldVal){
    if (newVal != oldVal) {
      console.log(newVal);
      $scope.triggers = Settings.triggers();
    }
  });

  console.log($scope.triggers);
  $scope.deleteAllTriggers = function() {
    Settings.triggers({});

  };

  $scope.fire = function(trigger) {
    console.log(trigger);
    Maker.triggerEvent(trigger);
  };

  $scope.edit = function(trigger) {
    $location.path("/tab/triggers/" + trigger.id);
  };

  $scope.remove = function(trigger) {

  };
})

.controller('TriggerDetailCtrl', function($scope, $stateParams, Settings, $ionicHistory) {
  $scope.events = Settings.events();
  $scope.values = Settings.values();
  if (!$stateParams.triggerId || $stateParams.triggerId == 'new'){
    $scope.trigger = {id: Settings.genUUID()}
  } else {
    $scope.trigger = Settings.triggers()[$stateParams.triggerId];
  }

  function updateArray(array, item) {
    if (item && array) {
      if (array.indexOf(item) < 0) {
        array.push(item);
      }
    }
    return array;
  }

  $scope.onSave = function () {
    if ($scope.trigger.event) {
      updateArray($scope.events, $scope.trigger.event);
      Settings.events($scope.events);
    } else {
      // TODO Error message
    }

    updateArray($scope.values, $scope.trigger.value1);
    updateArray($scope.values, $scope.trigger.value2);
    updateArray($scope.values, $scope.trigger.value3);
    Settings.values($scope.values);

    var triggers = Settings.triggers();
    console.log(JSON.stringify($scope.trigger));
    triggers[$scope.trigger.id] = $scope.trigger;
    console.log(JSON.stringify(triggers));
    Settings.triggers(triggers);
    $scope.trigger = {id: Settings.genUUID()}
    $ionicHistory.goBack();
  }
})

.controller('SettingsCtrl', function($scope, Settings) {
  $scope.events = Settings.events();
  console.log($scope.events);
  $scope.settings = {
    makerKey: Settings.makerKey(),
    enableFriends: false
  };

  $scope.addEvent = function() {
    if (!$scope.events[$scope.settings.eventName]) {
      $scope.events.push($scope.settings.eventName);
    }
    Settings.events($scope.events);
  };

  $scope.remove = function(event) {
    $scope.events.splice($scope.events.indexOf(event), 1);
    Settings.events($scope.events);
  };

  $scope.onKeyChange = function() {
    Settings.makerKey($scope.settings.makerKey);
  }
});
