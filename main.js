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
  const fr = new FileReader();
  showInput = true;

  if (showInput) {
    document.getElementById("sourceDiv").style.visibility = "visible";
  }

  console.log(showInput);
}

function toggleInput() {
  document.getElementById("sourceDiv").style.visibility = "hidden";
}
