const notebooksContainer = document.querySelector(".notebooksContainer .items");
const notesContainer = document.querySelector(".content");
let notebookItem = document.querySelectorAll(".notebookItem");
const editorContainer = document.querySelector(".popup_box .popup .editor");
const title = document.querySelector(".title");
const span = document.querySelector(".main .currentNotebook");
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

let notebooks = JSON.parse(localStorage.getItem("notesDB") || "{}");
notebooks.__proto__ = notebooksProto;

let appState = {
  saved: false,
  isModified: false,
  isView: false,
  isUpdate: false,
  isFilled: false,
  theme: false,
  sidebar: false,
  idNote: undefined,
  selectedNotebook: Object.keys(notebooks)[Object.keys(notebooks).length - 1],

  setSaved: function (save) {
    this.saved = save;
  },
  setIsModified: function (modified) {
    this.isModified = modified;
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
  setTheme: function (theme) {
    this.theme = theme;
  },
  setSidebar: function (sidebar) {
    this.sidebar = sidebar;
  },
  setIdNote: function (id) {
    this.idNote = id;
  },
  setSelectedNotebook: function (notebook) {
    if (!(Object.keys(notebooks).length === 0)) {
      this.selectedNotebook = notebook;
      document.querySelectorAll(".notebookItem").forEach(function (item) {
        if (item.dataset.notebook === notebook) {
          item.classList.add("selected");
          span.textContent = appState.selectedNotebook;
        }
      });
    } else {
      span.textContent = "";
    }
  },
};

function addNotebook() {
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
  swal({
    title: "Tem certeza?",
    text: `Deseja deletar ${notebook}?`,
    icon: "warning",
    buttons: {
      cancel: "Não",
      catch: {
        text: "Deletar",
        value: "delete",
      },
    },
    dangerMode: true,
  }).then(function (value) {
    if (value === "delete") {
      const oldSelected = appState.selectedNotebook;
      notebooks.delete(notebook);
      if (!Object.keys(notebooks).length == 0) {
        if (oldSelected === notebook) {
          removeAllClass("selected", ".notebookItem");
          appState.setSelectedNotebook(
            document.querySelectorAll(".notebookItem input")[0].value
          );
        }
      }else{
        appState.setSelectedNotebook(null)
      }
      showNotebooks();
      localStorage.setItem("notesDB", JSON.stringify(notebooks));
    }
  });
}

function showNotebooks(event) {
  const keys = Object.keys(notebooks);
  document.querySelectorAll(".notebookItem").forEach((item) => item.remove());
  keys.forEach(function (key, i) {
    if (keys.length > 0) {
      notebooksContainer.insertAdjacentHTML(
        "afterbegin",
        notebookTemplate(
          event === "load"
            ? i === keys.length - 1
              ? "selected"
              : ""
            : key === appState.selectedNotebook
            ? "selected"
            : "",
          key
        )
      );
      addNotebookButtonsListeners();
    }
  });
  document.querySelectorAll(".notebookItem").forEach(function (notebook) {
    notebook.addEventListener("click", function (event) {
      notebookClickHandler(notebook, event);
    });
  });
}

function addNote() {
  notebooks[appState.selectedNotebook].push(getNoteInfo());
  appState.setSaved(true);
  checkSave();
  showNotes();
}

function editNote(id) {
  appState.setIsView(false);
  appState.setIsUpdate(true);
  appState.setSaved(true);
  editorController(appState.isView, true, id);
  setDataEditor(id);
}

function viewNote(id) {
  appState.setIsView(true);
  editorController(true, appState.isView);
  setDataEditor(id);
}

function updateNote(id) {
  notebooks[appState.selectedNotebook][id] = getNoteInfo();
  appState.setIsUpdate(false);
  editorController(false);
  showNotes();
}

function deleteNote(id) {
  notebooks[appState.selectedNotebook].pop(
    notebooks[appState.selectedNotebook][id]
  );
  localStorage.setItem("notesDB", JSON.stringify(notebooks));
  showNotes();
}

function showNotes() {
  if (
    notebooks[appState.selectedNotebook] &&
    notebooks[appState.selectedNotebook].length > 0
  ) {
    document.querySelectorAll(".note").forEach((item) => item.remove());
    notebooks[appState.selectedNotebook].forEach(function (note, id) {
      const noteTemplate = `
      <div class="note" onclick>
        <head>
          <span class="noteTitle">${note.title}</span>
        </head>
        <div class="noteContent">${note.text}</div>
        <div class="line"></div>
        <footer>
          <span class="date">${note.date}</span>
          <span class="hour">${note.hour}</span>
        </footer>
        <div class="settings">
          <span class="material-symbols-outlined more" onclick="showMenu(this)">more_horiz</span>
          <div class="menu">
            <div class="material-symbols-outlined ed" onclick="editNote(${id})">edit</div>
            <div class="material-symbols-outlined delete" onclick="deleteNote(${id})">delete</div>
          </div>
        </div>
      </div>
    `;
      notesContainer.insertAdjacentHTML("beforeend", noteTemplate);
    });
  } else if (
    !notebooks[appState.selectedNotebook] ||
    notebooks[appState.selectedNotebook].length == 0
  ) {
    document.querySelectorAll(".note").forEach((item) => item.remove());
  }

  notesContainer
    .querySelector("p")
    .classList.toggle(
      "show",
      !notebooks[appState.selectedNotebook] ||
        notebooks[appState.selectedNotebook].length == 0
    );

  document.querySelectorAll(".note").forEach(function (item) {
    let arr = Array.from(document.querySelectorAll(".note"));
    item.addEventListener("click", function (e) {
      if (e.target == item || e.target.parentElement == item) {
        viewNote(arr.indexOf(item));
        appState.setIdNote(arr.indexOf(item));
      }
    });
  });
}
showNotes();

function showMenu(elem) {
  const settings = elem.parentElement;
  settings.classList.add("show");
  document.addEventListener("click", (e) => {
    if (
      e.target != elem &&
      e.target != settings.querySelector("more") &&
      e.target != settings.querySelector(".menu")
    ) {
      elem.parentElement.classList.remove("show");
    }
  });
}

title.addEventListener("input", checkInput);
editor.on("text-change", checkInput);

document
  .querySelector(".addNoteButtonContainer")
  .addEventListener("click", function () {
    if (Object.keys(notebooks).length == 0) {
      swal(
        "Crie um caderno",
        "Não é possivel criar notas, porque não há nenhum caderno",
        "error"
      );
    } else {
      editorController(false, true);
    }
  });

document.querySelector(".add").addEventListener("click", addNotebook);
document.querySelector(".close").addEventListener("click", checkSave);

saveButton.addEventListener("click", function () {
  if (!appState.isView && !appState.isUpdate) {
    addNote();
  } else if (!appState.isView && appState.isUpdate) {
    updateNote(appState.idNote);
  } else {
    editorController(false);
    editNote(appState.idNote);
  }
});

window.addEventListener("load", function (event) {
  showNotebooks(event.type, true);
});
