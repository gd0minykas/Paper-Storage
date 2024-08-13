// MVP - Minimum Viable Program
// Maybe REDO with blob.text .txt part later?

// const fs = require("fs");
const tableTemplate = document.querySelector("table").innerHTML;
let showInput = false;

// Retrieve to from JSON
function retrieveJSON() {
  fetch("./source.json")
    .then((res) => {
      if (!res.ok) {
        alert("Failed reading JSON");
      }
      return res.json();
    })
    .then((json) => json.forEach((b) => console.log(b.Name)));
}

// Retreive from a txt.
function retrieveTXT() {
  if (document.querySelector("input[type=file]").value !== "") {
    document.querySelector("table").innerHTML = tableTemplate;
    const [file] = document.querySelector("input[type=file]").files;
    if (!file) {
      return;
    }
    if (file.type !== "text/plain") {
      return alert("Only text files (.txt) supported!");
    }
    const fr = new FileReader();
    fr.readAsText(file);

    fr.addEventListener("load", () => {
      // populating the table
      const workers = fr.result.split("\n");
      for (let i = 0; i < workers.length; i++) {
        console.log(workers[i]);
        const temp = workers[i].split(" ");
        document.querySelector("table").innerHTML += `<tr id=output${i}></tr>`;
        document.getElementById(`output${i}`).innerHTML += `<th>${i + 1}</th>`;
        for (let j = 0; j < temp.length; j++) {
          console.log(temp[j]);
          document.getElementById(
            `output${i}`
          ).innerHTML += `<td>${temp[j]}</td>`;
        }
      }
    });

    fr.addEventListener("error", (e) => {
      const error = e.target.error;
      alert(`Error while reading a file. ${error}`);
    });
  } else {
    alert("Empty file input");
  }

  // const data = "test";
  // fs.writeFile(file, data, (err) => {
  //   return alert("Failed to write file");
  // });
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
