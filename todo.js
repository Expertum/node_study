const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const url = require('url');
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
        //console.log(listTasks);
        console.log('List Tasks ...');
        Task.find().then((listTask) => {
            response.render('index',{
                    title: title,
                    listT: listTask
            });
       });
    });
    
    app.get('/edittask', (req, res) => {
        const url_parts = url.parse(req.url, true); 
        const query = url_parts.query;
        const id = req.query.id;
        const name = req.query.name;
        console.log('Edit Task => ', name);
        const title = 'Edit Task by name: '+name;
        Task.find({name: name}).then((editTask) => {
            //console.log(editTask[0].name);
            res.render('edit',{
                title: title,
                editT: editTask[0]
            });
        });            
    });

    app.post('/savechanged', urlencodedParser, (req, res) => {
        const id = req.body.id;
        const name = req.body.editname;
        const text = req.body.edittext;
        console.log('Save changed to => ', name);
        const title = 'List of Tasks, task '+name+' successfully changed!';
        Task.findById(id, function (err, doc) {
            doc.text = text;
            doc.name = name;
            doc.save();
        }).then((scs) => {
            res.redirect('/');
        });
    });

    app.get('/newtask', (req, res) => {
        console.log('Add new task!');
        const title = 'Add new task:';
        res.render('new',{
            title: title,
        });
    });

    app.post('/createtask', urlencodedParser, (req, res) => {
        const name = req.body.newname;
        const text = req.body.newtext;
        var task = new Task({ name: name, text:text });
        task.save(function (err) {
            if (err) return handleError(err);
            res.redirect('/');
          })
    });

    app.get('/deletetask', (req, res) => {
        const url_parts = url.parse(req.url, true); 
        const query = url_parts.query;
        const id = req.query.id;
        const name = req.query.name;
        console.log('Delete Task => ',name);
        Task.findById(id, function (err, doc) {
            doc.remove();
        }).then((scs) => {
            res.redirect('/');
        });          
    });

    app.listen(config.port);
