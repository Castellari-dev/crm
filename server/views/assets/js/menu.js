document.addEventListener("DOMContentLoaded", function() {
    // EXPANDIR OS MENUS, E PERMITIR SOMENTE UM ABERTO POR VEZ
    var expandableItems = document.getElementsByClassName("expandable");
  
    for (var i = 0; i < expandableItems.length; i++) {
      expandableItems[i].addEventListener("click", function() {

        var isActive = this.classList.contains("active");
  
        for (var j = 0; j < expandableItems.length; j++) {
          expandableItems[j].classList.remove("active");
          var nestedList = expandableItems[j].querySelector(".nested");
          if (nestedList) {
            nestedList.classList.remove("active");
          }
        }
        if (!isActive) {
          this.classList.add("active");
          var nestedList = this.querySelector(".nested");
          if (nestedList) {
            nestedList.classList.add("active");
          }
        }
      });
    }
    // MANTER ABERTO O SUBMENU ONDE A PAGINA SE ENCONTRA
    var currentUrl = window.location.href;

    var subItems = document.querySelectorAll(".nested li a[href]");

    for (var i = 0; i < subItems.length; i++) {
      var subItemUrl = subItems[i].pathname;
      if (currentUrl.endsWith(subItemUrl)) {
        subItems[i].classList.add("active");
        subItems[i].closest(".expandable").classList.add("active");
        subItems[i].closest(".expandable").querySelector(".nested").classList.add("active");
      }
    }


  })