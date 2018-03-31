module.exports = (app, express) => {
    const ejs = require('ejs-locals');
    const path = require('path');
    const cookieParser = require('cookie-parser');
  
    app.engine('html', ejs);
    app.engine('ejs', ejs);
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');

     app.use(cookieParser());

    app.use(express.static(path.join(__dirname, '../public')));
    app.use('/public', express.static(path.join(__dirname, '../public')));
};
