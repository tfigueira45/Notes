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

let notebooks = JSON.parse(localStorage.getItem("notesDB") || "{}");
notebooks.__proto__ = notebooksProto;

let appState = {
  saved: false,
  isView: false,
  isUpdate: false,
  isFilled: false,
  theme: false,
  sidebar: false,
  idNote: undefined,
  selectedNotebook: Object.keys(notebooks)[0],

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
    this.selectedNotebook = notebook;
    document.querySelectorAll(".notebookItem").forEach(function (item) {
      if (item.querySelector("input").value == notebook) {
        removeAllClass("selected", ".notebookItem");
        item.classList.add("selected");
      }
    });
  },
};

function addNotebook() {
  removeAllClass("selected", ".notebookItem");
  notebooksContainer.insertAdjacentHTML(
    "afterbegin",
    notebookTemplate("selected", "")
  );
  addNotebookButtonsListeners();
  toggleInput(document.querySelector(".notebookItem"), true);
  setForStorage(JSON.stringify(notebooks));
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
      if (appState.selectedNotebook == notebook) {
        appState.setSelectedNotebook(
          document.querySelector(".notebookItem input").value
        );
      }
      notebooks.delete(notebook);
      setForStorage(JSON.stringify(notebooks));
      showNotebooks();
    }
  });
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
          event === "load" ? (i === keys.length - 1 ? "selected" : "") : "",
          key
        )
      );
      addNotebookButtonsListeners();
    }
  });
}

document.querySelectorAll('.notebookItem').forEach(function(notebook){
  notebook.addEventListener('click', function(){
    removeAllClass('selected', '.notebookItem')
    notebook.classList.add('selected')
    appState.setSelectedNotebook(notebook.dataset.notebook)
  })
})

function addNote() {
  notebooks[appState.selectedNotebook].push(getNoteInfo());
  appState.setSaved(true);
  checkSave();
  showNotes();
}

function editNote(id) {
  appState.setIsView(false);
  appState.setIsUpdate(true);
  editorController(true, appState.isView);

  editor.setText(notebooks[appState.selectedNotebook][id].text);
  editor.setContents(notebooks[appState.selectedNotebook][id].contents);
  title.value = notebooks[appState.selectedNotebook][id].title;
}

function viewNote(id) {
  appState.setIsView(true);
  editorController(true, appState.isView);

  editor.setText(notebooks[appState.selectedNotebook][id].text);
  editor.setContents(notebooks[appState.selectedNotebook][id].contents);
  title.value = notebooks[appState.selectedNotebook][id].title;
}

function updateNote(id) {
  notebooks[appState.selectedNotebook][id] = getNoteInfo();
  appState.setIsUpdate(false);
  editorController(false);
  showNotes();
}

function deleteNote(id) {
  notebooks[appState.selectedNotebook].filter(
    (i) => notebooks[appState.selectedNotebook].indexOf(i) != id
  );
  setForStorage(JSON.stringify(notebooks));
  showNotes();
}

function showNotes() {
  if (notebooks[appState.selectedNotebook].length != 0) {
    document.querySelectorAll(".note").forEach((item) => item.remove());
    notebooks[appState.selectedNotebook].forEach(function (note, id) {
      const noteTemplate = `
      <div class="note">
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
          <span class="material-symbols-outlined more" onclick="">more_horiz</span>
          <div class="menu">
            <div class="material-symbols-outlined" onclick="editNote(${id})">edit</div>
            <div class="material-symbols-outlined" onclick="deleteNote(${id})">delete</div>
          </div>
        </div>
      </div>
    `;
      notesContainer.insertAdjacentHTML("beforeend", noteTemplate);
    });
  } else {
    document
    .querySelector(".content p")
    .classList.toggle(
      "show",
      notebooks[appState.selectedNotebook].length == 0
    );
  }
  
}
showNotes();

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
  showNotebooks(event.type);
});
