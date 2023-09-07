window.addEventListener('load', preencherDropdown);

// Adicione um ouvinte de evento "change" ao dropdown de pratos para chamar a função consultarPrato quando um prato é selecionado
document.getElementById('prato-dropdown').addEventListener('change', consultarPrato);

// Função para exibir os campos de resultado quando o botão "Buscar" for clicado
function consultarCliente() {
    const telefone = document.getElementById('telefone').value;
    const resultDiv = document.getElementById('result');

    // Tornar os campos de resultado visíveis
    resultDiv.style.display = 'block';

    // Verificar se o campo de telefone está vazio
    if (telefone === "") {
        // Se estiver vazio, configure os campos para terem valores vazios
        configurarCamposVazios();
        return;
    }

    // Realizar a solicitação AJAX para o endpoint localhost:8080/cliente
    fetch(`http://localhost:8080/cliente/${telefone}`)
        .then(response => response.json())
        .then(data => {
            // Verificar se o retorno está vazio
            if (Object.keys(data).length === 0) {
                // Se estiver vazio, configure os campos para terem valores vazios
                configurarCamposVazios();
            } else {
                // Preencher os campos com os dados do retorno
                document.getElementById('nome').value = data.nome || "";
                document.getElementById('logradouro').value = data.endereco.logradouro || "";
                document.getElementById('bairro').value = data.endereco.bairro || "";
                document.getElementById('numero').value = data.endereco.numero || "";
                document.getElementById('complemento').value = data.endereco.complemento || "";
            }
        })
        .catch(error => {
            console.error('Ocorreu um erro ao buscar o cliente:', error);
            // Em caso de erro, configure os campos para terem valores vazios
            configurarCamposVazios();
        });
}

function configurarCamposVazios() {
    // Configurar os campos para terem valores vazios
    document.getElementById('nome').value = "Usuário não cadastrado. Informe o nome";
    document.getElementById('logradouro').value = "Informe o Logradouro";
    document.getElementById('bairro').value = "Informe o Bairro";
    document.getElementById('numero').value = "Informe o numero";
    document.getElementById('complemento').value = "Informe o complemento";
}

function preencherDropdown() {
    const pratoDropdown = document.getElementById('prato-dropdown');
    
    // Realizar a solicitação AJAX para o endpoint localhost:8080/prato
    fetch('http://localhost:8080/prato')
        .then(response => response.json())
        .then(data => {
            // Preencher o dropdown com os nomes dos pratos
            data.forEach(prato => {
                const option = document.createElement('option');
                option.value = prato.nome;
                option.textContent = prato.nome;
                pratoDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Ocorreu um erro ao buscar os pratos:', error);
        });
}


// Função para preencher os detalhes do prato quando um prato é selecionado
function consultarPrato() {
    const pratoSelecionado = document.getElementById('prato-dropdown').value;
    const pratoDetalhesDiv = document.getElementById('prato-detalhes');

    // Verificar se um prato foi selecionado
    if (!pratoSelecionado) {
        // Se nenhum prato for selecionado, ocultar os detalhes
        pratoDetalhesDiv.style.display = 'none';
        return;
    }

    // Realizar a solicitação AJAX para o endpoint localhost:8080/prato/{nome_selecionado_aqui}
    fetch(`http://localhost:8080/prato/${pratoSelecionado}`)
        .then(response => response.json())
        .then(data => {
            // Verificar se o retorno está vazio
            if (Object.keys(data).length === 0) {
                // Se estiver vazio, ocultar os detalhes
                pratoDetalhesDiv.style.display = 'none';
            } else {
                // Preencher os campos de detalhes do prato
                document.getElementById('prato-nome').textContent = data.nome || "";
                document.getElementById('prato-preco').textContent = `R$: ${data.preco.toFixed(2)}` || "";
                document.getElementById('prato-descricao').textContent = data.descricao || "";
                // Exibir os detalhes do prato
                pratoDetalhesDiv.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Ocorreu um erro ao buscar o prato:', error);
            // Em caso de erro, ocultar os detalhes
            pratoDetalhesDiv.style.display = 'none';
        });
}

// Função para verificar se ambos os campos estão preenchidos e mostrar o botão "Fazer Pedido"
function verificarCamposPreenchidos() {
    const telefone = document.getElementById('telefone').value;
    const pratoSelecionado = document.getElementById('prato-dropdown').value;
    const botaoFazerPedido = document.getElementById('fazer-pedido');

    if (telefone !== "" && pratoSelecionado !== "") {
        // Ambos os campos estão preenchidos, então mostramos o botão "Fazer Pedido"
        botaoFazerPedido.style.display = 'block';
    } else {
        // Um ou ambos os campos estão vazios, então ocultamos o botão "Fazer Pedido"
        botaoFazerPedido.classList.add('hidden');
    }
}

// Adicione um ouvinte de clique ao botão "Buscar" para verificar os campos
document.getElementById('buscar-cliente').addEventListener('click', verificarCamposPreenchidos);

// Adicione um ouvinte de alteração ao dropdown de pratos para verificar os campos
document.getElementById('prato-dropdown').addEventListener('change', verificarCamposPreenchidos);

function fazerPedido() {
    // Obtenha os valores dos campos do formulário
    const telefone = document.getElementById('telefone').value;
    const nome = document.getElementById('nome').value;
    const logradouro = document.getElementById('logradouro').value;
    const bairro = document.getElementById('bairro').value;
    const numero = document.getElementById('numero').value;
    const complemento = document.getElementById('complemento').value;

    // Crie um objeto JSON com os dados do formulário
    const data = {
        telefone,
        nome,
        endereco: {
            logradouro,
            bairro,
            numero,
            complemento
        }
    };

    // Faça a solicitação POST usando a função fetch
    fetch('http://localhost:8080/cliente', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        // Processar a resposta do servidor, se necessário
        console.log('Resposta do servidor:', data);
        preencherNotaFiscal();

        window.print();
    })
    .catch(error => {
        console.error('Ocorreu um erro ao fazer o pedido:', error);
    });
}

function preencherNotaFiscal() {
    // Obtenha os valores do formulário
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const logradouro = document.getElementById('logradouro').value;
    const numero = document.getElementById('numero').value;
    const complemento = document.getElementById('complemento').value;
    const bairro = document.getElementById('bairro').value;

    // Preencha os campos da nota fiscal
    document.getElementById('imprimir-nome').textContent = nome;
    document.getElementById('imprimir-telefone').textContent = telefone;
    document.getElementById('imprimir-logradouro').textContent = logradouro;
    document.getElementById('imprimir-numero').textContent = numero;
    document.getElementById('imprimir-complemento').textContent = complemento;
    document.getElementById('imprimir-bairro').textContent = bairro;

    const pratoSelecionado = document.getElementById('prato-dropdown').value;
    const pratoNome = document.getElementById('prato-nome').textContent;
    const pratoPreco = document.getElementById('prato-preco').textContent;
    const pratoDescricao = document.getElementById('prato-descricao').textContent;

    // Preencha os campos da nota fiscal com os detalhes do prato
    document.getElementById('imprimir-prato-nome').textContent = pratoNome;
    document.getElementById('imprimir-prato-preco').textContent = pratoPreco;
    document.getElementById('imprimir-prato-descricao').textContent = pratoDescricao;

    // Obtenha o valor do campo de observação
    const observacao = document.getElementById('observacao').value;

    // Preencha o campo de observação na nota fiscal
    document.getElementById('imprimir-observacao').textContent = observacao;
    
}