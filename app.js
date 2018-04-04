const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const middleware = require('./middleware')(app, express);
const config = require('./config');
const passport = require('passport');
const session = require('express-session');

const Task = require('./models/tasks');
const User = require('./models/users');

mongoose.connect(config.mongoUri);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {});

app.use(passport.initialize());
app.use(passport.session());
app.use(urlencodedParser);
app.use(session({
    secret: 'secrettexthere',
    saveUninitialized: true,
    resave: true
}));

const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy((username, password, done) => {
    console.log('Strategy...');
    User.findOne({ 'name':username }).then((user) => {
        if (user) {
            console.log('User find!', user._id);
            if (user.password === password) {
                done(null, user);
            } else {
                done(null, false);  
            }
        } else {
            console.log('User not find!');
            done(null, false);
        }
    })
}));

passport.serializeUser((user, done) => {
    console.log('serializeUser !');
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    console.log('deserializeUser !');
    User.findById(id).then((user) => {
        done(null, user);
    });
});

const authHandler = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
});

const mustBeAuthenticated = (req, res, next) => {
    const isAuthenticated = req.session.passport;
    if (typeof isAuthenticated !== 'undefined' && isAuthenticated) {
        next();
    } else {
        res.redirect('/login');
    }
};

    app.post('/login', authHandler);
    
    app.get('/login', (req, resp) => {
        User.count().then((userCount) => {
            console.log('User count => %s', userCount);
            if (userCount != 0) {
                resp.render('login');
            } else {
                resp.render('newuser');
            }
        });
    });

    app.get('/logout', (req, res) => {
      req.logout();
      res.redirect('/');
    });

    app.get('/', mustBeAuthenticated, (request, response) => { 
        //console.log('search user...', request.session.passport);
        const title = 'List of Tasks'
        console.log('List Tasks ...');
        Task.find().then((listTask) => {
            response.render('index',{
                    title: title,
                    listT: listTask
            });
       });
    });
    
    app.get('/edittask', mustBeAuthenticated, (req, res) => {
        const { name } = req.query;
        console.log('Edit Task => ', name);
        const title = 'Edit Task by name: ' + name;
        Task.find({name: name}).then((editTask) => {
            res.render('edit', {
                title: title,
                editT: editTask[0]
            });
        });            
    });

    app.post('/savechanged', (req, res) => {
        const { id, 'editname': name, 'edittext': text } = req.body;
        console.log('Save changed to => ', name);
        Task.findById(id, (err, doc) => {
            doc.text = text;
            doc.name = name;
            doc.save().then(() => {
                res.redirect('/');
            });
        });
    });

    app.get('/newtask', mustBeAuthenticated, (req, res) => {
        console.log('Add new task!');
        const title = 'Add new task:';
        res.render('new', {
            title: title,
        });
    });

    app.post('/createtask', (req, res) => {
        const { 'newname': name, 'newtext': text} = req.body;
        var task = new Task({ name: name, text:text });
        task.save( (err) => {
            if (err) return handleError(err);
            res.redirect('/');
          })
    });

    app.post('/createuser', (req, res) => {
        const { 'username': name, 'password': password} = req.body;
        var user = new User({ name: name, password:password });
        user.save( (err) => {
            if (err) return handleError(err);
            res.redirect('/');
          })
    });

    app.get('/deletetask', mustBeAuthenticated, (req, res) => {
        const { id, name } = req.query;
        console.log('Delete Task => ',name);
        Task.remove({ _id: id }).then(() => res.redirect('/'));         
    });

    app.listen(config.port);
    console.log(cookieParser);