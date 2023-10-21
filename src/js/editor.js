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

/*Controla a exibição do editor */
function editorController(isView, isClose, idNote) {
  editor.setText("");
  editor.enable(!isView);
  title.value = "";
  title.disabled = false;

  saveButton.classList.toggle("show", isView);
  saveButton.querySelector("span").innerHTML = isView ? "edit" : "save";

  if (isView) {
    appState.setIdNote(idNote);
  }

  popup_box.classList.toggle("show", isClose);
  editor.focus();
}
