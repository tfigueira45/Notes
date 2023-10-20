const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
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
        <input type="text" value="${value}" disabled/>
        <div>
          <span class="material-symbols-outlined edit">edit</span>
          <span class="material-symbols-outlined del">delete</span>
        </div>
      </div>`;
}

/*Ativa e foca o input */
function focusInput(input) {
  input.disabled = false;
  input.focus();
}

/*Salva ou edita o notebook ao click em alguma area da pagina */
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
      let value = isAdd && !input.value ? "Sem título" : input.value;
      if (isAdd) {
        document.querySelector(".notebookItem").dataset.notebook = value;
        notebooks.create(value);
      } else {
        notebooks.edit(oldValue, value);
      }
      input.value = value;
    }
    localStorage.setItem("notesDB", JSON.stringify(notebooks));
  });
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

/*Controla a exibição do editor */
function editorController(isView, isClose) {
  editor.setText("");
  editor.enable(!isView);
  title.value = "";
  title.disabled = false;

  saveButton.classList.toggle("show", isView);
  saveButton.querySelector("span").innerHTML = isView ? "edit" : "save";

  popup_box.classList.toggle("show", isClose);
  editor.focus();
}

/*Exibe alertas com a lib Swal */
async function showAlert(obj) {
  return await swal(obj);
}

/*Controla a exibição de saveButton */
function checkInput() {
  appState.setIsFilled(editor.getText() != "\n");
  saveButton.classList.toggle("show", appState.isFilled);
}

function getNoteInfo(){
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

  return noteInfo
}