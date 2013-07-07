var mongo = require('mongodb');
var Server = mongo.Server;
var Db = mongo.Db;
var server = new Server('ds029658.mongolab.com', 29658, {auto_reconnect : true});
var db = new Db('heroku_app16170404', server);
var seguranca = require('./seguranca')	


db.open(function(err, client) {
    client.authenticate('abilio', 'abilio', function(err, success) {
     	console.log("Connected to 'mpca2' database");
    });
});
exports.findAll = function(req, res) {
     var collection = db.collection('mpca2');
  
  // A região default é "NE"
  var param = "NE";

  // Enumeração das UFs inseridas na base de dados que pertençam à região passada como parâmetro
  collection.distinct('estado', {'regiao':param}, function(err, docs) { 
	
	// Exibe cada item do array resultante
	docs.forEach(function(item) {
     res.json(docs);
    });
	
	// Encerra a conexão com o banco
	//db.close();
	
  });		
};
//Lista todas as regiões
//exemplo teste no api google cosole http://localhost:3000/mpca2013/NE
exports.ListaRegiao = function(req, res) {
     var collection = db.collection('mpca2');
  
  // A região default é "NE"
  var param = "NE";

  // Enumeração das UFs inseridas na base de dados que pertençam à região passada como parâmetro
  collection.distinct('regiao', function(err, docs) { 
	
	// Exibe cada item do array resultante
	docs.forEach(function(item) {
     res.json(docs);
    });
	
	// Encerra a conexão com o banco
	//db.close();
	
  });	
};
//enumera todas as ufs recebendo o parametro regiao
//exemplo teste no api google cosole http://localhost:3000/mpca2013/ListaUFPorRegiao/NE
exports.ListaUFPorRegiao = function(req, res) {
    var param = req.params.regiao;
	 var collection = db.collection('mpca2');
	//console.log('Retrieving wine: ' + param);
   // Enumeração das UFs inseridas na base de dados que pertençam à região passada como parâmetro
   collection.distinct('estado', {'regiao':param}, function(err, docs) { 
	
	// Exibe cada item do array resultante
	docs.forEach(function(item) {
     res.json(docs);
    });
	
	// Encerra a conexão com o banco
	//db.close();
	
  });
};

//enumera todas as cidades recebendo o parametro UF
//exemplo http://localhost:3000/mpca2013/ListaCidadePorUF/BA
exports.ListaCidadePorUF = function(req, res) {
    var collection1 = db.collection('mpca2');
	var param = req.params.uf;
	
   // Enumeração das cidades inseridas na base de dados que pertençam à UF passada como parâmetro
   collection1.distinct('municipio.nome', {'estado':param}, function(err, docs) { 
	
	// Exibe cada item do array resultante
	docs.forEach(function(item) {
     res.json(docs);
    });
	
	// Encerra a conexão com o banco
	//db.close();
	
  });
};
 
 //Lista_qtd_beneficiarios_regioes
