function loadSource() {
  const reader = new FileReader();
  const content = document.querySelector(".content");
  const [file] = document.querySelector("input[type=file]").files;

  reader.addEventListener("load", () => {
    content.innerText = reader.result;
  });

  if (file) {
    reader.readAsText(file);
  }
}
