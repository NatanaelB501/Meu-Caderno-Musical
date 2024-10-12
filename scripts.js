// Dados de exemplo para músicas
let musicas = JSON.parse(localStorage.getItem('musicas')) || [
    { id: 1, titulo: 'musica a', autor: 'autor a', cifra: 'C G Am F' },
    { id: 2, titulo: 'musica b', autor: 'autor b', cifra: 'D A Bm G' },
    { id: 3, titulo: 'musica c', autor: 'autor c', cifra: 'E B C#m A' }
];

let repertorios = [];

// Função para criar um repertório
document.getElementById('create-repertory').addEventListener('click', function() {
    const repertoryName = document.getElementById('repertory-name').value;
    if (repertoryName) {
        repertorios.push({ nome: repertoryName, musicas: [] });
        document.getElementById('repertory-name').value = '';
        updateRepertoryList();
    }
});

// Função para atualizar a lista de repertórios
function updateRepertoryList() {
    const repertoryList = document.getElementById('repertory-list');
    repertoryList.innerHTML = '';

    repertorios.forEach((repertorio, index) => {
        const div = document.createElement('div');
        div.innerHTML = `
            <a href="repertorio.html?index=${index}">${repertorio.nome}</a>
            <button onclick="deleteRepertory(${index})">-</button>
            <button onclick="addMusic(${index}, event)">+</button>
            <button onclick="editRepertory(${index})">✏️</button>
        `;
        repertoryList.appendChild(div);
    });

    // Salvar repertórios no localStorage
    
    localStorage.setItem('repertorios', JSON.stringify(repertorios));
    
}

// Ao carregar a página, recupere os repertórios do localStorage
document.addEventListener('DOMContentLoaded', function() {
    const storedRepertorios = localStorage.getItem('repertorios');
    if (storedRepertorios) {
        repertorios = JSON.parse(storedRepertorios);
    }
    updateRepertoryList();
    updateMusicList(); // Atualiza a lista de músicas
});

// Função para deletar um repertório
function deleteRepertory(index) {
    repertorios.splice(index, 1);
    updateRepertoryList();
}

function addMusic(index, event) {
    const repertorio = repertorios[index];
    const musicName = prompt("Digite o nome da música que deseja adicionar:");

    if (musicName) {
        const lowerCaseMusicName = musicName.toLowerCase();
        const foundMusic = musicas.find(musica => musica.titulo.toLowerCase() === lowerCaseMusicName);

        console.log("Música encontrada:", foundMusic); // Verifica se a música foi encontrada
        console.log("Todas as músicas:", musicas); // Lista todas as músicas no console

        if (foundMusic) {
            repertorio.musicas.push(foundMusic);
            updateRepertoryList();
        } else {
            alert("Música não encontrada. Verifique o nome digitado.");
        }
    }
}


// Função para editar um repertório
function editRepertory(index) {
    const newName = prompt('Novo nome do repertório:', repertorios[index].nome);
    if (newName) {
        repertorios[index].nome = newName;
        updateRepertoryList();
    }
}

// Exibir a cifra da primeira música ao carregar
document.addEventListener('DOMContentLoaded', function() {
    if (musicas.length > 0) {
        displayMusic(musicas[0]);
    }
});

