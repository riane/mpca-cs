// JScript File
var express = require('express'),
   
mpca2013 = require('./routes/mpca2013');
 
var app = express();

app.get('/mpca2013/:regiao', mpca2013.ListaRegiao);
app.get('/mpca2013/ListaUFPorRegiao/:regiao', mpca2013.ListaUFPorRegiao);
app.get('/mpca2013/ListaCidadePorUF/:uf', mpca2013.ListaCidadePorUF);
app.get('/mpca2013/Lista_qtd_beneficiarios_regioes/:rg', mpca2013.Lista_qtd_beneficiarios_regioes);
app.get('/mpca2013/Lista_qtd_beneficiarios_regioes_por_UF/:uf/:sec', mpca2013.Lista_qtd_beneficiarios_regioes_por_UF);
app.get('/mpca2013/Lista_qtd_beneficiarios_nas_cidades_de_uma_UF/:uf/:sec', mpca2013.Lista_qtd_beneficiarios_nas_cidades_de_uma_UF);
app.get('/mpca2013/Lista_Cidades_CodCidade_UF/:uf/:sec', mpca2013.Lista_Cidades_CodCidade_UF);
app.get('/mpca2013/Lista_Custo_Cidade_Por_Cod_Cidade/:codigo/:sec', mpca2013.Lista_Custo_Cidade_Por_Cod_Cidade);


app.listen(process.env.PORT || 3000);
console.log('Listening on port 3000...');