//http://localhost:3000/mpca2013/Lista_qtd_beneficiarios_regioes/dd
// Nessa consulta passe um parâmetro qualquer
 exports.Lista_qtd_beneficiarios_regioes = function(req, res) {
//nova consulta baseado na consulta q22-Enumera-qtd-beneficiarios-nas-regioes.js
 // Acesso à coleção mpca2
  var collection = db.collection('mpca2');
  var param = req.params.rg;
  // Enumeração das regiões inseridas na base de dados
  collection.distinct('regiao', function(err, docs) { 
	
	var resultado = "";
	var index = 0;
	var custog1 = 0;
	var custog2 = 0;
	var custog3 = 0;	
	// Exibe cada item do array resultante
	docs.forEach(function(item) {	

	  // Grupo 1: Qtd jovens beneficiarios Bolsa Familia 15-24 anos nas capitais
	  var g1 = 0;
	  collection.find({'regiao':item, 'municipio.capital':'S'}, {_id:0, qtd15a17anos:1, qtd18a24anos:1}).each(function(err, capital) {
		if(capital != null) g1 += capital.qtd15a17anos + capital.qtd18a24anos;
		else {
			
			  // Grupo 2: Qtd beneficiarios Bolsa Familia qq idade cidades < 30.000 habitantes Norte/Nordeste CRAS/CREAS Banda Larga
			  var g2 = 0;
			  collection.find({'regiao':item, 'municipio.populacao':{$lt: 30000}, $or: [{'regiao':'NE'}, {'regiao':'N'}], $or: [{'qtdCras.comInternet':{$gt: 0}}, {'qtdCreas.comInternet':{$gt: 0}}]}, {_id:0, qtdQualquerIdade:1}).each(function(err, cidade) {
				if(cidade != null) g2 += cidade.qtdQualquerIdade;
				else {
					
					// Grupo 3: Qtd meninas beneficiarias Bolsa Familia 15-24 anos cidades > 200.000 habitantes
					var g3 = 0;
					collection.find({'regiao':item, 'municipio.populacao':{$gt: 200000}}, {_id:0, qtdSexoFemininoDe15a24Anos:1}).each(function(err, vila) {
					  if(vila != null) g3 += vila.qtdSexoFemininoDe15a24Anos;
					  else {
					  
					    // Calcula o custo anual para cada grupo de público alvo
						if (item == "N") {
							custog1 += g1 * 138 * 150;
							custog2 += g2 * 138 * 150;
							custog3 += g3 * 138 * 150;
						}
						else {
							custog1 += g1 * 117 * 150;
							custog2 += g2 * 117 * 150;
							custog3 += g3 * 117 * 150;
						}
					  
                        // Exige a regiao e a qtd beneficiarios dos grupos g1, g2 e g3 e o custo
						index++;
						resultado = resultado.concat(item, ";", formatQuant(g1), ";", formatQuant(g2), ";", formatQuant(g3));
						if(index==docs.length) {
							resultado = resultado.concat("@", formatReal(custog1), ";", formatReal(custog1));
							resultado = resultado.concat(";", formatReal(custog2), ";", formatReal(custog2));
							resultado = resultado.concat(";", formatReal(custog3), ";", formatReal(custog3));
							resultado = resultado.concat(";", formatReal(2*custog1), ";", formatReal(2*custog2), ";", formatReal(2*custog3));
							res.send(resultado);
						}
						else {
							resultado = resultado.concat("|");
						}
					  }
					});					

				}
			  });

		}
	  });		  

    });

  });  
//
  
};

//Lista qtd Reqião por UF
// Formata valores monetários
function formatReal( int )
{
        var tmp = int+'';
        var neg = false;
        if(tmp.indexOf("-") == 0)
        {
            neg = true;
            tmp = tmp.replace("-","");
        }
        
        if(tmp.length == 1) tmp = "0"+tmp
    
        tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
        if( tmp.length > 6)
            tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
        
        if( tmp.length > 9)
            tmp = tmp.replace(/([0-9]{3}).([0-9]{3}),([0-9]{2}$)/g,".$1.$2,$3");
    
        if( tmp.length > 12)
            tmp = tmp.replace(/([0-9]{3}).([0-9]{3}).([0-9]{3}),([0-9]{2}$)/g,".$1.$2.$3,$4");
        
        if(tmp.indexOf(".") == 0) tmp = tmp.replace(".","");
        if(tmp.indexOf(",") == 0) tmp = tmp.replace(",","0,");
    
    return (neg ? '-'+tmp : tmp);
}

