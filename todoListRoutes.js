module.exports = (app) => {
    const todoList = require('./todoListController');
  
    // todoList Routes
    app.route('/')
        .get((req,res) => {
          console.log('Working...');
          res.status(200).send('Working...');
          res.end();
        });

    app.route('/tasks')
        .get(todoList.listAlltasks)
        .post(todoList.createAtask);
  
    app.route('/tasks/:taskId')
        .get(todoList.readAtask)
        .put(todoList.updateAtask)
        .delete(todoList.deleteAtask);
  };
