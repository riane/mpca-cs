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
  console.log(" ");
  
  // Acessa a coleção mpca2
  var collection = db.collection('mpca2');
  
  // Retorna as capitais
  collection.find({'municipio.capital':'S'},{_id:0, 'municipio.nome':1}).each(function(err, item) {
	if(item != null) console.dir(item.municipio.nome);
  });

  // Retorna a quantidade de capitais
  collection.find({'municipio.capital':'S'},{_id:0, 'municipio.nome':1}).toArray(function(err, items) {          
    console.log(" ");
    console.log(">> Quantidade de capitais: " + items.length);
	
	console.log(">> Fechando a conexao");
    db.close();
	
	console.log(" ");  
    console.log(">> Bogus!")
  });
  
})