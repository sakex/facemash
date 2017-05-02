/*
var fs = require('fs');
var mongoose = require('mongoose');

// var dir = fs.readdirSync("imagesFB"); //Liste des images dans le dir
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1/faceMash', function(err) {
	if (err) { throw err; }
	});

	var faceSchema = new mongoose.Schema({
		image: String,
    score: Number
	});

	var Face = mongoose.model('faces', faceSchema);


//  for(x in dir){
  var newFace = new Face();
  newFace.image = 194;
  newFace.score = 1501;

  newFace.save(function (err) {
    if (err) { throw err; }
    console.log(newFace + " ajouté");
  });
//  }
mongoose.connection.close();
*/


/*for (x in dir){
  fs.rename('/imagesFB/' + dir[x] + '.png', '/imagesFB/' + x + '.png', function (err) {
    if (err) throw err;
  });
}





 */
