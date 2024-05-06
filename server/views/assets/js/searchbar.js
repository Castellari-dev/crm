 // ESSA FUNÇÃO NÃO ESTÁ SENDO CHAMADA EM LUGAR NENHUM, É SÓ UM BACKUP. ELA ESTÁ EM CADA LISTAR.
 const searchInput = document.querySelector('.sbx-custom__input');
 console.log(searchInput);
 // Get the table body element
 const tableBody = document.querySelector('.tbody');
 console.log(tableBody);
 // Add an event listener to the search input
 searchInput.addEventListener('input', () => {
   // Get the search query
   const searchQuery = searchInput.value.trim().toLowerCase();
 
   // Loop through each row of the table
   for (const row of tableBody.rows) {
     // Get the content of the "Cliente" column in the current row
     const cliente = row.querySelector('[data-field="nome"]').textContent.toLowerCase();
     console.log(cliente);
     // If the search query is found in the "Cliente" column, show the row
     if (cliente.includes(searchQuery)) {
       row.style.display = '';
     } else {
       // Otherwise, hide the row
       row.style.display = 'none';
     }
   }
 });