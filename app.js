const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const middleware = require('./middleware')(app, express);
const config = require('./config');
const passport = require('passport');

Task = require('./models/tasks');
User = require('./models/users');

mongoose.connect(config.mongoUri);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {});

app.use(passport.initialize());
app.use(passport.session());
app.use(urlencodedParser);

const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy((username, password, done) => {
    console.log('Strategy...');
    User.findOne({ username }).then((user) => {
        if(user) {
            console.log('User find!');
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

const authHandler = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
});

const mustBeAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
};

    app.post('/login', authHandler);
    
    app.get('/login', (req, resp) => {
        User.count().then((user) => {
            console.log('User count => %s', user);
            if (user != 0) {
                resp.render('login');
            } else {
                resp.render('newuser');
            }
        });
    });

    app.get('/', (request, response) => { 
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

    app.post('/savechanged', urlencodedParser, (req, res) => {
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

    app.get('/newtask', (req, res) => {
        console.log('Add new task!');
        const title = 'Add new task:';
        res.render('new', {
            title: title,
        });
    });

    app.post('/createtask', mustBeAuthenticated, urlencodedParser, (req, res) => {
        const { 'newname': name, 'newtext': text} = req.body;
        var task = new Task({ name: name, text:text });
        task.save( (err) => {
            if (err) return handleError(err);
            res.redirect('/');
          })
    });

    app.post('/createuser', urlencodedParser, (req, res) => {
        const { 'username': name, 'password': password} = req.body;
        var user = new User({ name: name, password:password });
        user.save( (err) => {
            if (err) return handleError(err);
            res.redirect('/');
          })
    });

    app.get('/deletetask', (req, res) => {
        const { id, name } = req.query;
        console.log('Delete Task => ',name);
        Task.remove({ _id: id }).then(() => res.redirect('/'));         
    });

    app.listen(config.port);
