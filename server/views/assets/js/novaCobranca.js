const formButton = document.querySelector('#form');

formButton.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const formObject = Object.fromEntries(formData.entries());


  try {
    const response = await fetch('/add-nova-cobrancaIndevida', {
      method: 'POST',
      body: JSON.stringify(formObject),
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = await response.text();
    console.log(result);
     window.location.href = '/listar-cobrancas';
  } catch (error) {
    console.error(error);
  }
});
