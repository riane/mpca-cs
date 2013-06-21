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
  
  // Find retorna um cursor que permite iterações
  collection.find().each(function(err, item) {
	if(item != null) console.dir(item);
  });

  // O cursor pode ser transformado em um array
  collection.find().toArray(function(err, items) {          
    console.log(" ");
    console.log(">> Quantidade de documentos: " + items.length);
	
	console.log(">> Fechando a conexao");
    db.close();
	
	console.log(" ");  
    console.log(">> Bogus!")
  });
  
})