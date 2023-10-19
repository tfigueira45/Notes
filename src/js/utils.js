
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

const format = function (n) {
  return n < 10 ? `0${n}` : n;
};

const removeAllClass = function (forRemove, selector) {
  document.querySelectorAll(selector).forEach((element) => {
    element.classList.remove(forRemove);
  });
};

const focusInput = function(input) {
    input.disabled = false;
    input.focus();
}
  
const notebookTemplate = function (className, value) {
    return `<div class="notebookItem ${className}" data-notebook="${value}" >
          <input type="text" value="${value}" disabled/>
          <div>
            <span class="material-symbols-outlined edit">edit</span>
            <span class="material-symbols-outlined del">delete</span>
          </div>
        </div>`;
};
  