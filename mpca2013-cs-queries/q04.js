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
  
  // Qtd beneficiarios Bolsa Familia qq idade cidades < 30.000 habitantes Norte/Nordeste CRAS/CREAS Banda Larga
  var total = 0;
  collection.find({'municipio.populacao':{$lt: 30000}, $or: [{'regiao':'NE'}, {'regiao':'N'}], $or: [{'qtdCras.comInternet':{$gt: 0}}, {'qtdCreas.comInternet':{$gt: 0}}]}, {_id:0, qtdQualquerIdade:1}).each(function(err, item) {
	if(item != null) total += item.qtdQualquerIdade;
	else {
		console.log (">> Qtd beneficiarios Bolsa Familia qq idade cidades < 30.000 habitantes Norte/Nordeste CRAS/CREAS Banda Larga: " + total);
		db.close();
	}
  });
  
})