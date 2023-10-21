/*function changeTheme() {
  let themeStorage = localStorage.getItem('theme');

  if(themeStorage){
    document.body.classList.toggle('dark', JSON.parse(themeStorage))
  }
}*/

document.querySelector(".open").addEventListener("click", function () {
  document.body.classList.toggle("showSidebar", appState.sidebar);
  appState.setSidebar(!appState.sidebar);
});
/*
document.querySelector(".theme").addEventListener("click", changeTheme);
window.addEventListener("load", changeTheme);*/
