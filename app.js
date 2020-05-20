/*
 * Name: Eric Kim
 * Date: May 17, 2020
 * Section: CSE 154 AK
 *
 * This is the JS for managing the server side of the todo application.
 * The user could make post and get requests to manipulate the data
 * in the data storage.
 */

'use strict';
const multer = require('multer');
const express = require('express');
const app = express();
const fs = require('fs').promises;

app.use(multer().none());
app.use(express.urlencoded({extended: false}));

app.post('/addTask', (req, res) => {
  try {
    let description = req.body.task;
    let id = req.body.id;
    let newTask = {id, description};
    addTask(newTask);
    res.send('Task was added!');
  } catch (err) {
    res.type('text').status(500)
      .send('Something went wrong!');
  }
});

app.post('/removeTask', (req, res) => {
  try {
    let id = req.body.id;
    if (!(id)) {
      res.type('text').status(400)
        .send('Please provide an id!');
    } else {
      removeTask(id);
      res.send('Task was removed!');
    }
  } catch (err) {
    res.type('text').status(500)
      .send('Something went wrong!');
  }
});

app.get('/getTasks', (req, res) => {
  getTasks()
    .then(data => res.send(data))
    .catch(() => res.send('Something went wrong!'));
});

/**
 * Retrieves all the tasks in the todo list.
 * @return {Array} an array of tasks.
 */
async function getTasks() {
  let contents = await fs.readFile('todos.json', 'utf-8');
  return JSON.parse(contents);
}

/**
 * Adds a new task to the data in the data storage.
 * @param {Object} task - task data with description and id to add.
 */
async function addTask(task) {
  let tasks = await getTasks();
  tasks.push(task);
  await fs.writeFile('todos.json', JSON.stringify(tasks));
}

/**
 * Removes a task from the data in the data storage.
 * @param {Object} id - id of the task to remove from the data.
 */
async function removeTask(id) {
  let tasks = await getTasks();
  let updatedTaskList = tasks.filter(task => task.id !== id);
  await fs.writeFile('todos.json', JSON.stringify(updatedTaskList));
}

app.use(express.static('public'));
const PORT = process.env.PORT || 8000;
app.listen(PORT);