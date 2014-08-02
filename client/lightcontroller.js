var app = angular.module("lightApp", ["firebase"]);

app.controller("lightCtrl", ["$scope", "$firebase",
  
  function($scope, $firebase) {
    // Reference to this location
    var ref = new Firebase("https://ra.firebaseio.com/devices/virtualbulb/");

    // create an AngularFire reference to the data

    // This is the sync object that keeps us in sync with firebase and this object

    var sync = $firebase(ref);

    // download the data into a local object
    $scope.lightData = sync.$asObject();
  }

]);

