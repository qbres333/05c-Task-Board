// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {

}

// Todo: create a function to create a task card
function createTaskCard(task) {

}

/* Todo: create a function to render the task list and 
 make cards draggable */
function renderTaskList() {

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
  // event.preventDefault();
  // $("#formModal").modal('show');

  // JQuery script to amend
  $(function () {
    var dialog,
      form,
      // From https://html.spec.whatwg.org/multipage/input.html#e-mail-state-%28type=email%29
      emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      name = $("#name"),
      email = $("#email"),
      password = $("#password"),
      allFields = $([]).add(name).add(email).add(password),
      tips = $(".validateTips");

    function updateTips(t) {
      tips.text(t).addClass("ui-state-highlight");
      setTimeout(function () {
        tips.removeClass("ui-state-highlight", 1500);
      }, 500);
    }

    function checkLength(o, n, min, max) {
      if (o.val().length > max || o.val().length < min) {
        o.addClass("ui-state-error");
        updateTips(
          "Length of " + n + " must be between " + min + " and " + max + "."
        );
        return false;
      } else {
        return true;
      }
    }

    function checkRegexp(o, regexp, n) {
      if (!regexp.test(o.val())) {
        o.addClass("ui-state-error");
        updateTips(n);
        return false;
      } else {
        return true;
      }
    }

    function addUser() {
      var valid = true;
      allFields.removeClass("ui-state-error");

      valid = valid && checkLength(name, "username", 3, 16);
      valid = valid && checkLength(email, "email", 6, 80);
      valid = valid && checkLength(password, "password", 5, 16);

      valid =
        valid &&
        checkRegexp(
          name,
          /^[a-z]([0-9a-z_\s])+$/i,
          "Username may consist of a-z, 0-9, underscores, spaces and must begin with a letter."
        );
      valid = valid && checkRegexp(email, emailRegex, "eg. ui@jquery.com");
      valid =
        valid &&
        checkRegexp(
          password,
          /^([0-9a-zA-Z])+$/,
          "Password field only allow : a-z 0-9"
        );

      if (valid) {
        $("#users tbody").append(
          "<tr>" +
            "<td>" +
            name.val() +
            "</td>" +
            "<td>" +
            email.val() +
            "</td>" +
            "<td>" +
            password.val() +
            "</td>" +
            "</tr>"
        );
        dialog.dialog("close");
      }
      return valid;
    }

    dialog = $("#dialog-form").dialog({
      autoOpen: false,
      height: 400,
      width: 350,
      modal: true,
      buttons: {
        "Create an account": addUser,
        Cancel: function () {
          dialog.dialog("close");
        },
      },
      close: function () {
        form[0].reset();
        allFields.removeClass("ui-state-error");
      },
    });

    form = dialog.find("form").on("submit", function (event) {
      event.preventDefault();
      addUser();
    });

    $("#create-user")
      .button()
      .on("click", function () {
        dialog.dialog("open");
      });
  });

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

});

