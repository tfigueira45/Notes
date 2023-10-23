function changeTheme() {
  let themeStorage = localStorage.getItem('theme');

  if(themeStorage){
    document.body.classList.toggle('dark', JSON.parse(themeStorage))
  } else {
    document.body.classList.toggle('dark', !appState.theme)
    appState.setTheme(!appState.theme)
  }
}

function showDateAndMessage() {
  const p = document.querySelector('.main p');
  const h1 = document.querySelector('.main h1');

  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const hour = date.getHours();

  p.textContent = `${day} de ${months[month - 1]} de ${year}`;

  const greetingMessage = hour < 7 && hour <= 11 ? "Bom dia!" : hour < 11 && hour <= 18 ? "Boa tarde" : "Boa noite"

  h1.textContent = greetingMessage;

  span.textContent = appState.selectedNotebook
}
showDateAndMessage()

document.querySelector(".open").addEventListener("click", function () {
  document.body.classList.toggle("showSidebar", !appState.sidebar);
  appState.setSidebar(!appState.sidebar);
});

document.querySelector(".theme").addEventListener("click", changeTheme);
window.addEventListener("load", changeTheme);
