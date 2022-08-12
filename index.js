/* Librerias */
const express = require("express");
const app = express();
//const http = require('http');
const fs = require("fs");
const dotenv = require('dotenv').config();
const t = require('./lib/trie');
const {capitalize} = require('./lib/capitalize');

/* Declaracion de constantes */
const PORT = parseInt(process.env.PORT) || 8000;
const HOST = process.env.HOST || 'localhost';
const SUGGESTION_NUMBER = parseInt(process.env.SUGGESTION_NUMBER) || 8;

console.log("SUGGESTION NUMBER:",SUGGESTION_NUMBER);
var rawdata = fs.readFileSync("./names.json");
var data = JSON.parse(rawdata);
console.log("\rNames in database:",Object.keys(data).length);

/* Create Trie */
var Trie = new t.Trie();
// populate Trie
for(item in data){
	Trie.insert(item.toLowerCase(),data[item]);
}

/* Middlewares! */
app.use(express.json());

// GET REQUESTS
app.get("/typeahead/:prefix", (req, res) => {
//	console.log(req.params.prefix);
	res.setHeader('content-type', 'application/json; charset=utf-8');
	res.send('\n'+JSON.stringify(Trie.findName(req.params.prefix.toLowerCase(),SUGGESTION_NUMBER))+'\n\n');

});
app.get("/typeahead/", (req, res) => {
//	console.log(req.body);
	res.setHeader('content-type', 'application/json; charset=utf-8');
	res.send('\n'+JSON.stringify(Trie.findName("",SUGGESTION_NUMBER))+'\n\n')

});

//POSTS REQUESTS
app.post('/typeahead/', (req,res) => {
	if(req.body.name){
		query = req.body.name.toLowerCase();
		if(score = Trie.exists(query)){
			console.log("POST:",query);
			Trie.insert(query,score+1);
			res.status(201).send('\n'+`{"name":"${capitalize(query)}","times":${score+1}}`+'\n\n')
		}else{
			res.status(400).send('\nNot Found\n\n')
		}
	}else{
		res.status(400).send('\nNot Found\n\n')
	}
});

app.listen(PORT, HOST, () => {
	console.log(`\n⚡Server listening on http://${HOST}:${PORT}/ ⚡\n`);
	console.log("Write `exit` and press Enter to kill server\n");
});


process.stdin.setEncoding('utf8');
process.stdin.on('data', data => {
	const str = data.toString().trim().toLowerCase();

	if(str=='exit'){
		console.log('\nBye!\n');
		process.exit(0);
	}
});
process.on('SIGINT', function(){
    process.stdout.write("\rCaught interrupt signal. Bye!\n\n");
    process.exit();
});
