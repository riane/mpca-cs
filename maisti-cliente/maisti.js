var fs = require('fs'),
    http = require('http'),
    qs = require('querystring'),
    seguranca = require('./seguranca');

var dataResult = '';
fs.readFile('result.html', function (err, data2) {
    if (err) {
        return console.log(err);
    }
    dataResult = data2.toString();
});
var dataIndex = '';
fs.readFile('indexres.html', function (err, data2) {
    if (err) {
        return console.log(err);
    }
    dataIndex = data2.toString();
});

Number.prototype.formatMoney = function (c, d, t) { //Serve para formatar um number em formato dinheiro 
    var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t,
	i = parseInt(n = (+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
    return (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t)
	+ (c ? d + (n - i).toFixed(c).slice(2) : "");
};


function formataRegiao(regiao) {
    switch (regiao) {
        case 'CO': regiao = 'CENTRO-OESTE';
            break;
        case 'NE': regiao = 'NORDESTE';
            break;
        case 'N': regiao = 'NORTE';
            break;
        case 'SE': regiao = 'SUDESTE';
            break;
        case 'S': regiao = 'SUL';
            break;
        default: regiao = 'BRASIL';
            break;
    }
    return regiao;
}

function formataRetorno(str, regiao, estado, municipio, custos) {    
    var retornoRegiao = str.split('|');
    var resultUrl1 = '';
    var qtdTotalX = 0.0;
    var qtdTotalY = 0.0;
    var qtdTotalZ = 0.0;

    retornoRegiao = retornoRegiao.sort(function (a, b) {
        if (b.split(';')[0] > a.split(';')[0]) return -1;
        if (b.split(';')[0] < a.split(';')[0]) return 1
        return 0;
    });

    for (var i = 0; i < retornoRegiao.length; i++) {
        var retornoRegiaoCampo = retornoRegiao[i].split(';');

        qtdTotalX += (parseInt(retornoRegiaoCampo[1].replace(".", "")));
        qtdTotalY += (parseInt(retornoRegiaoCampo[2].replace(".", "")));
        qtdTotalZ += (parseInt(retornoRegiaoCampo[3].replace(".", "")));

        resultUrl1 += "<tr>" +
                "<td align=\"left\">" + (regiao == '-' ? formataRegiao(retornoRegiaoCampo[0]) : retornoRegiaoCampo[0]) + "</td>" +
	        	"<td align=\"right\">" + retornoRegiaoCampo[1] + "</td>" +
	        	"<td align=\"right\">" + retornoRegiaoCampo[2] + "</td>" +
	        	"<td align=\"right\">" + retornoRegiaoCampo[3] + "</td>" +
                "</tr>";
    }

    resultUrl1 += "<tr>" +
			"<td align=\"left\">Total</td>" +
			"<td align=\"right\">" + qtdTotalX.formatMoney().replace(",00", "") + "</td>" +
			"<td align=\"right\">" + qtdTotalY.formatMoney().replace(",00", "") + "</td>" +
			"<td align=\"right\">" + qtdTotalZ.formatMoney().replace(",00", "") + "</td>" +
			"</tr>";

    var retornoCustos = custos.split(';');

    var resultUrl2 = "<tr>" +
        "<td style=\"width:100px;\" align=\"center\">R$ " + retornoCustos[0] + "</td>" +
		"<td style=\"width:100px;\" align=\"center\">R$ " + retornoCustos[1] + "</td>" +
		"<td style=\"width:100px;\" align=\"center\">R$ " + retornoCustos[2] + "</td>" +
		"<td style=\"width:100px;\" align=\"center\">R$ " + retornoCustos[3] + "</td>" +
		"<td style=\"width:100px;\" align=\"center\">R$ " + retornoCustos[4] + "</td>" +
		"<td style=\"width:100px;\" align=\"center\">R$ " + retornoCustos[5] + "</td>" +
	"</tr><tr>" +
		"<td style=\"width:200px;\" align=\"center\" colspan=\"2\">R$ " + retornoCustos[6] + "</td>" +
		"<td style=\"width:200px;\"  align=\"center\" colspan=\"2\">R$ " + retornoCustos[7] + "</td>" +
		"<td style=\"width:200px;\"  align=\"center\" colspan=\"2\">R$ " + retornoCustos[8] + "</td>" +
	"</tr>";
    var resultUrl3 = "<li>Dimens&atilde;o:" +  formataRegiao(regiao) + ((estado == '-') ? " " : ('/' + estado)) + ((municipio == '-' || municipio == null) ? " " : '/' + municipio) + "</li>";

    var resultUrl4 = "[" + retornoCustos[6].replace(".", "").replace(",", "") +
		  	", " + retornoCustos[7].replace(".", "").replace(",", "") +
		  	", " + retornoCustos[8].replace(".", "").replace(",", "") + "]";

    return dataResult.replace("<!--RES1-->", resultUrl1).replace("<!--RES2-->", resultUrl2).replace("<!--RES3-->", resultUrl3).replace("<!--RES4-->", resultUrl4);
}

function addOpcao(estado, sel) {
    if (sel == 1) {
        return "<option value='" + estado + "' selected>" + estado + "</option>";
    } else {
        return "<option value='" + estado + "' >" + estado + "</option>";
    }
}

http.createServer(function (req, res) {
    if (req.url.substr(0, 3) == '/in' && req.method == 'POST') {
        var POSTobj = qs.parse(req.url);
        var idRegiao = POSTobj['/index.html?idRegiao'];
        var idEstado = POSTobj['idEstado'];
        if (idEstado == '-') {
            res.writeHead(200);
            var resultUrl1 = "<option value='CO' " + ((idRegiao == 'CO') ? "selected" : "") + ">CENTRO-OESTE</option>" +
			"<option value='NE' " + ((idRegiao == 'NE') ? "selected" : "") + ">NORDESTE</option>" +
			"<option value='N' " + ((idRegiao == 'N') ? "selected" : "") + ">NORTE</option>" +
			"<option value='SE' " + ((idRegiao == 'SE') ? "selected" : "") + ">SUDESTE</option>" +
			"<option value='S' " + ((idRegiao == 'S') ? "selected" : "") + ">SUL</option>";
            res.end(dataIndex.replace("<!--RES1-->", resultUrl1), "utf-8");
        } else {
            var options1 = {
                host: 'mpca2013-cs.herokuapp.com',
                path: '/mpca2013/Lista_Cidades_CodCidade_UF/' + idEstado + '/' + seguranca.criptografaTexto(idEstado),
                port: '80',
                method: 'GET'
            };
            var req1 = http.request(options1, function (response) {
                var str = '';
                response.on('data', function (chunk) {
                    str += chunk;
                });

                response.on('end', function () {
                    var resultUrl1 = '';
                    switch (idRegiao) {
                        case 'CO':
                            resultUrl1 += addOpcao('DF', ((idEstado == 'DF') ? 1 : 0));
                            resultUrl1 += addOpcao('GO', ((idEstado == 'GO') ? 1 : 0));
                            resultUrl1 += addOpcao('MS', ((idEstado == 'MS') ? 1 : 0));
                            resultUrl1 += addOpcao('MT', ((idEstado == 'MT') ? 1 : 0));
                            break;
                        case 'NE':
                            resultUrl1 += addOpcao('AL', ((idEstado == 'AL') ? 1 : 0));
                            resultUrl1 += addOpcao('BA', ((idEstado == 'BA') ? 1 : 0));
                            resultUrl1 += addOpcao('CE', ((idEstado == 'CE') ? 1 : 0));
                            resultUrl1 += addOpcao('MA', ((idEstado == 'MA') ? 1 : 0));
                            resultUrl1 += addOpcao('PB', ((idEstado == 'PB') ? 1 : 0));
                            resultUrl1 += addOpcao('PE', ((idEstado == 'PE') ? 1 : 0));
                            resultUrl1 += addOpcao('PI', ((idEstado == 'PI') ? 1 : 0));
                            resultUrl1 += addOpcao('RN', ((idEstado == 'RN') ? 1 : 0));
                            resultUrl1 += addOpcao('SE', ((idEstado == 'SE') ? 1 : 0));
                            break;
                        case 'N':
                            resultUrl1 += addOpcao('AC', ((idEstado == 'AC') ? 1 : 0));
                            resultUrl1 += addOpcao('AM', ((idEstado == 'AM') ? 1 : 0));
                            resultUrl1 += addOpcao('AP', ((idEstado == 'AP') ? 1 : 0));
                            resultUrl1 += addOpcao('PA', ((idEstado == 'PA') ? 1 : 0));
                            resultUrl1 += addOpcao('RO', ((idEstado == 'RO') ? 1 : 0));
                            resultUrl1 += addOpcao('RR', ((idEstado == 'RR') ? 1 : 0));
                            resultUrl1 += addOpcao('TO', ((idEstado == 'TO') ? 1 : 0));
                            break;
                        case 'SE':
                            resultUrl1 += addOpcao('ES', ((idEstado == 'ES') ? 1 : 0));
                            resultUrl1 += addOpcao('MG', ((idEstado == 'MG') ? 1 : 0));
                            resultUrl1 += addOpcao('RJ', ((idEstado == 'RJ') ? 1 : 0));
                            resultUrl1 += addOpcao('SP', ((idEstado == 'SP') ? 1 : 0));
                            break;
                        case 'S':
                            resultUrl1 += addOpcao('PR', ((idEstado == 'PR') ? 1 : 0));
                            resultUrl1 += addOpcao('RS', ((idEstado == 'RS') ? 1 : 0));
                            resultUrl1 += addOpcao('SC', ((idEstado == 'SC') ? 1 : 0));
                            break;
                    }
                    var resultUrl2 = "<option value='CO' " + ((idRegiao == 'CO') ? "selected" : "") + ">CENTRO-OESTE</option>" +
    			"<option value='NE' " + ((idRegiao == 'NE') ? "selected" : "") + ">NORDESTE</option>" +
    			"<option value='N' " + ((idRegiao == 'N') ? "selected" : "") + ">NORTE</option>" +
    			"<option value='SE' " + ((idRegiao == 'SE') ? "selected" : "") + ">SUDESTE</option>" +
    			"<option value='S' " + ((idRegiao == 'S') ? "selected" : "") + ">SUL</option>";
                    var resultUrl3 = '';
                    var retornoRegiao = str.split('|');
                    for (var i = 0; i < retornoRegiao.length; i++) {
                        if (retornoRegiao.length - 1 != i) {
                            var retornoRegiaoCampo = retornoRegiao[i].split(';');
                            resultUrl3 += "<option value='" + retornoRegiaoCampo[0] + "'>" + retornoRegiaoCampo[1] + "</option>";
                        }
                    }
                    res.writeHead(200);
                    var aux = dataIndex.replace("<!--RES1-->", resultUrl2).replace("<!--RES2-->", resultUrl1).replace("<!--RES3-->", resultUrl3);
                    res.end(aux, "utf-8");
                });
            });
            req1.end();
        }
    } else if (req.method == 'POST') {
        var POSTobj = qs.parse(req.url);
        console.log(POSTobj);
        var idRegiao = POSTobj['/result.html?idRegiao'];
        var idEstado = POSTobj['idEstado'];
        var idMunicipio = POSTobj['idMunicipio'];
        var nomeMunicipio = POSTobj['nomeMunicipio'];
        var options1;
        if (idRegiao == '-') {
            options1 = {
                host: 'mpca2013-cs.herokuapp.com',
                path: '/mpca2013/Lista_qtd_beneficiarios_regioes/dd',
                port: '80',
                method: 'GET'
            };
        } else if (idEstado == '-') {
            options1 = {
                host: 'mpca2013-cs.herokuapp.com',
                path: '/mpca2013/Lista_qtd_beneficiarios_regioes_por_UF/' + idRegiao + '/' + seguranca.criptografaTexto(idRegiao),
                port: '80',
                method: 'GET'
            };
        } else if (idMunicipio == '-') {
            options1 = {
                host: 'mpca2013-cs.herokuapp.com',
                path: '/mpca2013/Lista_qtd_beneficiarios_nas_cidades_de_uma_UF/' + idEstado + '/' + seguranca.criptografaTexto(idEstado),
                port: '80',
                method: 'GET'
            };
        } else {
            options1 = {
                host: 'mpca2013-cs.herokuapp.com',
                path: '/mpca2013/Lista_Custo_Cidade_Por_Cod_Cidade/' + idMunicipio + '/' + seguranca.criptografaTexto(idMunicipio),
                port: '80',
                method: 'GET'
            };
        }

        var req1 = http.request(options1, function (response) {
            var str = '';
            response.on('data', function (chunk) { str += chunk; });

            response.on('end', function () {
                var retornoRegiaoS = str.split('@');
                var retornoFuncao = formataRetorno(retornoRegiaoS[0], idRegiao, idEstado, nomeMunicipio, retornoRegiaoS[1]);

                res.writeHead(200);
                res.end(retornoFuncao, "utf-8");
            });
        });
        req1.end();

    } else {
        fs.readFile(__dirname + req.url, function (err, data) {
            res.writeHead(200);
            res.end(data, "utf-8");
            if (err) {
                res.writeHead(404);
                res.end(JSON.stringify(err));
                return;
            }

        });
    }

}).listen(process.env.PORT || 13371);


