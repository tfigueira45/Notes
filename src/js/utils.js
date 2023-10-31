const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

/*Formata números*/
function format(n) {
  return n < 10 ? `0${n}` : n;
}

/*Remove classes */
function removeAllClass(forRemove, selector) {
  document.querySelectorAll(selector).forEach((element) => {
    element.classList.remove(forRemove);
  });
}

/*Modelo de notebook */
function notebookTemplate(className, value) {
  return `<div class="notebookItem ${className}" data-notebook="${value}" >
        <input type="text" value="${value}" readonly/>
        <div>
          <span class="material-symbols-outlined edit">edit</span>
          <span class="material-symbols-outlined del">delete</span>
        </div>
      </div>`;
}


/*Ativa e foca o input */
function focusInput(input) {
  input.removeAttribute("readonly");
  input.focus();
}

function countUntitledNotebooks() {
  const keys = Object.keys(notebooks);
  const regex = /Sem título/;
  let counter = 0;
  keys.forEach(function (key) {
    if (regex.test(key)) {
      counter++;
    }
  });
  return counter == 0 ? "" : String(counter);
}

function notebookClickHandler(element, event) {
  let edit = element.querySelector(".edit");
  let del = element.querySelector(".del");

  const elements = [edit, del];
  if (!elements.includes(event.target)) {
    removeAllClass("selected", ".notebookItem");
    appState.setSelectedNotebook(element.dataset.notebook);
    showNotes();
  }
}

/*Salva ou edita o notebook ao click em alguma area da pagina */
function toggleInput(element, isAdd = false) {
  let input = element.querySelector("input");
  const oldValue = input.value;
  focusInput(input);

  const elements = [
    element,
    input,
    element.querySelector(".del"),
    element.querySelector(".edit"),
    document.querySelector(".add"),
  ];

  function clickHandler(event) {
    if (!elements.includes(event.target)) {
      input.setAttribute("readonly", true);
      let value =
        isAdd && !input.value
          ? `Sem título${countUntitledNotebooks()}`
          : input.value;
      if (isAdd) {
        removeAllClass("selected", ".notebookItem");
        element.dataset.notebook = value;
        notebooks.create(value);
        element.addEventListener("click", function (event) {
          notebookClickHandler(element, event);
        });
      } else {
        notebooks.edit(oldValue, value);
      }
      appState.setSelectedNotebook(value);
      localStorage.setItem("notesDB", JSON.stringify(notebooks));
      document.body.removeEventListener("click", clickHandler); // Remove the event listener
    }
  }
  document.body.addEventListener("click", clickHandler);
}

/*Adiciona ou ouvintes nos botões dos notebooks */
function addNotebookButtonsListeners() {
  document.querySelector(".del").addEventListener("click", function () {
    deleteNotebook(this.parentElement.parentElement);
  });

  document.querySelector(".edit").addEventListener("click", function () {
    editNotebook(this.parentElement.parentElement);
  });
}

/*Controla a exibição de saveButton */
function checkInput() {
  appState.setIsFilled(editor.getText() != "\n");
  appState.setIsModified(true)
  if (appState.saved) {
    appState.setSaved(false);
  }
  saveButton.classList.toggle("show", appState.isFilled && !appState.saved);
}

function checkSave() {
  if (!appState.saved && appState.isFilled && !appState.isView && !appState.isModified) {
    swal({
      title: "Tem certeza?",
      text: "Deseja sair sem salvar a anotação?",
      icon: "warning",
      buttons: {
        cancel: "Salvar",
        catch: {
          text: "Sair sem salvar",
          value: "noSave",
        },
      },
      dangerMode: true,
    }).then((value) => {
      if (value != "noSave") {
        saveButton.click();
        localStorage.setItem("notesDB", JSON.stringify(notebooks));
        showNotes();
      }
      editorController(false, false);
    });
  } else {
    localStorage.setItem("notesDB", JSON.stringify(notebooks));
    appState.setSaved(false);
    appState.setIsFilled(false);
    saveButton.classList.remove("show");
    editorController(false);
  }
}

function getNoteInfo() {
  let currentDate = new Date();
  let date = `${format(currentDate.getDate())}/${format(
    currentDate.getMonth()
  )}/${format(currentDate.getFullYear())}`;
  let hour = `${format(currentDate.getHours())}:${format(
    currentDate.getMinutes()
  )}`;

  let noteInfo = {
    title:
      title.value == ""
        ? editor.getText().trim().slice(0, 15).length <= 12
          ? editor.getText().trim().slice(0, 15)
          : editor.getText().trim().slice(0, 15) + "..."
        : title.value.trim(),
    text: editor.getText(),
    contents: editor.getContents(),
    date: date,
    hour: hour,
  };

  return noteInfo;
}
