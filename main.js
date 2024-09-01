// MVP - Minimum Viable Program
const tableTemplate = document.querySelector("table").innerHTML;
let showInput = false;
let newWorkerToLocalStorage = false;
localStorage.clear();

function worker(name, nickname, surname) {
  this.name = name;
  this.nickname = nickname;
  this.surname = surname;
}

// Retrieve to from JSON
function retrieveJSON() {
  localStorage.clear();
  resetTable();
  fetch("./source.json")
    .then((res) => {
      if (!res.ok) {
        return alert("Failed reading JSON");
      }
      return res.json();
    })
    .then((json) => {
      let i = 0;
      json.forEach((e) => {
        const workerObject = new worker(e.Name, e.Nickname, e.Surname);
        localStorage.setItem(i, JSON.stringify(workerObject));
        i++;
      });
      populateRow();
    });
}

// Retreive from a txt.
// File format with '' to allow names with whitespaces. (NOT MVP)
function retrieveTXT() {
  localStorage.clear();
  // reading a file
  if (document.querySelector("input[type=file]").value !== "") {
    document.querySelector("table").innerHTML = tableTemplate;
    const [file] = document.querySelector("input[type=file]").files;
    if (!file && file.type !== "text/plain") {
      return alert(
        "Only text files (.txt) supported or file was not provided!"
      );
    }
    // Iniciating a FileReader and reading as text.
    const fr = new FileReader();
    fr.readAsText(file);

    fr.addEventListener("load", () => {
      // fr result putting into worker object
      // and making an array of workers.
      const result = fr.result.split("\n");
      for (let i = 0; i < result.length; i++) {
        const temp = result[i].split(" ");
        if (!temp[0] == "") {
          const workerObject = new worker(temp[0], temp[1], temp[2]);
          localStorage.setItem(i, JSON.stringify(workerObject));
        }
      }
      // populating the table
      populateRow();
    });
    // Error handling
    fr.addEventListener("error", (e) => {
      const error = e.target.error;
      return alert(`Error while reading a file. ${error}`);
    });
  } else {
    return alert("Empty file input");
  }
}
// Populating a table.
function populateRow() {
  resetTable();
  for (let i = 0; i < localStorage.length; i++) {
    const workerTemp = JSON.parse(localStorage.getItem(`${i}`));
    const workerObject = new worker(
      workerTemp.name,
      workerTemp.nickname,
      workerTemp.surname
    );
    document.querySelector("table").innerHTML += `<tr id=output${i}></tr>`;
    document.getElementById(`output${i}`).innerHTML += `<th>${i + 1}</th>`;
    document.getElementById(
      `output${i}`
    ).innerHTML += `<td><input class="form-control" id="fieldName${i}" type="text" value="${workerObject.name}" disabled /></td>`;
    document.getElementById(
      `output${i}`
    ).innerHTML += `<td><input class="form-control" id="fieldNick${i}" type="text" value="${workerObject.nickname}" disabled /></td>`;
    document.getElementById(
      `output${i}`
    ).innerHTML += `<td><input class="form-control" id="fieldSur${i}" type="text" value="${workerObject.surname}" disabled /></td>`;
    document.getElementById(
      `output${i}`
    ).innerHTML += `<td><button id="${i}" onClick="editWorker(this.id)"
      class="btn btn-warning btn-sm">
      Edit
    </button>
     | 
    <button id="${i}" onClick="deleteWorker(this.id)"
      class="btn btn-warning btn-sm">
      Delete
    </button>`;
  }
  document.getElementById(`new`).removeAttribute("hidden");
  document.getElementById(`download`).removeAttribute("hidden");
}

function editWorker(id) {
  showField = true;
  document.getElementById(`fieldName${id}`).removeAttribute("disabled");
  document.getElementById(`fieldNick${id}`).removeAttribute("disabled");
  document.getElementById(`fieldSur${id}`).removeAttribute("disabled");
  document.getElementById(`${id}`).setAttribute("disabled", true);
  // expose save button
  document.getElementById(`save`).removeAttribute("hidden");
}

function deleteWorker(id) {
  // localStorage put into an array, remove a field and push back.
  let arr = new Array();
  for (let i = 0; i < localStorage.length; i++) {
    arr[i] = JSON.parse(localStorage.getItem(`${i}`));
  }
  arr.splice(id, 1);
  localStorage.clear();
  let j = 0;
  arr.forEach((e) => {
    localStorage.setItem(`${j}`, JSON.stringify(e));
    j++;
  });
  resetTable();
  populateRow();
  // expose save button
  document.getElementById(`save`).removeAttribute("hidden");
}

