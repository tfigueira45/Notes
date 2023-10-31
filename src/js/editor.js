const container = document.querySelector(".editor");

const editor = new Quill(container, {
  debug: "info",
  modules: {
    toolbar: [
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
    ],
  },
  readOnly: false,
  placeholder: "Comece a digitar...",
  theme: "snow",
});

function editorController(isView, isClose, idNote) {
  editor.setText("");
  editor.enable(!isView);
  title.value = "";
  title.disabled = false;

  saveButton.classList.toggle("show", isView && !appState.saved);
  saveButton.querySelector("span").innerHTML = isView && !appState.saved ? "edit" : "save";

  if (isView) {
    appState.setIdNote(idNote);
    title.disabled = true;
  }

  popup_box.classList.toggle("show", isClose);
  editor.focus();
}

function setDataEditor(id){
  editor.setText(notebooks[appState.selectedNotebook][id].text);
  editor.setContents(notebooks[appState.selectedNotebook][id].contents);
  title.value = notebooks[appState.selectedNotebook][id].title;
}