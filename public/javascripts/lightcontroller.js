// "firebase" is injected, so that I can instantiate Firebase
var app = angular.module("lightApp", ["firebase"]);
// Color library, accessible bc we're in JS files
var Color = net.brehaut.Color;

app.controller("lightCtrl", ["$scope", "$firebase",
  
  function($scope, $firebase) {
    // Reference to this location
    var ref = new Firebase("https://ra.firebaseio.com/devices/virtualbulb/");

    // create an AngularFire reference to the data
    // This is the sync object that keeps us in sync with firebase and this object
    var sync = $firebase(ref);
    // download the data into a local object
    $scope.lightData = sync.$asObject();

    // console.log(lightDataObj)
    // console.log(lightDataObj.testlight)

    // console.log("This is color angular client controller")
    // var hexCode = lightColor.toCSS();




    // // $scope.myStyle = "{'background-color':'black'}"


    // $scope.myStyle = hexCode;

    console.log($scope.myStyle)
  }

]);

