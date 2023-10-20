import "./utils.js";
import "./editor.js";

const notebooksContainer = document.querySelector(".notebooksContainer .items");
const notesContainer = document.querySelector(".content");
const notebookItem = document.querySelectorAll(".notebookItem");
const editorContainer = document.querySelector(".popup_box .popup .editor");

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

const notebooks = JSON.parse(localStorage.getItem("notesDB") || "{}");
notebooks.__proto__ = notebooksProto;

function toggleInput(element, isAdd = false) {
  const oldValue = element.querySelector("input").value;
  focusInput(element.querySelector("input"));

  let input = element.querySelector("input");
  const elements = [
    input,
    input.parentElement,
    document.querySelector(".add"),
    document.querySelector(".edit"),
  ];

  document.body.addEventListener("click", function (event) {
    if (!elements.includes(event.target)) {
      element.querySelector("input").disabled = true;
      let value = isAdd && input.value == "" ? "Sem título" : input.value;
      if (isAdd) {
        document.querySelector(".notebookItem").dataset.notebook = value;
        notebooks.create(value);
      } else {
        notebooks.edit(oldValue, value);
      }
    }
    localStorage.setItem("notesDB", JSON.stringify(notebooks));
  });
}

function addNotebookButtonsListeners(){
  document.querySelector(".del").addEventListener("click", function () {
    deleteNotebook(this.parentElement.parentElement);
  });
  
  document.querySelector(".edit").addEventListener("click", function () {
    editNotebook(this.parentElement.parentElement);
  });
}

function addNotebook() {
  removeAllClass("selected", ".notebookItem");
  notebooksContainer.insertAdjacentHTML(
    "afterbegin",
    notebookTemplate("selected", "")
  );
  addNotebookButtonsListeners()
  toggleInput(document.querySelector(".notebookItem"), true);
  localStorage.setItem("notesDB", JSON.stringify(notebooks));
}

function editNotebook(element) {
  toggleInput(element);
}

function deleteNotebook(element) {
  const notebook = element.dataset.notebook;
  const confirm = window.confirm(`Deseja mesmo deletar ${notebook}`);
  if (confirm) {
    notebooks.delete(notebook);
    localStorage.setItem("notesDB", JSON.stringify(notebooks));
    showNotebooks();
  }
}

function showNotebooks() {
  const keys = Object.keys(notebooks);
  notebooksContainer.innerHTML = '';
  keys.forEach(function (key, i) {
    if(keys.length > 0){
      notebooksContainer.insertAdjacentHTML(
        "afterbegin",
        notebookTemplate("", key)
      );
      addNotebookButtonsListeners()
    }
  });
}
showNotebooks();

document.querySelector(".add").addEventListener("click", addNotebook);