function addNewWorker() {
  // expose save button
  document.getElementById(`save`).removeAttribute("hidden");
  // check how much workders are saves in local storage, then last key++
  // and create a row with input fields. After values are inputed, Save.
  let newWorkerName = "";
  let newWorkerNick = "";
  let newWorkerSur = "";
  const i = localStorage.length;

  document.querySelector("table").innerHTML += `<tr id=output${i}></tr>`;
  document.getElementById(`output${i}`).innerHTML += `<th>${i + 1}</th>`;
  document.getElementById(
    `output${i}`
  ).innerHTML += `<td><input class="form-control" id="fieldName${i}" type="text" value="${newWorkerName}" disabled /></td>`;
  document.getElementById(
    `output${i}`
  ).innerHTML += `<td><input class="form-control" id="fieldNick${i}" type="text" value="${newWorkerNick}" disabled /></td>`;
  document.getElementById(
    `output${i}`
  ).innerHTML += `<td><input class="form-control" id="fieldSur${i}" type="text" value="${newWorkerSur}" disabled /></td>`;
  document.getElementById(
    `output${i}`
  ).innerHTML += `<td><button id="${i}" onClick="editWorker(this.id)"
      class="btn btn-warning btn-sm">
      Edit
    </button>
     | 
    <button id="${i}" onClick="deleteWorker(this.id)"
      class="btn btn-warning btn-sm">
      Delete
    </button>`;
  newWorkerToLocalStorage = true;
  editWorker(i);
}

function save() {
  let localStorageLength = localStorage.length;
  if (newWorkerToLocalStorage) localStorageLength++;
  // after save, disable input fields and save object to the file
  // hide save button
  document.getElementById(`save`).setAttribute("hidden", true);
  for (let i = 0; i < localStorageLength; i++) {
    document.getElementById(`fieldName${i}`).setAttribute("disabled", true);
    document.getElementById(`fieldNick${i}`).setAttribute("disabled", true);
    document.getElementById(`fieldSur${i}`).setAttribute("disabled", true);
    document.getElementById(`${i}`).removeAttribute("disabled");
  }
  for (let i = 0; i < localStorageLength; i++) {
    const workerObject = new worker(
      document.getElementById(`fieldName${i}`).value,
      document.getElementById(`fieldNick${i}`).value,
      document.getElementById(`fieldSur${i}`).value
    );
    localStorage.setItem(`${i}`, JSON.stringify(workerObject));
  }
  populateRow();
}

function downloadJSON() {
  console.log("Download");
  let arr = [];
  // make array of objects, stringify them and make a blob
  for (let i = 0; i < localStorage.length; i++) {
    arr.push(localStorage.getItem(`${i}`));
  }
  const jsonData = JSON.stringify(arr);
  console.log(jsonData);
  const blob = new Blob([jsonData], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.download = "paperTable.json";
  link.href = URL.createObjectURL(blob);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function downloadText() {
  let arr = [];
  // make array of objects, stringify them and make a blob
  for (let i = 0; i < localStorage.length; i++) {
    arr.push(JSON.parse(localStorage.getItem(`${i}`)));
  }
  let textData = "";
  arr.forEach((data) => {
    textData += `${data.name} ${data.nickname} ${data.surname}\n`;
  });
  const blob = new Blob([textData], {
    type: "text/plain",
  });
  const link = document.createElement("a");
  link.download = "paperTable.txt";
  link.href = URL.createObjectURL(blob);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function toggleInput() {
  showInput = !showInput;

  if (showInput) {
    document.getElementById("txt").className = "btn btn-dark me-3";
    document.getElementById("sourceDiv").style.visibility = "visible";
  } else {
    document.getElementById("txt").className = "btn btn-outline-dark me-3";
    document.getElementById("sourceDiv").style.visibility = "hidden";
  }
}

function clearInput() {
  document.querySelector("input[type=file]").value = "";
}

function resetTable() {
  clearInput();
  document.getElementById(`save`).setAttribute("hidden", true);
  document.getElementById(`new`).setAttribute("hidden", true);
  document.getElementById(`download`).setAttribute("hidden", true);
  document.querySelector("table").innerHTML = tableTemplate;
}
