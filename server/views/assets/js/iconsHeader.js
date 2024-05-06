  // header function
function toggleMenu(id) {
  var menu = document.getElementById(id);
  var menus = document.getElementsByClassName("openMenu");
  var badge = document.querySelector(".badge-notification");
  var notificationList = document.getElementById('notificationList');// NÃO ESTÁ SENDO USADO

  if (menu.classList.contains("openMenu")) {
    menu.classList.remove("openMenu");
    badge.style.display = "none";
  } else {
    for (var i = 0; i < menus.length; i++) {
      menus[i].addEventListener("transitionend", function() {
        menu.classList.add("openMenu");
        this.removeEventListener("transitionend", arguments.callee);
      });
      menus[i].classList.remove("openMenu");
    }
    if (menus.length == 0) {
      menu.classList.add("openMenu");
    }
    badge.style.display = "none";
  }}

  

  
