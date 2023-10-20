const notebooksContainer = document.querySelector(".notebooksContainer .items");
const notesContainer = document.querySelector(".content");
const notebookItem = document.querySelectorAll(".notebookItem");
const editorContainer = document.querySelector(".popup_box .popup .editor");
const title = document.querySelector(".title");
const saveButton = document.querySelector(".saveButton");
const popup_box = document.querySelector(".popup_box");

const notebooksProto = {
  create: function (name) {
    this[name] = [];
  },

  edit: function (name, newName) {
    this[newName] = this[name];
    delete this[name];
  },

  delete: function (name) {
    delete this[name];
  },
};

let appState = {
  saved: false,
  isView: false,
  isUpdate: false,
  isFilled: false,
  selectedNotebook: document.querySelector('.selected').dataset.notebook, 

  setSaved: function (save) {
    this.saved = save;
  },
  setIsView: function (view) {
    this.isView = view;
  },
  setIsUpdate: function (update) {
    this.isUpdate = update;
  },
  setIsFilled: function (fill) {
    this.isFilled = fill;
  },
  setSelectedNotebook: function(notebook){
    this.selectedNotebook = notebook;
  }
};

let notebooks = JSON.parse(localStorage.getItem("notesDB") || "{}");
notebooks.__proto__ = notebooksProto;

function addNotebook() {
  removeAllClass("selected", ".notebookItem");
  notebooksContainer.insertAdjacentHTML(
    "afterbegin",
    notebookTemplate("selected", "")
  );
  addNotebookButtonsListeners();
  toggleInput(document.querySelector(".notebookItem"), true);
  localStorage.setItem("notesDB", JSON.stringify(notebooks));
}

function editNotebook(element) {
  toggleInput(element);
}

function deleteNotebook(element) {
  const notebook = element.dataset.notebook;
  const confirm = showAlert({
    title: "Tem certeza?",
    text: `Deseja deletar ${notebook}?`,
    icon: "warning",
    buttons: {
      cancel: "Não",
      catch: {
        text: "Deletar",
        value: "noSave",
      },
    },
    dangerMode: true,
  });
  if (confirm == "noSave") {
    notebooks.delete(notebook);
    localStorage.setItem("notesDB", JSON.stringify(notebooks));
    showNotebooks();
  }
}

function showNotebooks(event) {
  console.log(event);
  const keys = Object.keys(notebooks);
  notebooksContainer.innerHTML = "";
  keys.forEach(function (key, i) {
    if (keys.length > 0) {
      notebooksContainer.insertAdjacentHTML(
        "afterbegin",
        notebookTemplate(
          event === "load" ? (i === 0 ? "selected" : "") : "",
          key
        )
      );
      addNotebookButtonsListeners();
    }
  });
}

function addNote() {
  getNoteInfo()
  notebooks[appState.selectedNotebook].push(noteInfo)
  appState.setSaved(true)

  /*checkSave showNotes */
}

function editNote(id){
  appState.setIsView(false);
  appState.setIsUpdate(true);
  editorController(true, appState.isView)

  editor.setText(notebooks[appState.selectedNotebook][id].text)
  editor.setContents(notebooks[appState.selectedNotebook][id].contents)
  title.value = notebooks[appState.selectedNotebook][id].title
}

function viewNote(id){
  appState.setIsView(true);
  editorController(true, appState.isView)

  editor.setText(notebooks[appState.selectedNotebook][id].text)
  editor.setContents(notebooks[appState.selectedNotebook][id].contents)
  title.value = notebooks[appState.selectedNotebook][id].title
}


title.addEventListener("input", checkInput);
editor.on("text-change", checkInput);

document
  .querySelector(".addNoteButtonContainer")
  .addEventListener("click", function () {
    editorController(false, true);
  });

document.querySelector(".add").addEventListener("click", addNotebook);

window.addEventListener("load", function (event) {
  showNotebooks(event.type);
});
