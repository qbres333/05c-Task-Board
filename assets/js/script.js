// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem('tasks'));
let nextId = JSON.parse(localStorage.getItem('nextId')); //not sure what this is for

// add modal input fields
const titleEl = $('#task-title');
const dueDateEl = $('#task-duedate');
const descriptionEl = $('#task-description');
const taskFormEl = $('#formModal');
const taskDisplayEl = $('#task-display')

// Todo: create a function to generate a unique task id
function generateTaskId() {
  const taskID = crypto.randomUUID();
  return taskID;

}

// Todo: create a function to create a task card
function createTaskCard(task) {
  const taskCard = $('<div>');
  taskCard.addClass('card task-card draggable my-3')
  taskCard.attr('data-task-id', task.taskID);
  const cardHeader = $('<div>').addClass('card-header h4').text(task.title);
  const cardBody = $('<div>').addClass('card-body');
  const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
  const cardDescription = $('<p>').addClass('card-text').text(task.description);
  const cardDeleteBtn = $('<button>')
  cardDeleteBtn.addClass('btn btn-danger delete')
  cardDeleteBtn.text('Delete')
  cardDeleteBtn.attr('data-task-id', task.taskID);
  cardDeleteBtn.on('click', handleDeleteTask);

  /* Only apply styles if status is not 'done' */
  if (task.status !== 'done') {
    const now = dayjs();
    const formattedDate = now.format('MM/DD/YYYY');
    const taskDueDate = dayjs(task.dueDate, 'MM/DD/YYYY');

    /* If the task is due today, make the card yellow. If it's past due, make it red. */
    if (formattedDate.isSame(taskDueDate)) {
      taskCard.addClass('bg-warning text-white');
    } else if (formattedDate.isAfer(taskDueDate)) {
      taskCard.addClass('bg-danger text-white');
      cardDeleteBtn.addClass('border-light');
    }

  }

  /* append elements to card and card body */
  cardBody.append(cardDueDate, cardDescription, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);

  return taskCard;

}

/* Todo: create a function to render the task list and make cards draggable */
// create separate function to read local storage first
function readTasksFromStorage() {
    // retrieve data from local storage
  let tasks = JSON.parse(localStorage.getItem('tasks'));
  // if there's no data in local storage, assign tasks to new empty array
  if (!tasks) {
    tasks = [];
  }
  return tasks;
}

// save tasks array to local storage
function saveTasksToStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// render task cards to the screen
function renderTaskList() {
  const tasks = readTasksFromStorage();

  // Empty existing lanes
  const todoList = $('#todo-cards');
  todoList.empty();

  const inProgressList = $('#in-progress-cards');
  inProgressList.empty();

  const doneList = $('#done-cards');
  doneList.empty();

  // loop through tasks and append cards for each status/lane
  for (let task of tasks) {
    const taskCard = createTaskCard(task);

    if(task.status === 'to-do') {
        todoList.append(taskCard);
    } else if(task.status === 'in-progress') {      
        inProgressList.append(taskCard);
    } else if(task.status === 'done') {
        doneList.append(taskCard);
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
  const taskTitle = titleEl.val().trim();
  const taskDueDate = dueDateEl.val();
  const taskDescription = descriptionEl.val();

  // ensure that all fields are filled in
  if (!taskTitle || !taskDueDate || !taskDescription) {
    console.log(`All fields must have data.`);
    return;
  }

  /* create new task object based on input values; set default status to 'to-do',
  generate a random id for the newTask object */
  const newTask = {
    taskID: generateTaskId(),
    title: taskTitle,
    dueDate: taskDueDate,
    description: taskDescription,
    status: 'to-do',
  };

  // read tasks from local storage (parse) and push the new task into the array
  const tasks = readTasksFromStorage();
  tasks.push(newTask);

  // save new task list to local storage
  saveTasksToStorage(tasks);

  // render updated task list
  renderTaskList();

  // clear modal input fields
  titleEl.val('');
  dueDateEl.val('');
  descriptionEl.val('');
};



// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
  // set const to taskCard attribute
  const taskID = $(this).attr('data-task-id');
  // parse local storage
  const tasks = readTasksFromStorage();

  // remove the task from the array
  tasks.forEach(task => {
    if(task.taskID === taskID) {
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
//  this should change the status key of the task
function handleDrop(event, ui) {
  // retrieve tasks from local storage
  const tasks = readTasksFromStorage();
  // get the task ID from the ui
  const taskID =  ui.draggable[0].dataset.taskID;
  // find the lane ID
  const laneID = event.$('.lane').taskID; 
  
  // update task statuses based on lanes
  for(let task of tasks) {
    if (task.taskID === taskID) {
      task.status = laneID;
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
  
  // event listener to close modal dialog
  $('.close').on('click', function () {
    $('#formModal').modal('hide');
  });

  // event listener to add task to lane
  taskFormEl.on('submit', handleAddTask);

  //  use event delegation to delete tasks dynamically
  taskDisplayEl.on('click', '.delete', handleDeleteTask);

  // make lanes droppable
  $('.lane').droppable({
    accept: '.draggable',
    drop: handleDrop,
  });

  // make date field a dat picker
  dueDateEl.datepicker({
    changeMonth: true,
    changeYear: true,
  });
});

