// creating a variable to store item needed to
const input = document.getElementById("task-input");
const totalTasks = document.getElementById("total");
const completedTasks = document.getElementById("completed");
const modal = document.getElementById("modal");
// the number of recently deleted item that should be shown beneath the recently completed task
const maxRecentlyDeleted = 20;


loadData("totalTasks") || saveData("totalTasks", 0);
loadData("completedTasks") || saveData("completedTasks", 0);
loadData("toDoTheme") || saveData("toDoTheme", "light");

totalTasks.innerHTML = loadData("totalTasks");
completedTasks.innerHTML = loadData("completedTasks");


input.addEventListener("keydown", function (e) {
  if (e.keyCode === 13) {
        let task = new Task(input.value);
        input.value = "";

        if (task.title.length === 0) { return }
        addTask(taskStore, task, function () {
          let amountOfTasks = Number(loadData("totalTasks")) + 1;
          saveData("totalTasks", amountOfTasks);
          totalTasks.innerHTML = loadData("totalTasks")
          updateTasks();
        });
  }
});


function updateTasks() {
  readTasks(taskStore, function (tasks) {
    let list = document.getElementById("task-list");
    let innerHTML = "";
    for (var i = 0; i < tasks.length; i++) {
      innerHTML += `
          <li data-id='${tasks[i].id}'' onclick = "deleteTaskOnClick(this)">
              ${tasks[i].title}
          </li>
      `;
    }
    list.innerHTML = innerHTML;
  });


    readTasks(completedTaskStore, function (tasks) {
      let list = document.getElementById("completed-task-list");
      let innerHTML = "";
      tasks.reverse();
      for (var i = 0; i < Math.min(tasks.length, maxRecentlyDeleted); i++) {
        innerHTML += `
        <li class = "invert">${tasks[i].title}: <span>${tasks[i].completedDate}</span></li>`;
      }
      list.innerHTML = innerHTML;
    });

}


function onLoad() {
  updateTasks();
  updateTheme(loadData("toDoTheme"));
  document.body.style.display = "flex";
}


function deleteTaskOnClick(elem) {
  let id = Number(elem.dataset.id);

  let task = readOneTask(taskStore, id, function (task) {
    let completedTask = new CompletedTask(task.title);
    addTask(completedTaskStore, completedTask, function () {
      elem.classList.add("exist");

      elem.addEventListener("animationend", function () {
        deleteTask(taskStore, id, function () {
          let amountOfTask = Number(loadData("totalTasks")) - 1;
          saveData("totalTasks", amountOfTask);
          totalTasks.innerHTML = loadData("totalTasks");

          let amountOfCompletedTask = Number(loadData("completedTasks")) + 1;
          saveData("completedTasks", amountOfCompletedTask);
          completedTasks.innerHTML = loadData("completedTasks");

          updateTasks();
        });
      });

    });
  });


}

// function to update the theme
function updateTheme(theme) {

  let bgColor = theme == 'light' ? "255, 255, 255" : "19, 19, 19";
  let textColor = theme == 'light' ? "12, 12, 12" : "255, 255, 255";
  let shadowColor = theme == 'light' ? "0, 0, 0" : "255, 255, 255";
  let grad1 = theme == 'light' ? "108, 29, 103" : "34, 208, 163";
  let grad2 = theme == 'light' ? "100, 25, 148" : "32, 173, 211";
  let sideGrad1 = theme == 'light' ? "255, 255, 255" : "35, 35, 35";
  let sideGrad2 = theme == 'light' ? "251, 247, 247" : "46, 46, 46";

  let root = document.documentElement;

  root.style.setProperty("--bg-color", bgColor);
  root.style.setProperty("--text-color", textColor);
  root.style.setProperty("--shadow-color", shadowColor);
  root.style.setProperty("--gradient-1", grad1);
  root.style.setProperty("--gradient-2",grad2);
  root.style.setProperty("--sidebar-gradient-1", sideGrad1);
  root.style.setProperty("--sidebar-gradient-2", sideGrad2);

  document.getElementsByClassName("current-theme")[0].classList.remove("current-theme");

  let activateClass = theme == "light" ? "light" : "dark";
  document.getElementById(activateClass).classList.add("current-theme");

  saveData("toDoTheme", theme);

  let invertStrength = theme == "light" ? "0%" : "100%";
  let icons = document.getElementsByClassName("icon");
  for(let i = 0; i < icons.length; i++) {
      icons[i].style.filter = `brightness(100%) invert(${invertStrength})`;
  }
}


// function to reset the data
function attemptReset() {
  modal.showModal();
}

function closeModal() {
  modal.close();
}

function reset() {
  saveData("totalTasks", 0);
  totalTasks.innerHTML = "0";

  saveData("completedTasks", 0);
  completedTasks.innerHTML = "0";

  deleteAllTasks(taskStore);
  deleteAllTasks(completedTaskStore);

  updateTasks();
}
