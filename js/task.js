// setting up our Indexed DB
let database;

const taskStore = "Tasks"
const completedTaskStore = "CompletedTasks"

// function to store the inputed task by the user
function Task(title) {
  this.title = title;
}

// function to store the completed task by the user
function CompletedTask(title) {
  this.title = title;
  this.completedDate = getCurrentDate();
}


window.onload = function () {
  let req = window.indexedDB.open("GetItDoneAppDB");

  req.onsuccess = function () {
    database = req.result;
    onLoad();
  }

  req.onerror = function (event) {
    alert("There was an error", event)
  }

  req.onupgradeneeded = function (event) {
      let db = req.result;
      console.log("Created stores");
      let objectStore1 = db.createObjectStore(taskStore, { keyPath: "id", autoIncrement: true});
      let objectStore2 = db.createObjectStore(completedTaskStore , { keyPath: "id", autoIncrement: true});
  }
















}


let defaultError = function () {
  console.log("something went wrong");
}

// creating function to add task that the user inputs
function addTask(store, task, success, error = defaultError) {
  let transaction = database.transaction([store], "readwrite");
  let objectStore = transaction.objectStore(store);
  let request = objectStore.add(task);
  request.onerror = error;
  request.onsuccess = success;
}

// function to read our task
function readTasks(store, success, error = defaultError) {
  let transaction = database.transaction([store], "readonly");
  let objectStore = transaction.objectStore(store);
  let request = objectStore.openCursor();
  request.onerror = error;
  let tasks = [];
  request.onsuccess = function (event) {
    let cursor = event.target.result;
      if (cursor) {
        let task = cursor.value;
        tasks.push(task);
        cursor.continue();
      } else {
        success(tasks);
      }
  };
}


// Function to read one task
function readOneTask(store, id, success, error = defaultError) {
  let transaction = database.transaction([store], "readonly");
  let objectStore = transaction.objectStore(store);
  let request = objectStore.get(id);
  request.onerror = error;
  request.onsuccess = function () {
    success(request.result);
  };
}


// function to delete a task from the task list
function deleteTask(store, id, success, error = defaultError) {
  let transaction = database.transaction([store], "readwrite");
  let objectStore = transaction.objectStore(store);
  let request = objectStore.delete(id);
  request.onerror = error;
  request.onsuccess = success;
}


// function to clear all task in the objectStore
function deleteAllTasks(store, success, error = defaultError) {
  success = success || function() {}
  let transaction = database.transaction([store], "readwrite");
  let objectStore = transaction.objectStore(store);
  let request = objectStore.clear();
  request.onerror = error;
  request.onsuccess = success;
}
