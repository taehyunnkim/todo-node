'use strict';

(function() {
  const BASE_URL = 'http://localhost:8000/'
  let state = {
    taskList: [],
    inputtedText: ''
  };

  window.addEventListener('load', init);

  function init() {
    let addButton = document.getElementById('add-task');
    addButton.addEventListener('click', addTask);
    
    let input = document.getElementById('task-input');
    input.addEventListener('input', renderInput);

    renderTasks();
    renderInput();
  }

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
  
  function renderTasks() {
    let ol = document.querySelector('ol');

    while(ol.hasChildNodes()){
      ol.removeChild(ol.lastChild);
    }

    fetch(BASE_URL + 'getTasks')
      .then(checkStatus)
      .then(resp => resp.json())
      .then(tasks => {
        state.taskList = tasks;
        state.taskList.forEach(task => {
          let taskItem = createTaskElement(task);
          ol.appendChild(taskItem);
        });
      })
      .catch(err => console.log(err));
  }
  
  function addTask(e) {
    e.preventDefault();
    let formData = new FormData(document.getElementById("input-form"));
    let id = Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER));
    formData.append("id", id);
    fetch(BASE_URL + 'addTask', { method: 'POST', body: formData })
      .then(checkStatus)
      .then(resp => resp.text())
      .then(result => {
        showAlert(result);
        renderTasks();
        let input = document.getElementById('task-input');
        input.value = '';
        renderInput();
      })
      .catch(showAlert('Something went wrong...'));
  }

  function removeTask() {
    let data = new FormData();
    data.append('id', this.children[0].textContent);
    fetch(BASE_URL + 'removeTask', {method: 'POST', body: data})
    .then(checkStatus)
    .then(resp => resp.text())
    .then(result => {
      showAlert(result);
      renderTasks();
      let input = document.getElementById('task-input');
      input.value = '';
      renderInput();
    })
    .catch(showAlert('Something went wrong...'));
  }

  function renderInput() {
    let input = document.getElementById('task-input');
    let addButton = document.getElementById('add-task');

    if (input.value === '') {
      addButton.setAttribute('disabled', true);
    } else {
      addButton.removeAttribute('disabled');
    }
  }

  function showAlert(message) {
    let alert = document.getElementById('alert');
    alert.textContent = message;
    setTimeout(() => {
      alert.textContent = ''
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
      throw Error("Error in request: " + response.statusText);
    }
  }
})();