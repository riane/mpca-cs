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
  
  // A cidade default é Salvador "292740"
  var param = "292740";

  var res = "";
  var index = 0;
  // Enumeração das cidades inseridas na base de dados que pertençam à UF passada como parâmetro
  collection.distinct('municipio.nome', {'codMunicipio':param}, function(err, docs) { 
	
	// Exibe cada item do array resultante
	docs.forEach(function(item) {

	  // Grupo 1: Qtd jovens beneficiarios Bolsa Familia 15-24 anos nas capitais
	  var g1 = 0;
	  collection.find({'municipio.nome':item, 'municipio.capital':'S'}, {_id:0, qtd15a17anos:1, qtd18a24anos:1}).each(function(err, capital) {
		if(capital != null) g1 += capital.qtd15a17anos + capital.qtd18a24anos;
		else {
			
			  // Grupo 2: Qtd beneficiarios Bolsa Familia qq idade cidades < 30.000 habitantes Norte/Nordeste CRAS/CREAS Banda Larga
			  var g2 = 0;
			  collection.find({'municipio.nome':item, 'municipio.populacao':{$lt: 30000}, $or: [{'regiao':'NE'}, {'regiao':'N'}], $or: [{'qtdCras.comInternet':{$gt: 0}}, {'qtdCreas.comInternet':{$gt: 0}}]}, {_id:0, qtdQualquerIdade:1}).each(function(err, cidade) {
				if(cidade != null) g2 += cidade.qtdQualquerIdade;
				else {
					
					// Grupo 3: Qtd meninas beneficiarias Bolsa Familia 15-24 anos cidades > 200.000 habitantes
					var g3 = 0;
					collection.find({'municipio.nome':item, 'municipio.populacao':{$gt: 200000}}, {_id:0, qtdSexoFemininoDe15a24Anos:1}).each(function(err, vila) {
					  if(vila != null) g3 += vila.qtdSexoFemininoDe15a24Anos;
					  else {
					  
					    // Calcula o custo anual (g1 + g2 + g3) * 117 * 150 ou (g1 + g2 + g3) * 138 * 150
						var custo = 0;
						if (param == "AC" || param == "AP" || param == "AM" || param == "PA" || param == "RR" || param == "RO" || param == "TO") custo = (g1 + g2 + g3) * 138 * 150;
						else custo = (g1 + g2 + g3) * 117 * 150;
					  
                        // Exige a regiao e a qtd beneficiarios dos grupos g1, g2 e g3 e o custo
						index++;
						res = res.concat(item, ";", g1, ";", g2, ";", g3, ";", custo, "\n");
						if(index==docs.length) console.log (res);
					  }
					});					
 
				}
			  });
			
		}
	  });	
	
    });
	
  });		  
  
})