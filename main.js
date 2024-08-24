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
  document.getElementById(`new`).removeAttribute("hidden");
}

function editWorker(id) {
  showField = true;
  document.getElementById(`fieldName${id}`).removeAttribute("disabled");
  document.getElementById(`fieldNick${id}`).removeAttribute("disabled");
  document.getElementById(`fieldSur${id}`).removeAttribute("disabled");
  document.getElementById(`${id}`).setAttribute("disabled", true);
  document.getElementById(`save`).removeAttribute("hidden");
}

function deleteWorker(id) {}

function addNewWorker() {
  console.log("NEW");
}

function saveEditWorker() {
  // after save, disable input fields and save object to the file
  document.getElementById(`save`).setAttribute("hidden", true);
  for (let i = 0; i < localStorage.length; i++) {
    document.getElementById(`fieldName${i}`).setAttribute("disabled", true);
    document.getElementById(`fieldNick${i}`).setAttribute("disabled", true);
    document.getElementById(`fieldSur${i}`).setAttribute("disabled", true);
    document.getElementById(`${i}`).removeAttribute("disabled");
  }
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
  document.querySelector("table").innerHTML = tableTemplate;
}
