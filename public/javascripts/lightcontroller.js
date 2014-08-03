var app = angular.module("lightApp", ["firebase"]);
var Color = net.brehaut.Color;

app.controller("lightCtrl", ["$scope", "$firebase",
  function($scope, $firebase) {
    
    // Reference to this location on Firebase
    var ref = new Firebase("https://ra.firebaseio.com/devices/virtualbulb/");
    
    // Create an AngularFire reference to the data
    var sync = $firebase(ref);
    
    // Bind lightData from Firebase, to be used on client 
    $scope.lightData = sync.$asObject();
  }
]);

