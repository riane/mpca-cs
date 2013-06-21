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
  
  // Qtd jovens beneficiarios Bolsa Familia 15-24 anos nas capitais
  var total = 0;
  collection.find({'municipio.capital':'S'}, {_id:0, qtd15a17anos:1, qtd18a24anos:1}).each(function(err, item) {
	if(item != null) total += item.qtd15a17anos + item.qtd18a24anos;
	else {
		console.log (">> Qtd jovens beneficiarios Bolsa Familia 15-24 anos nas capitais: " + total);
		db.close();
	}
  });
  
})