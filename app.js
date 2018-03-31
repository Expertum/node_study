const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const middleware = require('./middleware')(app, express);
const config = require('./config');

Task = require('./models/tasks');

mongoose.connect(config.mongoUri);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {});

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
    
    app.get('/edittask', (req, res) => {
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

    app.post('/createtask', urlencodedParser, (req, res) => {
        const { 'newname': name, 'newtext': text} = req.body;
        var task = new Task({ name: name, text:text });
        task.save( (err) => {
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
