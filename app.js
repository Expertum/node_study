const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const middleware = require('./middleware')(app, express);
const config = require('./config');
const passport = require('passport');
const session = require('express-session');

var jwt = require ('jsonwebtoken'); 
var bcrypt = require ('bcryptjs'); 

const Task = require('./models/tasks');
const User = require('./models/users');

mongoose.connect(config.mongoUri);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {});

app.use(passport.initialize());
app.use(passport.session());

app.use(urlencodedParser);
app.use(bodyParser.json());

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
            bcrypt.compare(password, user.password, (err, res) => {
                console.log('res decrypt =>',res);
                if (res) {
                    done(null, user);
                } else {
                    done(null, false);  
                }
            });
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
    const tokenEx = req.cookies.auth;
    if (typeof isAuthenticated !== 'undefined' && isAuthenticated) {
        if (tokenEx) {
            next();
        } else {
            const token = jwt.sign({id: isAuthenticated['user']}, config.secret,{
                expiresIn: 86400 // истекает через 24 часа 
            });
            res.cookie('auth',token);
            console.log('Added token =>', token);
            res.redirect('/login');
        }
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

    app.get('/newuser', mustBeAuthenticated, (req, res) => {
        res.render('newuser');
    });

    app.post('/createuser', (req, res) => {
        const hashedPassword = bcrypt.hashSync(req.body.password, 8);
        const { 'username': name} = req.body;

        const user = new User({ name: name, password:hashedPassword });
        user.save( (err) => {
            if (err) return handleError(err);
            console.log('User create!');
            res.redirect('/');
          })
    });

    app.get('/me', mustBeAuthenticated, (req, res) => {
        const token = req.cookies.auth;
        if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
        
        jwt.verify(token, config.secret, (err, decoded) => {
          if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });   
          res.status(200).send(decoded);
        });
      });

    app.get('/deletetask', mustBeAuthenticated, (req, res) => {
        const { id, name } = req.query;
        console.log('Delete Task => ',name);
        Task.remove({ _id: id }).then(() => res.redirect('/'));         
    });

    app.listen(config.port);
