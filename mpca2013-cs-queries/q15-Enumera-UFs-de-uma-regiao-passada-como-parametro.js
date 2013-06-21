// Cliente MongoDb
var MongoClient = require('mongodb').MongoClient, format = require('util').format;

// Variáveis de conexão
var user = 'abilio';
var password = 'abilio';
var host = 'ds029658.mongolab.com';
var port = 29658;
var app = 'heroku_app16170404';
var DatabaseUrl = format("mongodb://%s:%s@%s:%s/%s", user, password, host, port, app);

// Conexão à base de dados
MongoClient.connect(DatabaseUrl, function(err, db) {

  // Tratamento de erro
  if(err) throw err;
  
  // Acesso à coleção mpca2
  var collection = db.collection('mpca2');
  
  // A região default é "NE"
  var param = "NE";

  var res = "";
  var index = 0;
  // Enumeração das UFs inseridas na base de dados que pertençam à região passada como parâmetro
  collection.distinct('estado', {'regiao':param}, function(err, docs) { 
	
	// Exibe cada item do array resultante
	docs.forEach(function(item) {
		index++;
		res = res.concat(item, "\n");
		if(index==docs.length) console.log (res);
    });
	
	// Encerra a conexão com o banco
	db.close();
	
  });		  
  
})