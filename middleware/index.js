module.exports = function (app, express) {
    const ejs = require('ejs-locals');
    const path = require('path');
    const cookieParser = require('cookie-parser');
  
    /**
     * Page Rendering
     * */
    app.engine('html', ejs);
    app.engine('ejs', ejs);
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');

    /**
     * Session
     * */
     app.use(cookieParser());

     /**
     * Public directory
     * */
    app.use(express.static(path.join(__dirname, '../public')));
    app.use("/public", express.static(path.join(__dirname, '../public')));

};