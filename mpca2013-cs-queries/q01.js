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
  
  // Enumera as coleções da base de dados
  db.collectionNames(function(err, names) {
		names.forEach(function(name) {
			console.dir(name);          
		});
	
	console.log(" ");
	console.log(">> Fechando a conexao");
    db.close();
	
	console.log(" ");  
    console.log(">> Bogus!")
  });
  
})