// ================================================================================
// PARTE 1: ESTADO GLOBAL E INICIALIZAÇÃO
// ================================================================================

// !!! IMPORTANTE: Substitua pela URL da sua API do Google Apps Script !!!
const API_URL = "https://script.google.com/macros/s/AKfycbz2CVXUG4MGJTh2ZKtCjPNRr63_6PX9wDhGP9wAnK_LAVxZntUM0XicfAlCEPmhb3CA/exec";

let DADOS_APP = {};
const PENDING_SUBMISSIONS_KEY = 'sigte_pending_submissions';

document.addEventListener('DOMContentLoaded', () => {
  showStatus('info', 'Carregando dados do sistema...');
  
  // MUDANÇA CRUCIAL: Usando fetch para buscar os dados iniciais
  fetch(API_URL)
    .then(res => res.json())
    .then(onDadosCarregados)
    .catch(onFalhaCarregamento);

  // O resto dos listeners permanece o mesmo
  document.getElementById('form-frequencia').addEventListener('submit', (e) => handleFormSubmit(e, 'frequencia'));
  // ... outros listeners
  window.addEventListener('online', handleConnectionChange);
  window.addEventListener('offline', handleConnectionChange);
  handleConnectionChange();
  setTimeout(sincronizarPendentes, 2000);
});

// ... (onDadosCarregados e onFalhaCarregamento permanecem os mesmos) ...

// ================================================================================
// PARTE 2: LÓGICA DE SUBMISSÃO E OFFLINE (COM FETCH)
// ================================================================================

function enviarLote(lote, form = null) {
  if (!navigator.onLine) {
    salvarParaEnvioPosterior(lote, form);
    return;
  }

  showStatus('info', `Enviando ${lote.length} registro(s)...`);

  // MUDANÇA CRUCIAL: Usando fetch para enviar os dados via POST
  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // Apps Script espera text/plain
    body: JSON.stringify(lote),
    mode: 'cors' // Necessário para requisições entre domínios
  })
  .then(res => res.json())
  .then(response => onEnvioSucesso(response, lote, form))
  .catch(error => onEnvioFalha(error, lote, form));
}

// O resto do seu JavaScript (onEnvioSucesso, onEnvioFalha, salvarParaEnvioPosterior, etc.)
// permanece exatamente o mesmo.