// Função para colorir as cifras no conteúdo da música
function highlightCifras(content) {
    // Expressão regular ajustada para capturar cifras corretamente, incluindo o '#'
    const cifraRegex = /(?<!\w)([A-G](?:#|b)?(?:m|sus|dim|aug|\d*)?)(?!\w)/g;
    return content.replace(cifraRegex, function(match) {
        return `<span class="cifra">${match}</span>`;
    });
}


// Função para exibir a música selecionada e permitir edição
function displayMusic(musica, isEditing = false) {
    const musicDisplay = document.getElementById('music-display');

    console.log('Musica recebida:', musica); // Log para verificar a música recebida

    if (isEditing) {
        // Modo de edição
        musicDisplay.innerHTML = `
            <input type="text" id="edit-title" value="${musica.titulo || ''}">
            <input type="text" id="edit-autor" value="${musica.autor || ''}">
            <textarea id="edit-cifra">${musica.cifra || ''}</textarea>
            <button id="save-changes">Salvar</button>
        `;

        const saveButton = document.getElementById('save-changes');
        saveButton.removeEventListener('click', saveChanges);

        // Salvando alterações
        saveButton.addEventListener('click', function() {
            saveChanges(musica);
        });
    } else {
        // Verifica se as propriedades existem antes de exibir
        if (musica && musica.titulo && musica.cifra) {
            // Aplica o destaque nas cifras antes de exibir
            const highlightedCifra = highlightCifras(musica.cifra);

            // Exibição da música com cifras coloridas
            musicDisplay.innerHTML = `
                <h2>${musica.titulo}</h2>
                <h3>${musica.autor}</h3>
                <pre>${highlightedCifra}</pre>
                <button onclick="editMusic(${musicas.indexOf(musica)})">Editar</button>
            `;
        } else {
            musicDisplay.innerHTML = `<p>Música não encontrada ou com propriedades faltando.</p>`;
            console.error("Música não encontrada ou com propriedades faltando:", musica); // Log detalhado
        }
    }
}




// Função para atualizar a lista de músicas
function updateMusicList(filteredMusicas = musicas) {
    const musicList = document.getElementById('music-list');
    musicList.innerHTML = '';

    filteredMusicas.forEach((musica, index) => {
        const div = document.createElement('div');
        div.classList.add('music-item'); // Adiciona a classe music-item ao contêiner
        
        div.innerHTML = `
            <h3 class="music-title">${musica.titulo}</h3>
            <button class="delete-btn" onclick="deleteMusic(${index})">
                <i class="fas fa-trash-alt"></i> <!-- Ícone de lixeira -->
            </button>
        `;

        // Adiciona o evento de clique para exibir a música
        div.addEventListener('click', function() {
            displayMusic(musica);
        });

        musicList.appendChild(div);
    });
}


// Função para deletar música
function deleteMusic(index) {
    const userResponse = confirm('Deseja realmente excluir essa música?');

    if (userResponse) {
        musicas.splice(index, 1);
    updateMusicList();
    localStorage.setItem('musicas', JSON.stringify(musicas)); // Salva mudanças no localStorage
    } else {

    } 
}

// Função para adicionar uma nova música
function addNewMusic() {
    const titleInput = document.getElementById('new-music-title');
    const autorInput = document.getElementById('new-music-autor');
    const cifraInput = document.getElementById('new-music-cifra');
    

    const newTitle = titleInput.value.trim();
    const newAutor = autorInput.value.trim();
    const newCifra = cifraInput.value.trim();

    if (newTitle && newCifra) {
        const newMusic = {
            titulo: newTitle,
            autor: newAutor,
            cifra: newCifra,
            data: new Date() // Adiciona a data atual como a data de criação (mesmo que não será exibida)
        };

        // Adiciona nova música ao array
        musicas.push(newMusic);

        // Salva músicas atualizadas no localStorage
        localStorage.setItem('musicas', JSON.stringify(musicas));

        // Limpa os campos
        titleInput.value = '';
        autorInput.value = '';
        cifraInput.value = '';

        updateMusicList(); // Atualiza a lista de músicas na página
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

// Função para ordenar músicas por título
function sortByTitle() {
    const sortedMusicas = [...musicas].sort((a, b) => a.titulo.localeCompare(b.titulo));
    updateMusicList(sortedMusicas);
}

// Função para ordenar músicas por data (mais recentes primeiro)
function sortByDate() {
    const sortedMusicas = [...musicas].sort((a, b) => new Date(b.data) - new Date(a.data));
    updateMusicList(sortedMusicas);
}

// Adiciona evento aos botões de ordenação
document.getElementById('sort-title').addEventListener('click', sortByTitle);
document.getElementById('sort-date').addEventListener('click', sortByDate);

// Função para atualizar a lista de músicas (sem exibir a data)
function updateMusicList(filteredMusicas = musicas) {
    const musicList = document.getElementById('music-list');
    musicList.innerHTML = '';

    filteredMusicas.forEach((musica, index) => {
        const div = document.createElement('div');
        div.classList.add('music-item');

        div.innerHTML = `
            <h3 class="music-title">${musica.titulo}</h3>
            <button class="delete-btn" onclick="deleteMusic(${index})">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;

        div.addEventListener('click', function () {
            displayMusic(musica);
        });

        musicList.appendChild(div);
    });
}


// Adiciona evento ao botão de adicionar música
document.getElementById('add-music-button').addEventListener('click', addNewMusic);

// Função para editar uma música
function editMusic(index) {
    const musica = musicas[index];
    displayMusic(musica, true); // Ativa o modo de edição
}

// Função para salvar mudanças
function saveChanges(musica) {
    const newTitle = document.getElementById('edit-title').value;
    const newAutor = document.getElementById('edit-autor').value; // Corrigido aqui
    const newCifra = document.getElementById('edit-cifra').value;

    if (newTitle && newCifra) {
        musica.titulo = newTitle;
        musica.autor = newAutor;
        musica.cifra = newCifra;
        updateMusicList();
        displayMusic(musica); // Volta a exibir a música com as mudanças

        // Atualiza músicas no localStorage
        localStorage.setItem('musicas', JSON.stringify(musicas));

        alert('Música editada com sucesso!');
    } else {
        alert('Por favor, preencha todos os campos necessários.'); // Adicionando um alerta caso campos estejam vazios
    }
}


// Adiciona evento ao campo de busca
document.getElementById('search-bar').addEventListener('input', searchMusic);

function searchMusic() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const filteredMusicas = musicas.filter(musica => musica.titulo.toLowerCase().includes(searchTerm));
    
    // Atualiza a lista de músicas com o resultado da busca
    updateMusicList(filteredMusicas);
}


function salvarMusicas() {
    // Obter as músicas do localStorage ou do array que você usa para armazenar as músicas
    let listaDeMusicas = JSON.parse(localStorage.getItem('musicas')) || [];
  
    // Converter as músicas para JSON
    let jsonMusicas = JSON.stringify(listaDeMusicas, null, 2);
  
    // Criar um blob com o conteúdo JSON
    let blob = new Blob([jsonMusicas], { type: 'application/json' });
  
    // Criar um link temporário para download
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'musicas.json';
  
    // Simular um clique no link para iniciar o download
    link.click();
  }
 
  function carregarMusicas() {
    let input = document.getElementById('file-input');
    let file = input.files[0];
  
    if (file) {
      let reader = new FileReader();
      reader.onload = function(e) {
        try {
          // Tentar carregar o arquivo JSON
          let musicasCarregadas = JSON.parse(e.target.result);
  
          // Verificar se é um array válido de músicas
          if (Array.isArray(musicasCarregadas)) {
            // Salvar no localStorage ou no array de músicas
            localStorage.setItem('musicas', JSON.stringify(musicasCarregadas));
  
            // Atualizar a lista de músicas na interface (chame sua função de exibir músicas)
            exibirMusicas();
          } else {
            alert("Arquivo inválido. Certifique-se de que está carregando um arquivo de músicas.");
          }
        } catch (error) {
          alert("Erro ao ler o arquivo: " + error.message);
        }
      };
  
      // Ler o arquivo como texto
      reader.readAsText(file);
    }
  }
  