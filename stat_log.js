/**
 * @author Artem Strilets
 */

const fs = require('fs');
const readline = require('readline');

let h = 0
let c = 0
let p = 0
let ar =[]
let a =[]
let k =[]
let sov = 0
let max = 0

function readLines(input, func) {
  var remaining = '';
  var n = 0
  
  input.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\n');
    while (index > -1) {
          n +=1;
      var line = remaining.substring(0, index);
      remaining = remaining.substring(index + 1);
      func(line);
      index = remaining.indexOf('\n');
    }
  });

  input.on('end', function() {
    if (remaining.length > 0) {
      func(remaining);
    }
      console.log('Number of game:',n);
      
      	for( i = 0; i < n; i++ )
	    {  sov = 0;
		  for( j = i; j < n; j++ )
		  {
			if( ar[i] == ar[j] ) 
            {    
                sov += 1
				k[p] = sov; 
				a[p] = ar[i];
			}
			else break;
		  }
		  p++;
	    }

      max = k[0];
	   for( i = 0; i < p; i++ ) 
	    if( max < k[i] ) max = k[i];
	    //console.log(max);
	  
	  for( i = 0; i < p; i++ )
		if( max == k[i] ) break;
		
	  who = ar[i];
		//console.log(who);
    console.log('-----');
    console.log('The number of wins by human:', h);
    console.log('The number of wins by computer:', c);
    console.log('-----');
    h_p = (parseFloat(h)/parseFloat(n))*100;    
    c_p = (parseFloat(c)/parseFloat(n))*100;
    console.log('Percentage of wins by human', Math.round(h_p)+'%');
    console.log('Percentage of wins by computer', Math.round(c_p)+'%');
    console.log('-----');        
    console.log('The largest series of wins:');        
    switch(who){
    	case 'hum':
    	  who_s = 'Human';
    	  break;
    	case 'comp':
    	  who_s = 'Computer';
    	  break
    }
    console.log('Series:',max+' -',who_s);        
  });
}

function count_win(data) {
  ar.push(data.split('||')[1]);
  //console.log(ar,max_s);
  switch (data.split('||')[1]) {
  	case 'hum':
  	  h +=1;
  	  break;
  	case 'comp':
  	  c +=1
  	  break;
  }

}

const rl = readline.createInterface({input: process.stdin, output: process.stdout }); 

console.log('Enter the path to the log file:');

rl.on('line', function (cmd) {

var input = fs.createReadStream(cmd);
readLines(input, count_win);
rl.close();
});
