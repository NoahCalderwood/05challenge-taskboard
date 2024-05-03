// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"))??[];
let nextId = JSON.parse(localStorage.getItem("nextId"));
const taskTitle = $('#taskTitle');
const taskDescription = $('#taskDescription');
const taskDueDate = $('#taskDueDate');
// Todo: create a function to generate a unique task id
function generateTaskId() {
    taskId = crypto.randomUUID();
    console.log(taskId);
}


// Todo: create a function to create a task card
function createTaskCard(task) {
  const taskCard = $('<div>').addClass('card project-card draggable my-3').attr('data-project-id', task.id);
  const cardHeader = $('<div>').addClass('card-header h4').text(task.name);
  const cardBody = $('<div>').addClass('card-body');
  const cardDescription = $('<p>').addClass('card-text').text(task.type);
  const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
  const cardDeleteBtn = $('<button>').addClass('btn btn-danger delete').text('Delete').attr('data-project-id', task.id);
  cardDeleteBtn.on('click', handleDeleteTask);

  if (task.dueDate && task.status !== 'done') {
    const now = dayjs();
    const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

    if (now.isSame(taskDueDate, 'day')) {
      taskCard.addClass('bg-warning text-white');
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass('bg-danger text-white');
      cardDeleteBtn.addClass('border-light');
    }
  }

  // Append the card description, card due date, and card delete button to the card body.
  // Append the card header and card body to the card.
  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);

  return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const todoList = $('#todo-cards');
    todoList.empty();
    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();
    const doneList = $('#done-cards');
    doneList.empty();

    for (let task of taskList) {
        if (task.status === 'to-do') {
          todoList.append(createTaskCard(task));
        } else if (task.status === 'in-progress') {
          inProgressList.append(createTaskCard(task));
        } else if (task.status === 'done') {
          doneList.append(createTaskCard(task));
        }
      }
      $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        helper: function (e) {
          const original = $(e.target).hasClass('ui-draggable')
            ? $(e.target)
            : $(e.target).closest('.ui-draggable');
          // ? Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
          return original.clone().css({
            width: original.outerWidth(),
          });
        },
    });
    
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    // Get the project name, type, and due date from the form
    const taskName = taskTitle.val().trim();
    const taskType = taskDescription.val();
    const taskDate = taskDueDate.val();
  
    // ? Create a new project object with the data from the form
    const newTask = {
      // ? Here we use a tool called `crypto` to generate a random id for our project. This is a unique identifier that we can use to find the project in the array. `crypto` is a built-in module that we can use in the browser and Nodejs.
      id: crypto.randomUUID(),
      name: taskName,
      type: taskType,
      dueDate: taskDate,
      status: 'to-do',
    };
  
    taskList.push(newTask);
  
    // ? Save the updated projects array to localStorage
    localStorage.setItem('tasks', JSON.stringify(taskList));
  
    // ? Print project data back to the screen
    renderTaskList();
  
    // Clear the form inputs
    taskTitle.val('');
    taskDescription.val('');
    taskDueDate.val('');
}


// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const projectId = $(this).attr('data-project-id');

    taskList.forEach((task) => {
        if (task.id === projectId) {
          taskList.splice(taskList.indexOf(task), 1);
        }
      });
    
      localStorage.setItem('tasks', JSON.stringify(taskList));

      renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

    const taskId = ui.draggable[0].dataset.projectId;

    const newStatus = event.target.id;
  
    for (let task of taskList) {
      if (task.id === taskId) {
        task.status = newStatus;
      }
    }
    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
      });

    //datepicker already used by date type
    // $('#taskDueDate').datepicker({
    //     changeMonth: true,
    //     changeYear: true,
    // });
});
$('#form').on('submit', handleAddTask);
