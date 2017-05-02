var express = require('express') //Permet de naviguer parmi les fichiers
var app = new express()
var server= require('http').createServer(app); //Permet de créer le serveur
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var random = require('mongoose-simple-random');
var io = require('socket.io').listen(server);  //Permet l'interraction avec le serveur


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


var pending = [];

(function(){
	app.use(bodyParser.urlencoded({
		extended: true,
		}));
	app.set('view engine', 'ejs');

	app.get("/", function(req, res){
		findRandom = function(){
			Face.findOneRandom(function(err, result) {
			if (!err) {
				if (result.image != tobesent[0].image){
					tobesent.push(result);
					var newVote = new voteObjects(tobesent);
					pending.push(newVote);
					res.render('page.ejs', {results: newVote});
					//console.log(newVote);
					}
				else{
					findRandom();
				}
			}
		});
	}

		var tobesent = [];
		Face.findOneRandom(function(err, result) {
	  if (!err) {
			tobesent.push(result);
			findRandom();
	  }
	});
	});

	app.get('/result', function(req, res){
		Face.find().sort('-score').exec(function (err, results) {
        if (err) return handleError(err);
        res.render('result.ejs', {results: results});
      })
	});

	app.get("/myriad", function(req, res){
		res.sendFile(__dirname + "/font/MYRIADPRO-REGULAR.OTF");
	});

	app.get("/css", function(req, res){
		res.sendFile(__dirname + "/css/style.css");
	});

	app.get('/images/:id', function(req, res){
		res.sendFile(__dirname + '/imagesFB/' + req.params.id + '.png');
	});

	io.on('connection', function(socket){

  	socket.on('voted', function(vote){
			var voted = vote.voteval;
			var notVoted = 1 - voted;
			findId = function(obj){
				return obj.id === vote.id;
			}
			elem = pending.filter(findId);
			if(elem[0]){
				//console.log(elem[0]);
				elem = elem[0];
				updateValue(elem.votes[voted].image, elem.votes[notVoted].image, elem.votes[voted].score, elem.votes[notVoted].score);
				elem.delete();
				//console.log(pending);
			}
		});

		socket.on('pass', function(vote){
			findId = function(obj){
				return obj.id === vote.id;
			}
			elem = pending.filter(findId);
			if(elem[0]){
				//console.log(elem[0]);
				elem[0].delete();
				//console.log(pending);
			}
		});
	});

})();

function updateValue(id1, id2, score1, score2){

	var Rpre1 = score1;
	var Rpre2 = score2;
	var K = 30;
	var S = 1;

	var E1 = E(Rpre1, Rpre2);
	var E2 = E(Rpre2, Rpre1);

	var R1 = parseInt(Rpre1 + (K*(S-E1)));
	var R2 = parseInt(Rpre2 - (K*(S-E2)));

	console.log("Rpre1: " + Rpre1 + " Rpre2: " + Rpre2 + " E1: " + E1 + " E2: " + E2 + " R1: " + R1 + " R2: " + R2);
	findAndUpdateDB(id1, id2, R1, R2);

}

function E(s1, s2){
	return (1/(10-((s1-s2)/100)+1));
}

function findAndUpdateDB(id1, id2, R1, R2){
	Face.update({ image: id1 }, { $set: { score: R1 }}, function(err, updated){
		//console.log(R1 + " " + R2);
	});
	Face.update({ image: id2 }, { $set: { score: R2 }}, function(err, updated){
	});
}



function voteObjects(votes){
	this.votes = votes;
	this.id = Math.random();
	this.timeToDel = setTimeout(this.delete, 60000);

	this.delete = function(){
		this.votes = null;
		this.id = null;
		clearTimeout(this.timeToDel);
		index = pending.indexOf(this);
		pending.splice(index, 1);
	}
}



server.listen(3001);
console.log("serveur en marche");