// Formata quantidades
function formatQuant( int )
{
        var tmp = int+'00';
        var neg = false;
        if(tmp.indexOf("-") == 0)
        {
            neg = true;
            tmp = tmp.replace("-","");
        }
        
        if(tmp.length == 1) tmp = "0"+tmp
    
        tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
        if( tmp.length > 6)
            tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
        
        if( tmp.length > 9)
            tmp = tmp.replace(/([0-9]{3}).([0-9]{3}),([0-9]{2}$)/g,".$1.$2,$3");
    
        if( tmp.length > 12)
            tmp = tmp.replace(/([0-9]{3}).([0-9]{3}).([0-9]{3}),([0-9]{2}$)/g,".$1.$2.$3,$4");
        
        if(tmp.indexOf(".") == 0) tmp = tmp.replace(".","");
        if(tmp.indexOf(",") == 0) tmp = tmp.replace(",","0,");
		tmp = tmp.replace(",00","");
    
    return (neg ? '-'+tmp : tmp);
}
//exemplo http://localhost:3000/mpca2013/Lista_qtd_beneficiarios_regioes_por_UF/NE
//q23-Enumera-qtd-beneficiarios-nas-UFs-de-uma-regiao-passada-como-parametro.js
exports.Lista_qtd_beneficiarios_regioes_por_UF = function(req, res) {
  // Acesso à coleção mpca2
  var collection = db.collection('mpca2');
  // A região default é "NE"
  //var param = "NE";
  var param = req.params.uf;
  var sec = req.params.sec;
  var resultado = "";
  var index = 0;
  var custog1 = 0;
  var custog2 = 0;
  var custog3 = 0;
  // Enumeração das UFs inseridas na base de dados que pertençam à região passada como parâmetro
  collection.distinct('estado', {'regiao':param}, function(err, docs) { 
	
	// Exibe cada item do array resultante
	docs.forEach(function(item) {
	  
	  // Grupo 1: Qtd jovens beneficiarios Bolsa Familia 15-24 anos nas capitais
	  var g1 = 0;
	  collection.find({'estado':item, 'municipio.capital':'S'}, {_id:0, qtd15a17anos:1, qtd18a24anos:1}).each(function(err, capital) {
		if(capital != null) g1 += capital.qtd15a17anos + capital.qtd18a24anos;
		else {
			
			  // Grupo 2: Qtd beneficiarios Bolsa Familia qq idade cidades < 30.000 habitantes Norte/Nordeste CRAS/CREAS Banda Larga
			  var g2 = 0;
			  collection.find({'estado':item, 'municipio.populacao':{$lt: 30000}, $or: [{'regiao':'NE'}, {'regiao':'N'}], $or: [{'qtdCras.comInternet':{$gt: 0}}, {'qtdCreas.comInternet':{$gt: 0}}]}, {_id:0, qtdQualquerIdade:1}).each(function(err, cidade) {
				if(cidade != null) g2 += cidade.qtdQualquerIdade;
				else {
					
					// Grupo 3: Qtd meninas beneficiarias Bolsa Familia 15-24 anos cidades > 200.000 habitantes
					var g3 = 0;
					collection.find({'estado':item, 'municipio.populacao':{$gt: 200000}}, {_id:0, qtdSexoFemininoDe15a24Anos:1}).each(function(err, vila) {
					  if(vila != null) g3 += vila.qtdSexoFemininoDe15a24Anos;
					  else {
					  
					    // Calcula o custo anual para cada grupo de público alvo
						if (param == "N") {
							custog1 += g1 * 138 * 150;
							custog2 += g2 * 138 * 150;
							custog3 += g3 * 138 * 150;
						}
						else {
							custog1 += g1 * 117 * 150;
							custog2 += g2 * 117 * 150;
							custog3 += g3 * 117 * 150;
						}
					  
                        // Exige a regiao e a qtd beneficiarios dos grupos g1, g2 e g3 e o custo
						index++;
						resultado = resultado.concat(item, ";", formatQuant(g1), ";", formatQuant(g2), ";", formatQuant(g3));
						if(index==docs.length) {
							resultado = resultado.concat("@", formatReal(custog1), ";", formatReal(custog1));
							resultado = resultado.concat(";", formatReal(custog2), ";", formatReal(custog2));
							resultado = resultado.concat(";", formatReal(custog3), ";", formatReal(custog3));
							resultado = resultado.concat(";", formatReal(2*custog1), ";", formatReal(2*custog2), ";", formatReal(2*custog3));
						if (seguranca.criptografaTexto(param)  === sec){
							res.send(resultado);
						}else {res.write("ACESSO NAO AUTORIZADO"); res.end();}


						}
						else {
							resultado = resultado.concat("|");
						}
						
					  }
					});					
 
				}
			  });
			
		}
	  });	  
	  
	  
    });
	
  });			
};


