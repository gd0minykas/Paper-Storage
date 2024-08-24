// MVP - Minimum Viable Program

const tableTemplate = document.querySelector("table").innerHTML;
let showField = false;
let showInput = false;

function worker(name, nickname, surname) {
  this.name = name;
  this.nickname = nickname;
  this.surname = surname;
}

// Retrieve to from JSON
function retrieveJSON() {
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
        const workerObject = new worker(temp[0], temp[1], temp[2]);
        localStorage.setItem(i, JSON.stringify(workerObject));
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
  document.querySelector("table").innerHTML += `<tr id=newWorker>
  <button onclick="addNewWorker()" class="btn btn-warning my-3 me-3">
    New Worker
  </button>
  </tr>`;
}

function editWorker(id) {
  showField = true;
  //THIS!!@!@!#
  document.getElementById(`fieldName${id}`).ariaDisabled = false;
  document.getElementById(`fieldNick${id}`).ariaDisabled = false;
  document.getElementById(`fieldSur${id}`).ariaDisabled = false;
  // console.log(document.getElementById(`fieldName${id}`).value);
  // console.log(document.getElementById(`fieldNick${id}`).value);
  // console.log(document.getElementById(`fieldSur${id}`).value);
}

function deleteWorker(id) {}

function addNewWorker() {
  console.log("NEW");
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
  document.querySelector("table").innerHTML = tableTemplate;
}
