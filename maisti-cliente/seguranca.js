exports.criptografaTexto =  function (parametro) {
		var crypto = require('crypto');
		var cipher = crypto.createCipher('aes-256-cbc','mpca2013-securityAPI');
		var text = parametro;
		var crypted = cipher.update(text,'utf8','hex');	
		crypted += cipher.final('hex');		
		console.log('encriptado:', crypted);
		return crypted;

}
