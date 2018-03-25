/**
 * @author Artem Strilets
 */
const express = require('express');
const templating = require('consolidate');
const bodyParser = require('body-parser');
const reqnews = require('request');
const cheerio = require('cheerio');
const cookieParser = require('cookie-parser');
const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});

app.engine('hbs', templating.handlebars);
app.set('view engine', 'hbs');
app.set('views', __dirname + '/templates');

app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

app.post('/newslist', urlencodedParser, (req, res) => {
    if(!req.body) return res.sendStatus(400);
      console.log(req.body);
      const typenews = req.body.typenews;
      let countn = req.body.countnews;
      res.setHeader('Set-Cookie','type_n='+typenews+'||'+countn);
      reqnews('https://ria.ru/'+typenews+'/', (error, response, html) => {
        let newsall = [[],[],[],[]];
        let newseach = [];
        if (!error && response.statusCode == 200){
            const parse = cheerio.load(html);
            const titlenews  = parse('.b-list .b-list__item-title');
                titlenews.each((i,element) => { 
                    newsall[0].push(parse(element).text());
                })             
            const anews  = parse('.b-list .b-list__item a');
                anews.each((i,element) => { 
                    newsall[1].push(parse(element).attr('href'));
                })          
            const imgnews  = parse('.b-list .b-list__item-img-ind img');
                imgnews.each((i,element) => { 
                    newsall[2].push(parse(element).attr('src'));
                })          
            const datenews  = parse('.b-list .b-list__item-date');
                datenews.each((i,element) => { 
                    newsall[3].push(parse(element).text());
                })          
            console.log('Пришли новости ====>');
            if (countn > newsall[1].length) {countn = newsall[0].length}
            for (var i = 0; i < countn; i++) {
                newseach.push({'title' : newsall[0][i], 'ahref' : 'https://ria.ru'+newsall[1][i], 'image' : newsall[2][i], 'date' : newsall[3][i]});
            };
        res.render('news_list', {
            title: 'Последние Новости!',
            news: newseach
        });
       }
    });
});

app.get('/', (request, response) => { 
    const paramsn = request.cookies['type_n'].split('||');
    response.redirect('/formnews.html?typenews='+paramsn[0]+'&countnews='+paramsn[1]);
    console.log('************************');
    console.log(request.cookies['type_n']);
});

app.listen(7777);
