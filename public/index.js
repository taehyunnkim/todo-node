/*
 * Name: Eric Kim
 * Date: May 17, 2020
 * Section: CSE 154 AK
 *
 * This is the JS for managing the UI and the behavior of the todo application.
 * The user could add and remove a task, and the UI will change based on
 * these interactions.
 */

'use strict';

(function() {
  const BASE_URL = 'http://localhost:8000/';

  window.addEventListener('load', init);

  /**
   * Sets up the UI of the todo application.
   * Updates the todo list dashboard to display
   * any item that hasn't been removed from the user's
   * previous session.
   */
  function init() {
    let addButton = document.getElementById('add-task');
    addButton.addEventListener('click', addTask);
    let input = document.getElementById('task-input');
    input.addEventListener('input', renderButton);
    renderTasks();
  }

  /**
   * Creates a new list item with the given description and id.
   * @param {Object} task - data containing the description and the id of the task.
   * @return {Object} a list item element.
   */
  function createTaskElement(task) {
    let li = document.createElement('li');
    li.textContent = task.description;
    li.addEventListener('click', removeTask);
    let id = document.createElement('span');
    id.textContent = task.id;
    id.classList.add('hidden');
    li.appendChild(id);
    return li;
  }

  /**
   * Displays the updated todo list dashboard.
   */
  function renderTasks() {
    let ol = document.querySelector('ol');
    while (ol.hasChildNodes()) {
      ol.removeChild(ol.lastChild);
    }
    fetch(BASE_URL + 'getTasks')
      .then(checkStatus)
      .then(resp => resp.json())
      .then(tasks => {
        tasks.forEach(task => {
          let taskItem = createTaskElement(task);
          ol.appendChild(taskItem);
        });
      })
      .catch(() => showAlert('Something went wrong...'));
  }

  /**
   * Adds a new task in the todo list.
   * @param {Object} e - the event object to prevent default action.
   */
  function addTask(e) {
    e.preventDefault();
    let formData = new FormData(document.getElementById('input-form'));
    let id = Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER));
    formData.append('id', id);
    fetch(BASE_URL + 'addTask', {method: 'POST', body: formData})
      .then(checkStatus)
      .then(resp => resp.text())
      .then(result => {
        showAlert(result);
        renderTasks();
        let input = document.getElementById('task-input');
        input.value = '';
        renderButton();
      })
      .catch(() => showAlert('Something went wrong...'));
  }

  /**
   * Removes the task from the todo list.
   */
  function removeTask() {
    let id = this.children[0].textContent;
    fetch(BASE_URL + 'removeTask', {
      method: 'POST',
      body: 'id=' + id,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      }
    })
      .then(checkStatus)
      .then(resp => resp.text())
      .then(result => {
        showAlert(result);
        renderTasks();
        renderButton();
        let input = document.getElementById('task-input');
        input.value = '';
      })
      .catch(() => showAlert('Something went wrong...'));
  }

  /**
   * Disables the button if the text input is empty.
   */
  function renderButton() {
    let input = document.getElementById('task-input');
    let addButton = document.getElementById('add-task');

    if (input.value === '') {
      addButton.setAttribute('disabled', true);
    } else {
      addButton.removeAttribute('disabled');
    }
  }

  /**
   * Display a message in the homepage.
   * @param {String} message - the message to display.
   */
  function showAlert(message) {
    let alert = document.getElementById('alert');
    alert.textContent = message;
    setTimeout(() => {
      alert.textContent = '';
    }, 1500);
  }

  /**
   * Checks the response status.
   * @param {Object} response - the response of the request to check the status.
   * @return {Object} response - the response of the request to check the status.
   * @throws {Error} will throw an error if the response code is not in the 200-299 range.
   */
  function checkStatus(response) {
    if (response.ok) {
      return response;
    } else {
      throw Error('Error in request: ' + response.statusText);
    }
  }
})();