var taskIdCounter = 0;

var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgress = document.querySelector("#tasks-in-progress");
var tasksCompleted = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");

// create array to hold tasks for saving
var tasks = [];

var taskFormHandler = function(event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
   
   // check if inputs are empty (validate)
    if (!taskNameInput || !taskTypeInput) {
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
        type: taskTypeInput,
        status: "to do"
        };
        createTaskEl(taskDataObj);
    }
    
};

var createTaskEl = function(taskDataObj) {
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.setAttribute("data-task-id", taskIdCounter);
    listItemEl.setAttribute("draggable", "true");

    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = 
        "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    tasksToDoEl.appendChild(listItemEl);
    switch (taskDataObj.status) {
        case "to do":
          taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
          tasksToDoEl.append(listItemEl);
          break;
        case "in progress":
          taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
          tasksInProgressEl.append(listItemEl);
          break;
        case "completed":
          taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
          tasksCompletedEl.append(listItemEl);
          break;
        default:
          console.log("Something went wrong!");
      }

    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);
    // increase counter for next unique id
    taskIdCounter++;
    saveTasks();
};


var completeEditTask = function(taskName, taskType, taskId){
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;
    for (var i = 0; i < tasks.length; ++i) {
        if (tasks[i].id === parseInt(taskId)){
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }
    alert("Task Updated!")
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task"
    saveTasks();
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
};



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
};

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
};

var delTask = function(taskId){
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();
    // creates a new array to hold the updated list of tasks
    var updatedTaskArr = [];
    // loop through current tasks
    for (i = 0; i < tasks.length; ++i) {
        // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
        if (tasks[i].id !== parseInt(taskId)){
            updatedTaskArr.push(tasks[i]);
        }
    }
    // reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;
    saveTasks();
};

var taskStatusChangeHandler = function(event){
    // get the task item's id
    taskId = event.target.getAttribute("data-task-id");
    // get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();
    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgress.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompleted.appendChild(taskSelected);
    }
    for (var i = 0; i < tasks.length; ++i) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }
    saveTasks();
};

var dragTaskHandler = function(){
    var taskId = event.target.getAttribute("data-task-id");
    event.dataTransfer.setData("text/plain", taskId);
    // var getId = event.dataTransfer.getData("text/plain");
    // console.log("getId", getId, typeof getId);
};

var dropZoneDragHandler = function(){
    var taskListEl = event.target.closest(".task-list");
        if (taskListEl){
            event.preventDefault();
            taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed; box-shadow: 0 0 10px rgba(0, 0, 0, 50%)");           
        }
};

var dropTaskHandler = function(event){
    var id = event.dataTransfer.getData("text/plain");
    var draggableElement = document.querySelector("[data-task-id='" + id + "']")
    var dropZoneEl = event.target.closest(".task-list");
    var statusType = dropZoneEl.id;
    var statusSelectEl = draggableElement.querySelector("select[name='status-change']")
        if (statusType === "tasks-to-do"){
            statusSelectEl.selectedIndex = 0;
        }
        else if (statusType === "tasks-in-progress"){
            statusSelectEl.selectedIndex = 1;
        }
        else if (statusType === "tasks-completed"){
            statusSelectEl.selectedIndex = 2;
        }
        dropZoneEl.appendChild(draggableElement);
        dropZoneEl.removeAttribute("style");
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].id === parseInt(id)) {
                tasks[i].status = statusSelectEl.value.toLowerCase();
            }
        }
        saveTasks();
};

var dragLeaveHandler = function(event) {
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
    taskListEl.removeAttribute("style");
    }
};

var saveTasks = function(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

var loadTasks = function(){
    // get tasks from local storage
   tasks = localStorage.getItem("tasks", tasks)
   
   if (tasks === null){
       tasks = [];
       return false
   }
    // convert from string form back to array
    tasks = JSON.parse(tasks);
    // loop through the array and append tasks to the page
    for (var i = 0; i < tasks.length; ++i) {
        tasks[i].id = taskIdCounter;
        
        var listItemEl = document.createElement("li");
        listItemEl.className = "task-item";
         // add task id as a custom attribute
        listItemEl.setAttribute("data-task-id", tasks[i].id);
        listItemEl.setAttribute("draggable", "true")
        
        var taskInfoEl = document.createElement("div")
        // give it a class name
        taskInfoEl.className = "task-info";
        // add HTML content to div
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";
        listItemEl.appendChild(taskInfoEl);

        var taskActionsEl = createTaskActions(tasks[i].id);
        listItemEl.appendChild(taskActionsEl);
        if (tasks[i].status === "to do"){
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
            tasksToDoEl.appendChild(listItemEl);
        }
        else if (tasks[i].status === "in progress"){
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
            tasksInProgress.appendChild(listItemEl);
        }
        else if (tasks[i].status === "completed"){
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
            tasksCompleted.appendChild(listItemEl);
        }
        taskIdCounter++;
        
        console.log(listItemEl);
    }
}

loadTasks();
pageContentEl.addEventListener("click", taskBtnHandler)
pageContentEl.addEventListener("change", taskStatusChangeHandler)
pageContentEl.addEventListener("dragstart", dragTaskHandler)
pageContentEl.addEventListener("dragover", dropZoneDragHandler);
pageContentEl.addEventListener("drop", dropTaskHandler);
pageContentEl.addEventListener("dragleave", dragLeaveHandler);


