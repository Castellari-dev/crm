const formButton = document.querySelector('#form');

formButton.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const formObject = Object.fromEntries(formData.entries());


  try {
    const response = await fetch('/add-nova-uc', {
      method: 'POST',
      body: JSON.stringify(formObject),
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = await response.text();
    console.log(result);
     window.location.href = '/listar-unidades-consumidoras';
  } catch (error) {
    console.error(error);
  }
});