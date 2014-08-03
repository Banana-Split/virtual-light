var Firebase = require("firebase");


exports.list = function(req, res){
  
  // Read from ra.firebaseio.com/devices/virtualbulb

  // Get a reference to our posts
  var postsRef = new Firebase("ra.firebaseio.com/devices/virtualbulb");

  // Attach an asynchronous callback to read the data at our posts reference
  postsRef.on('value', function (lightData) {
    
    var lightData = lightData.val();

    var author = lightData.author;

    // Convert color (HSV to CSS styling)

    res.render('lights', { 
      title     : 'LET THERE BE LIGHT',
      lightData : lightData,
      author : author
    });

    console.log("This should be changing")
    console.log(lightData)
      

  }, function (errorObject) {
    console.log('The read failed: ' + errorObject.code);
  });

};



