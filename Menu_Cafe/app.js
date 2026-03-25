
const adminUser = "admin";
const adminPass = "cafe2026";

let menuData = [];

const loginSection = document.getElementById("login-section");
const menuSection = document.getElementById("menu-section");
const loginBtn = document.getElementById("login-btn");
const loginError = document.getElementById("login-error");
const menuContainer = document.getElementById("menu-container");
const editMenuBtn = document.getElementById("edit-menu-btn");
const editor = document.getElementById("editor");
const menuEditor = document.getElementById("menu-editor");
const saveMenuBtn = document.getElementById("save-menu-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const editorMessage = document.getElementById("editor-message");


function buildMenu(menu) {
  menuContainer.innerHTML = "";
  const ul = document.createElement("ul");
  menu.forEach(item => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.textContent = item.title;
    a.href = item.link || "#";
    li.appendChild(a);

    if (item.subitems && item.subitems.length > 0) {
      const subUl = document.createElement("ul");
      item.subitems.forEach(subitem => {
        const subLi = document.createElement("li");
        const subA = document.createElement("a");
        subA.textContent = subitem.title;
        subA.href = subitem.link || "#";
        subLi.appendChild(subA);
        subUl.appendChild(subLi);
      });
      li.appendChild(subUl);
    }
    ul.appendChild(li);
  });
  menuContainer.appendChild(ul);
}


function loadMenu() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'menu.json', true);
  xhr.responseType = 'json';
  
  xhr.onload = function() {
    if (xhr.status === 200) {
      menuData = xhr.response;
      buildMenu(menuData);
    } else {
      menuContainer.textContent = "Error cargando menú (estado: " + xhr.status + ")";
      console.error("Error HTTP:", xhr.status);
    }
  };
  
  xhr.onerror = function() {
    menuContainer.textContent = "Error cargando menú. Verifica que menu.json esté en el mismo directorio.";
    console.error("Error en carga de menu.json");
  };
  
  xhr.send();
}


loginBtn.addEventListener("click", () => {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  if (user === adminUser && pass === adminPass) {
    loginSection.style.display = "none";
    menuSection.style.display = "block";
    loadMenu();
  } else {
    loginError.textContent = "Usuario o contraseña incorrectos";
  }
});


editMenuBtn.addEventListener("click", () => {
  menuEditor.value = JSON.stringify(menuData, null, 2);
  editor.style.display = "block";
  editorMessage.textContent = "";
});


saveMenuBtn.addEventListener("click", () => {
  try {
    const newMenu = JSON.parse(menuEditor.value);
    menuData = newMenu;
    buildMenu(menuData);
    editorMessage.style.color = "green";
    editorMessage.textContent = "Menú actualizado correctamente (cambios en memoria).";
    editor.style.display = "none";
  } catch (e) {
    editorMessage.style.color = "red";
    editorMessage.textContent = "Error en formato JSON: " + e.message;
  }
});

cancelEditBtn.addEventListener("click", () => {
  editor.style.display = "none";
  editorMessage.textContent = "";
});
