$(document).ready(function() {
    const $loginButton = $("#login-button");
    const $popup = $(".popup");
    const $overlay = $(".overlay");
  
    // Check if "stay connected" checkbox is checked on page load
    if ($('#checkbox').prop('checked')) {
      // Save email and password in localStorage
      const email = localStorage.getItem('email');
      const senha = localStorage.getItem('senha');
      if (email && senha) {
        $("#loginInput").val(email);
        $("#passwordInput").val(senha);
      }
    }
  
    $loginButton.click(function(event) {
      event.preventDefault();
  
      // Get email and password values
      const email = $("#loginInput").val().trim();
      const senha = $("#passwordInput").val().trim();
  
      const login = {
        email: email,
        senha: senha
      };
  
      // Send login request to the server
      $.ajax({
        url: "/auth",
        method: "POST",
        data: login
      })
      .then(response => {
        console.log(response.data);
  
        // Save email and password in localStorage if "stay connected" checkbox is checked
        if ($('#checkbox').prop('checked')) {
          localStorage.setItem('email', email);
          localStorage.setItem('senha', senha);
        } else {
          localStorage.removeItem('email');
          localStorage.removeItem('senha');
        }
  
        // Redirect to the home page if login is successful
        window.location.href = "/home";
      })
      .catch(err => {
        console.log("Error", err);
        // Show error popup and disable login button
        if (err.status === 401) {
          $(".popup p").text("O login ou senha inseridos estão incorretos");
        } else {
          $(".popup p").text("Ocorreu um erro ao fazer login, por favor tente novamente mais tarde");
        }
        $popup.show();
        $loginButton.attr('disabled', true);
        $overlay.show();
      });
    });
  
    // Close popup and enable login button when user clicks close button
    $("#closePopup").click(function(event) {
      event.preventDefault();
      $popup.hide();
      $loginButton.attr('disabled', false);
      $overlay.hide();
    });
  });
  