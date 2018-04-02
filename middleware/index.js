module.exports = (app, express) => {
    const ejs = require('ejs-locals');
    const path = require('path');
    const cookieParser = require('cookie-parser');
    const passport = require('passport');

    app.engine('html', ejs);
    app.engine('ejs', ejs);
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');

    app.use(cookieParser());

    app.use(express.static(path.join(__dirname, '../public')));
    app.use('/public', express.static(path.join(__dirname, '../public')));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
      User.findById(id).then((user) => {
          done(null, user);
      });
    });

};
