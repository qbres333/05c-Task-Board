// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// add modal input fields
const titleEl = $('#task-title');
const dueDateEl = $('#task-duedate');
const descriptionEl = $('#task-description');

// add "tasks" array to store task objects
let tasks = [];

// Todo: create a function to generate a unique task id
function generateTaskId() {
  const taskID = crypto.randomUUID();
  return taskID;

}

// Todo: create a function to create a task card
function createTaskCard(task) {
  const taskCard = $('<div>');
  taskCard.addClass('card task-card draggable my-3')
  taskCard.attr('data-task-id', task.id);

}

/* Todo: create a function to render the task list and 
 make cards draggable */
// create separate function to read local storage first
function readCardsFromStorage() {
    // retrieve data from local storage
  let tasks = JSON.parse(localStorage.getItem('tasks'));
  // if there's no data in local storage, assign tasks to new empty array
  if (!tasks) {
    tasks = [];
  }
  return tasks;
}

function renderTaskList() {
  const tasks = readCardsFromStorage();
  // Empty existing lanes
   const todoList = $('#todo-cards');
  todoList.empty();

  const inProgressList = $('#in-progress-cards');
  inProgressList.empty();

  const doneList = $('#done-cards');
  doneList.empty();

  // look through tasks and create cards for each status
  for (let task of tasks) {
    if(task.status === 'to-do') {
      todoList.append(createTaskCard(task));
    } else if(task.status === 'in-progress') {
      inProgressList.append(createTaskCard(task));
    } else if(task.status === 'done') {
      doneList.append(createTaskCard(task));
    }
  }

    //make task cards draggable
  $('.draggable').draggable({
    opacity: 0.7,
    zIndex: 100,
    
    helper: function (e) {
   
      const original = $(e.target).hasClass('ui-draggable')
        ? $(e.target)
        : $(e.target).closest('.ui-draggable');
   
      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
  event.preventDefault();

  // read user input from the task modal
  const titleInput = titleEl.val().trim();
  const dueDateInput = dueDateEl.val();
  const descriptionInput = descriptionEl.val();

  // ensure that all fields are filled in
  if (!titleInput || !dueDateInput || !descriptionInput) {
    console.log(`All fields must have data.`);
    return;
  }

  // create new task object based on input values; set default status to "to-do"
  const newTask = {
    titleEl: titleInput,
    dueDateEl: dueDateInput,
    descriptionEl: descriptionInput,
    status: 'to-do',
  };

  // generate a random id for the newTask object
  generateTaskId();

  const tasks = renderTaskList();
  tasks.push(newTask);

  // save new task list to local storage
  saveTasksToStorage(tasks);

  // do we need to clear modal input fields here?
};

// save tasks array to local storage
function saveTasksToStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

/* Todo: create a function to handle dropping a task into a 
 new status lane */
function handleDrop(event, ui) {

}

/* Todo: when the page loads, render the task list, add event
  listeners, make lanes droppable, and make the due date 
 field a date picker */
$(document).ready(function () {
  renderTaskList();

});

