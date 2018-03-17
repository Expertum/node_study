/**
 * @author Artem Strilets
 */

const readline = require('readline');
const fs = require('fs');

function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
  }

const rnd = randomInteger(1, 5)
const date = new Date();
let result_h = ''
let result_c = ''
let winner = 'none'
let i = 0

const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const game = new MyEmitter();
	
	game.on('input_c', (res_h) => {
		if (res_h != ''){
         result_c = randomInteger(1, 5);
         console.log('Comp choose some =>',result_c)
		}
	});

	game.on('res_check', (res_h, res_c) => {
		if (result_h == rnd) {
			if (result_c == rnd) {
			   winner = 'draw'    
			} else {winner = 'hum'}	
		} else if (result_c == rnd) {
			winner = 'comp'
		} else {
			winner = 'none'
		}
	});

		console.log('Guess the number from one to five:')
		
		const rl = readline.createInterface({input: process.stdin, output: process.stdout }); 
	
			rl.on('line', function (cmd) {
				i += 1
				//console.log('RND =>',rnd)
		    	console.log('Your choice: '+cmd);
				result_h = cmd;
				if (result_h !='') {game.emit('input_c', result_h);}
				if (result_h !='' && result_c !='') {game.emit('res_check', result_h, result_c);}
				console.log('Winner =>',winner);
		
                if(cmd == 'exit' || winner =='hum' || winner == 'comp' ){
                fs.appendFile('game.log', date+'||'+winner+'||'+i+'\n', function (err) {
                   if (err) return console.log(err);
                   console.log('Updated LOG!');
                   rl.close();
                 });
                } else {console.log('/////////////////// To exit, enter "exit"');}
			   
	      }).on('close', function() {
	      	   if (winner == 'hum'){
                 console.log('Humanity has triumphed!');
	      	   	
	      	   } else {
	      	     console.log('Alas, the machine is stronger than us :( ');
	      	   }
               process.exit(0);
          });