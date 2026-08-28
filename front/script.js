// URL base da sua API. Centralizei numa constante
// pra não ficar repetindo "http://localhost:3000" em todo fetch.
const API_URL = 'http://localhost:3000';

// Pega referências dos elementos do HTML que a gente vai manipular.
// getElementById busca pelo atributo id="..." que definimos no HTML.
const form = document.getElementById('formCadastro');
const lista = document.getElementById('listaUsuarios');

// Função que busca os usuários na API e desenha eles na tela.
// "async" porque usa "await" dentro.
async function carregarUsuarios() {
  try {
    // fetch faz a requisição HTTP. Por padrão, fetch faz GET.
    const resposta = await fetch(`${API_URL}/usuarios`);

    // resposta.json() converte o corpo da resposta (que é texto/JSON)
    // num array/objeto JavaScript de verdade que a gente consegue usar.
    // Também é assíncrono, por isso o segundo "await".
    const usuarios = await resposta.json();

    // Limpa a lista atual antes de redesenhar,
    // senão ia duplicar os itens toda vez que chamar essa função.
    lista.innerHTML = '';

    // Pra cada usuário retornado pela API, cria um <li> e adiciona na <ul>.
    usuarios.forEach(u => {
      const item = document.createElement('li'); // cria o elemento <li> na memória
      item.textContent = `${u.id_usuario} - ${u.nome} (${u.login})`;
      // textContent (não innerHTML) por segurança: evita que texto
      // vindo do banco seja interpretado como HTML/script.
      lista.appendChild(item); // efetivamente insere o <li> dentro da <ul>
    });

  } catch (erro) {
    // Se der erro de rede (API fora do ar, por exemplo), cai aqui.
    console.error('Erro ao carregar usuários:', erro);
  }
}

// Escuta o evento "submit" do formulário (quando clica em "Cadastrar"
// ou aperta Enter dentro de um input do form).
form.addEventListener('submit', async (e) => {

  // Por padrão, ao dar submit num form, o navegador RECARREGA a página
  // (comportamento antigo, de quando não existia JS/fetch).
  // preventDefault() cancela esse recarregamento, pra gente controlar
  // manualmente o envio via fetch.
  e.preventDefault();

  // Pega o valor digitado em cada input, usando o "id" de cada um.
  const nome = document.getElementById('nome').value;
  const login = document.getElementById('login').value;
  const senha = document.getElementById('senha').value;

  try {
    // Aqui o fetch já não é GET (o padrão), então precisamos configurar:
    const resposta = await fetch(`${API_URL}/usuarios`, {
      method: 'POST', // método HTTP: estamos criando um novo usuário

      headers: {
        // Avisa a API que o corpo da requisição está em formato JSON.
        // Isso é o que faz o "express.json()" no backend conseguir
        // ler o req.body corretamente.
        'Content-Type': 'application/json'
      },

      // O corpo da requisição precisa ser TEXTO (string), não objeto.
      // JSON.stringify converte o objeto JS { nome, login, senha }
      // em uma string JSON, tipo: '{"nome":"João","login":"joao","senha":"123"}'
      body: JSON.stringify({ nome, login, senha })
    });

    // resposta.ok é "true" se o status HTTP for 200-299 (sucesso).
    // Se for 400, 500, etc, resposta.ok vem "false".
    if (!resposta.ok) {
      // Mesmo em erro, a API manda um JSON tipo { erro: "..." }
      // então convertemos pra pegar essa mensagem.
      const erroData = await resposta.json();
      alert(erroData.erro || 'Erro ao cadastrar');
      return; // para a função aqui, não continua pro resto
    }

    // Se chegou aqui, deu tudo certo:
    form.reset();         // limpa os campos do formulário
    carregarUsuarios();   // busca a lista atualizada (agora com o novo usuário)

  } catch (erro) {
    // Erro de rede (ex: servidor desligado)
    console.error('Erro ao cadastrar:', erro);
  }
});

// Essa linha roda IMEDIATAMENTE quando o script.js é carregado,
// ou seja, assim que a página abre — pra já mostrar a lista de usuários
// sem precisar esperar nenhuma ação do usuário.
carregarUsuarios();