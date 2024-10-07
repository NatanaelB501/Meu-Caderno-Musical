// Função para filtrar músicas
function filterMusic() {
    const searchBar = document.getElementById('search-bar');
    const filter = searchBar.value.toLowerCase();
    const musicList = document.getElementById('music-list');
    const musicItems = musicList.getElementsByTagName('div');

    for (let i = 0; i < musicItems.length; i++) {
        const musicItem = musicItems[i];
        const title = musicItem.innerText.toLowerCase();

        if (title.includes(filter)) {
            musicItem.style.display = ''; // Mostra o item
        } else {
            musicItem.style.display = 'none'; // Esconde o item
        }
    }
}

// Função para obter parâmetros da URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        repertoryIndex: parseInt(params.get('index'), 10)
    };
}

// Função para exibir músicas do repertório
function displayRepertory() {
    const { repertoryIndex } = getQueryParams();

    // Recupera os repertórios do localStorage
    const storedRepertorios = localStorage.getItem('repertorios');
    const repertorios = storedRepertorios ? JSON.parse(storedRepertorios) : [];

    const repertory = repertorios[repertoryIndex];

    if (repertory) {
        // Exibir o título do repertório
        document.getElementById('repertory-title').innerText = repertory.nome;

        // Exibir a lista de músicas
        const musicList = document.getElementById('music-list');
        musicList.innerHTML = '';

        repertory.musicas.forEach((musica, index) => {
            const div = document.createElement('div');
            div.setAttribute('draggable', true);
            div.innerHTML = `
                <span style="cursor: pointer;" onclick="displayMusic('${escapeJson(musica)}')">${musica.titulo}</span>
                <button class="delete-btn" onclick="removeMusic(${repertoryIndex}, ${index})">
                <i class="fas fa-trash-alt"></i> <!-- Ícone de lixeira -->
            </button>
        `;

            // Adicionar eventos de drag and drop
            div.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', index.toString());
                e.currentTarget.classList.add('dragging');
            });

            div.addEventListener('dragend', () => {
                div.classList.remove('dragging');
            });

            div.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            div.addEventListener('drop', (e) => {
                e.preventDefault();
                const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
                if (draggedIndex !== index) {
                    // Troca as músicas
                    const temp = repertory.musicas[index];
                    repertory.musicas[index] = repertory.musicas[draggedIndex];
                    repertory.musicas[draggedIndex] = temp;

                    // Atualiza o localStorage
                    localStorage.setItem('repertorios', JSON.stringify(repertorios));
                    displayRepertory(); // Atualiza a exibição
                }
            });

            musicList.appendChild(div);
        });
    } else {
        document.getElementById('repertory-title').innerText = 'Repertório não encontrado';
    }
}

// Função para escapar caracteres especiais em JSON
function escapeJson(musica) {
    return JSON.stringify(musica).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;');
}


// Função para destacar as cifras
function highlightCifras(cifra) {
    const cifraRegex = /(?<!\w)([A-G](?:#|b)?(?:m|sus|dim|aug|\d*)?)(?!\w)/g;
    return cifra.replace(cifraRegex, '<span class="cifra-highlight">$&</span>');
}

// Função para exibir a música selecionada
function displayMusic(musicaJson) {
    try {
        // Fazendo o parsing da string JSON para um objeto
        const musica = JSON.parse(musicaJson);
        console.log('Música selecionada:', musica); // Para verificar se a música é passada corretamente
        const musicDisplay = document.getElementById('music-display');

        // Verifica se a música tem título e cifra
        if (musica && musica.titulo && musica.cifra) {
            // Aplica o destaque nas cifras antes de exibir
            const highlightedCifra = highlightCifras(musica.cifra);

            musicDisplay.innerHTML = `
                <h2>${musica.titulo}</h2>
                <h3>${musica.autor}</h3>
                <pre>${highlightedCifra}</pre>`; // A cifra com cores aparece aqui
        } else {
            musicDisplay.innerHTML = `<p>Música não encontrada.</p>`;
        }
    } catch (error) {
        console.error("Erro ao exibir a música:", error);
        document.getElementById('music-display').innerHTML = `<p>Música não encontrada.</p>`;
    }
}



// Função para remover música do repertório
function removeMusic(repertoryIndex, musicIndex) {
    const userResponse = confirm('Deseja realmente excluir essa música?');
    if (userResponse) {
        const storedRepertorios = localStorage.getItem('repertorios');
        const repertorios = storedRepertorios ? JSON.parse(storedRepertorios) : [];
        repertorios[repertoryIndex].musicas.splice(musicIndex, 1);
        localStorage.setItem('repertorios', JSON.stringify(repertorios));
        displayRepertory(); // Atualiza a lista de músicas
    }
}

// Chama a função para exibir o repertório ao carregar a página
document.addEventListener('DOMContentLoaded', displayRepertory);

function selecionarMusica(id) {
    const musicaSelecionada = musicas.find(musica => musica.id === id);
    console.log('Música selecionada:', musicaSelecionada); // Log para verificar a música selecionada

    if (musicaSelecionada) {
        displayMusic(musicaSelecionada);
    } else {
        console.error('Música não encontrada para o ID:', id);
        displayMusic(null); // Exibir mensagem de erro
    }
}




