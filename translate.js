/**
 * @author Artem Strilets
 */

const http = require("http");
const url = require('url');

const trnkey = 'trnsl.1.1.20180320T105152Z.3481ed1c3dc4523f.e55399befb6acb061ac6f171f23dae2eb8995bf5'

const urlquery ='https://translate.yandex.net/api/v1.5/tr.json/translate?key='+trnkey+'&lang=en-ru&text='

const onRequest = (request, response) => {

	let params = [];
    let texttrans = ''
  
    params.push(url.parse(request.url,true).query);
    
    if (typeof params[0].texttransl != 'undefined' && texttrans === '') {

    	const request = require('request');

    	texttrans = params[0].texttransl;
    	console.log('Text for translate => %s',texttrans);
    	
    	request(urlquery+texttrans, (error, resp, html) => {

		  	if (!error && resp.statusCode == 200){

		  	  result = JSON.parse(resp.body);

             s = result['text'][0]

             console.log('Translated text => %s', s);

             response.write('<input type="text" readonly="true" style="width:300px;" value="'+s+'"></input>');

             response.end();

			}  		
    	});
   	
    } 
    
	response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
	response.write('<body>');
	
	response.write('Enter text to translate:');
	response.write('<form id="yandextrans">');
	response.write('<input type="text" style="width:300px;" name="texttransl" value="'+texttrans+'"></input>');
	response.write('<input type="submit" value="translate"></input>');
	response.write('</form>');

	response.write('</body>');
	if (texttrans === '') {response.end();}
}

http.createServer(onRequest).listen(8888);
console.log("Server has started.");