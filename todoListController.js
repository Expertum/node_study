const mongoose = require('mongoose');
const Task = require('./models/tasks');

exports.listAlltasks = (req, res) => {
  Task.find({}, (err, task) => {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.createAtask = (req, res) => {
const new_task = new Task(req.body);
  new_task.save((err, task) => {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.readAtask = (req, res) => {
  Task.findById(req.params.taskId, (err, task) => {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.updateAtask = (req, res) => {
  Task.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, (err, task) => {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.deleteAtask = (req, res) => {
  Task.remove({
    _id: req.params.taskId
  }, (err, task) => {
    if (err)
      res.send(err);
    res.json({ message: 'Task successfully deleted' });
  });
};
