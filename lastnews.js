/**
 * @author Artem Strilets
 */

const request = require('request');
const cheerio = require('cheerio');

request('http://svpressa.ru/all/news/', (error, response, html) => {
	if (!error && response.statusCode == 200){

		const parse = cheerio.load(html);

        let datenews = parse(parse('.b-article_item')[0]).find('div.b-article__date').text();
        let titlenews = parse(parse('.b-article_item')[0]).find('a.b-article__title_item').text();
        let textnews = parse(parse('.b-article_item')[0]).find('p.b-article__subtitle_item').text();

        console.log(datenews);
          console.log('-------------------------------------------------');
        console.log(titlenews);
          console.log('-------------------------------------------------');
        console.log(textnews);
          console.log('-------------------------------------------------');
	}
});
