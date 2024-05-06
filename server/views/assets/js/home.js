document.addEventListener('DOMContentLoaded', async () => {
  fetch('/dashboard')
  .then(response => response.json())
  .then(data => {
    document.getElementById('cliente').textContent = data.cliente;
    document.getElementById('UC').textContent = data.UC;
    document.getElementById('refaturamento').textContent = data.refaturamento;
    document.getElementById('ajustes').textContent = data.ajustes;
    document.getElementById('analise').textContent = data.analise;
    document.getElementById('cobrancaindevida').textContent = data.cobrancaindevida;
  });
});
