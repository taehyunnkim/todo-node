'use strict';
const multer = require("multer");
const express = require('express');
const app = express();
const fs = require('fs').promises;

app.use(multer().none());
app.use(express.json());

app.post('/addTask', (req, res) => {
  try {
    let description = req.body.task;
    let id = req.body.id;
    let newTask = {id, description}
    if (!(newTask)) {
      res.type('text').status(400).send('Please add a description!');
    } else {
      addTask(newTask);

      res.send("Task was added!");
    }
  } catch (err) {
    res.type('text').status(500).send('Whoops!');
  }
});

app.post('/removeTask', (req, res) => {
  try {
    let id = req.body.id;
    if (!(id)) {
      res.type('text').status(400).send('Please add a description!');
    } else {
      removeTask(id);
      res.send("Task was removed!");
    }
  } catch {
    res.type('text').status(500).send('Whoops!');
  }
});

app.get('/getTasks', (req, res) => {
  getTasks()
    .then(data => res.send(data))
    .catch(() => res.send("Something went wrong!"));
});

async function getTasks() {
  let contents = await fs.readFile('todos.json', 'utf-8');
  return JSON.parse(contents);
}

async function addTask(task) {
  let tasks = await getTasks(); 
  tasks.push(task);
  await fs.writeFile('todos.json', JSON.stringify(tasks));
}

async function removeTask(id) {
  let tasks = await getTasks(); 
  let updatedTaskList = tasks.filter(task => task.id !== id);
  await fs.writeFile('todos.json', JSON.stringify(updatedTaskList));
}

app.use(express.static('public'));
const PORT = process.env.PORT || 8000;
app.listen(PORT);