var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");



var completeEditTask = function(taskName, taskType, taskId){
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;
    alert("Task Updated!")
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task"

}
var taskFormHandler = function(){
    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value
    var taskTypeInput = document.querySelector("select[name='task-type']").value
    if (!taskNameInput || !taskTypeInput){
        alert("You need to fill out the task form!");
        return false;
        
    }
    formEl.reset();
    // console.log(taskNameInput);
    var isEdit = formEl.hasAttribute("data-task-id");
    
   

    // send it as an argument to createTaskEl
    // has data attribute, so get task id and call function to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // no data attribute, so create object as normal and pass to createTaskEl function
    else {
        // pack data as object
        var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
        };
        createTaskEl(taskDataObj);
    }
    
};

var createTaskEl = function(taskDataObj){
    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    // add task id as a custom attribute
  listItemEl.setAttribute("data-task-id", taskIdCounter);

    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div")
    // give it a class name
    taskInfoEl.className = "task-info";
    // add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl)
    // add entire list item to list
    tasksToDoEl.appendChild(listItemEl);
    // increase counter for next unique id
    taskIdCounter++;
};

var createTaskActions = function (taskId){
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";
    var editBtnEl = document.createElement("button");
    editBtnEl.textContent = "Edit";
    editBtnEl.className = "btn edit-btn";
    editBtnEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editBtnEl);

    var delBtnEl = document.createElement("button");
    delBtnEl.textContent = "Delete"
    delBtnEl.className = "btn delete-btn"
    delBtnEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(delBtnEl);

    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);
    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (var i = 0; i < statusChoices.length; ++i) {
        // create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i])
        //append to select
        statusSelectEl.appendChild(statusOptionEl);
    }
    



    return actionContainerEl;
}



formEl.addEventListener("submit", taskFormHandler);

var taskBtnHandler = function(event) {
    var targetEl = event.target;
    // console.log(event.target);
    //edit button was clicked
    if (targetEl.matches(".edit-btn")){
        var taskId = event.target.getAttribute("data-task-id")
        editTask(taskId);
    }
    // delete button was clicked
    else if (targetEl.matches(".delete-btn")){
        // console.log("you clicked a delete button!");
        // get the element's task id
        var taskId = event.target.getAttribute("data-task-id")
        delTask(taskId);
    }
}

var editTask = function(taskId){
   // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    // console.log(taskName);
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    // console.log(taskType);
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id", taskId);
}

var delTask = function(taskId){
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();
};
pageContentEl.addEventListener("click", taskBtnHandler)