//Lista qtd Reqião por UF
//exemplo http://localhost:3000/mpca2013/Lista_qtd_beneficiarios_nas_cidades_de_uma_UF/BA
exports.Lista_qtd_beneficiarios_nas_cidades_de_uma_UF = function(req, res) {
  // Acesso à coleção mpca2
  var collection = db.collection('mpca2');
  
  // A UF default é "BA"
  //var param = "BA";
  var param = req.params.uf;
  var sec = req.params.sec;
  var resultado = "";
  var index = 0;
  var custog1 = 0;
  var custog2 = 0;
  var custog3 = 0; 
 // Enumeração das cidades inseridas na base de dados que pertençam à UF passada como parâmetro
  collection.distinct('municipio.nome', {'estado':param}, function(err, docs) { 
	
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
					  
					    // Calcula o custo anual para cada grupo de público alvo
						if (param == "AC" || param == "AP" || param == "AM" || param == "PA" || param == "RR" || param == "RO" || param == "TO") {
							custog1 += g1 * 138 * 150;
							custog2 += g2 * 138 * 150;
							custog3 += g3 * 138 * 150;
						}
						else {
							custog1 += g1 * 117 * 150;
							custog2 += g2 * 117 * 150;
							custog3 += g3 * 117 * 150;
						}
					  
                        // Exige a regiao e a qtd beneficiarios dos grupos g1, g2 e g3 e o custo
						index++;
						resultado = resultado.concat(item, ";", formatQuant(g1), ";", formatQuant(g2), ";", formatQuant(g3));
						if(index==docs.length) {
							resultado = resultado.concat("@", formatReal(custog1), ";", formatReal(custog1));
							resultado = resultado.concat(";", formatReal(custog2), ";", formatReal(custog2));
							resultado = resultado.concat(";", formatReal(custog3), ";", formatReal(custog3));
							resultado = resultado.concat(";", formatReal(2*custog1), ";", formatReal(2*custog2), ";", formatReal(2*custog3));
							

							if (seguranca.criptografaTexto(param)  === sec){
								res.send(resultado);
							}else {res.write("ACESSO NAO AUTORIZADO"); res.end();console.log('sec:', sec);}

						}
						else {
							resultado = resultado.concat("|");
						}
					  
					  }
					});					
 
				}
			  });
			
		}
	  });	
	
    });
	
  });		  
};
//CONSULTA 20
// Enumeração das cidades inseridas na base de dados que pertençam à UF passada como parâmetro
//exemplo http://localhost:3000/mpca2013/Lista_Cidades_CodCidade_UF/BA
exports.Lista_Cidades_CodCidade_UF = function(req, res) {
  
  // Acesso à coleção mpca2
  var collection1 = db.collection('mpca2');
  var param = req.params.uf;
  var sec = req.params.sec;
  var resultado = "";		  
  
  // Enumeração das cidades inseridas na base de dados que pertençam à UF passada como parâmetro
  var aux = collection1.find({'estado':param}, {_id:0, codMunicipio:1, 'municipio.nome':1}).sort({'municipio.nome':1}).each(function(err, docs) {

	if(docs != null) resultado = resultado.concat(docs.codMunicipio, ";", docs.municipio.nome, "|");
	else {
		if (seguranca.criptografaTexto(param)  === sec){
			res.send(resultado);
		}else {res.write("ACESSO NAO AUTORIZADO"); res.end();console.log('sec:', sec);}
	}
	
	// Encerra a conexão com o banco
	//db.close();
	
  });    
};

//exemplo http://localhost:3000/mpca2013/Lista_Custo_Cidade_Por_Cod_Cidade/2927408 
//	servico referente a consulta q25-Enumera-qtd-beneficiarios-na-cidade-passada-como-parametro.js
exports.Lista_Custo_Cidade_Por_Cod_Cidade = function(req, res) {
 // Acesso à coleção mpca2
  var collection = db.collection('mpca2');
  
  // A cidade default é Salvador "292740"
  //var param = "2927408";
  var param = req.params.codigo;
  var sec = req.params.sec;
  var resultado = "";
  var index = 0;
  var custog1 = 0;
  var custog2 = 0;
  var custog3 = 0; 
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
					  
					    // Calcula o custo anual para cada grupo de público alvo
						if (param == "AC" || param == "AP" || param == "AM" || param == "PA" || param == "RR" || param == "RO" || param == "TO") {
							custog1 += g1 * 138 * 150;
							custog2 += g2 * 138 * 150;
							custog3 += g3 * 138 * 150;
						}
						else {
							custog1 += g1 * 117 * 150;
							custog2 += g2 * 117 * 150;
							custog3 += g3 * 117 * 150;
						}
					  
                        // Exige a regiao e a qtd beneficiarios dos grupos g1, g2 e g3 e o custo
						index++;
						resultado = resultado.concat(item, ";", formatQuant(g1), ";", formatQuant(g2), ";", formatQuant(g3));
						if(index==docs.length) {
							resultado = resultado.concat("@", formatReal(custog1), ";", formatReal(custog1));
							resultado = resultado.concat(";", formatReal(custog2), ";", formatReal(custog2));
							resultado = resultado.concat(";", formatReal(custog3), ";", formatReal(custog3));
							resultado = resultado.concat(";", formatReal(2*custog1), ";", formatReal(2*custog2), ";", formatReal(2*custog3));
							
							if (seguranca.criptografaTexto(param)  === sec){
								res.send(resultado);
							}else {res.write("ACESSO NAO AUTORIZADO"); res.end();console.log('sec:', sec);}

						}
						else {
							resultado = resultado.concat("|");
						}					  
						
						
					  }
					});					
 
				}
			  });
			
		}
	  });	
	
    });
	
  });		   
  	    
};
