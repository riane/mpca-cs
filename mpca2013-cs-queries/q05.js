var MongoClient = require('mongodb').MongoClient, format = require('util').format;

var user = 'abilio';
var password = 'abilio';
var host = 'ds029658.mongolab.com';
var port = 29658;
var app = 'heroku_app16170404';
var DatabaseUrl = format("mongodb://%s:%s@%s:%s/%s", user, password, host, port, app);

console.log(">> Conectando a " + host + ":" + port);
console.log(" ");

MongoClient.connect(DatabaseUrl, function(err, db) {

  if(err) throw err;
  console.log(">> Conectado ao mongolab database " + app);
  
  // Acessa a coleção mpca2
  var collection = db.collection('mpca2');
  
  // Qtd meninas beneficiarias Bolsa Familia 15-24 anos cidades > 200.000 habitantes
  var total = 0;
  collection.find({'municipio.populacao':{$gt: 200000}}, {_id:0, qtdSexoFemininoDe15a24Anos:1}).each(function(err, item) {
	if(item != null) total += item.qtdSexoFemininoDe15a24Anos;
	else {
		console.log (">> Qtd meninas beneficiarias Bolsa Familia 15-24 anos cidades > 200.000 habitantes: " + total);
		db.close();
	}
  });
  
})