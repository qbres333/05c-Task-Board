// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// add modal input fields
const titleEl = $('#task-title');
const dueDateEl = $('#task-duedate');
const descriptionEl = $('#task-description');
const taskFormEl = $('#task-form');

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
  const cardHeader = $("<div>").addClass("card-header h4").text(task.titleEl);
  const cardBody = $("<div>").addClass("card-body");
  const cardDueDate = $("<p>").addClass("card-text").text(task.dueDateEl);
  const cardDescription = $("<p>").addClass("card-text").text(task.descriptionEl);
  const cardDeleteBtn = $("<button>")
  cardDeleteBtn.addClass("btn btn-danger delete")
  cardDeleteBtn.text("Delete")
  cardDeleteBtn.attr("data-task-id", task.id);
  cardDeleteBtn.on("click", handleDeleteTask);

  /* Only apply styles if status is not 'done' */
  if (task.status !== 'done') {
    const now = dayjs();
    const formattedDate = now.format('MM/DD/YYYY');
    const taskDueDate = dayjs(task.dueDateEl, "MM/DD/YYYY");

    /* If the task is due today, make the card yellow. If it's past due, make it red. */
    if (formattedDate.isSame(taskDueDate)) {
      taskCard.addClass('bg-warning text-white');
    } else if (formattedDate.isAfer(taskDueDate)) {
      taskCard.addClass('bg-danger text-white');
      cardDeleteBtn.addClass('border-light');
    }

  }

  /* append fields to card and card body */
  taskCard.append(cardHeader, cardBody);
  cardBody.append(cardDueDate, cardDescription, cardDeleteBtn);

  return taskCard;

}

/* Todo: create a function to render the task list and make cards draggable */
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
  // set const to taskCard attribute
  const taskID = $(this).attr('data-task-id');
  const tasks = readCardsFromStorage();

  // remove the task from the array
  tasks.forEach(task => {
    if(task.id === taskID) {
      // delete one task starting at the task index
      tasks.splice(tasks.indexOf(task), 1);
    }
  });

  // save new list of tasks to storage and render to the screen
  saveTasksToStorage(tasks);
  renderTaskList();

}

/* Todo: create a function to handle dropping a task into a 
 new status lane */
function handleDrop(event, ui) {
  // retrieve tasks from local storage and generate ID
  const tasks = readCardsFromStorage();
  const taskID = generateTaskId();
  // get the id of lane the card was dropped into
  const newStatus = event.target.id;
  // find the card ID and update the status
  for(let task of tasks) {
    if (task.id === taskID) {
      task.status = newStatus;
    }
  }

  // save the updated array to local storage
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTaskList();

}



/* Todo: when the page loads, render the task list, add event
  listeners, make lanes droppable, and make the due date 
 field a date picker */
$(document).ready(function () {
  renderTaskList();
  
  // event listener to add task to lane
  taskFormEl.on("submit", handleAddTask);

  //  use event delegation to delete tasks dynamically
  taskDisplayEl.on("click", ".btn-delete-task", handleDeleteTask);

  // ? Make lanes droppable
  $(".lane").droppable({
    accept: ".draggable",
    drop: handleDrop,
  });

  // why can't this element be dueDateEl?
  $("#task-duedate").datepicker({
    changeMonth: true,
    changeYear: true,
  });
});

