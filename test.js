var express = require('express') //Permet de naviguer parmi les fichiers
var app = new express()
var server= require('http').createServer(app); //Permet de créer le serveur
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var random = require('mongoose-simple-random');


mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1/faceMash', function(err) {
	if (err) { throw err; }
	});

	var faceSchema = new mongoose.Schema({
		image: String,
    score: Number
	});
	faceSchema.plugin(random);

	var Face = mongoose.model('faces', faceSchema);


function randomQuerry(){
	Face.findRandom({}, {}, {limit: 2}, function(err, results) {
  if (!err) {
    console.log(results); // 5 elements
  }
});

}

randomQuerry();
/*(function(){
	var retry = true;

	var querries = [];
	var randomOne = randomQuerry();
	var randomTwo = randomQuerry();

	querries.push(randomOne);
	while(retry){
    console.log(randomOne);
		if(randomOne != randomTwo){
			querries.push(randomTwo);
			retry = false;
		}
		else{
			randomTwo = randomQuerry();
		}
	}

	console.log(querries);
})();*/
