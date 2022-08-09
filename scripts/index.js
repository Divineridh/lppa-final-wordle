window.onload = function() {
    sessionStorage.clear();
    loadItems();
    newGameButton.onclick = (e) => {
        e.preventDefault();
        showNewGameScreen();
    }
    startGameButton.onclick = (e) => {
        newGame();
    }
    loadGameButton.onclick = (e) => {
        showLoadGameScreen();
        mostrarPartidasGuardadas();
    }
    contactButton.onclick = (e) => {
        showContactScreen();
    }
}

function loadItems() {
    newGameButton = document.getElementById("new-game-button");
    loadGameButton = document.getElementById("load-game-button");
    contactButton = document.getElementById("contact-button");
    gameName = document.getElementById("game-name");
    newGameModal = document.getElementById("newGameModal");
    cancelGameButton = document.getElementById("new-game-cancel-button");
    startGameButton = document.getElementById("new-game-begin-button");
    loadGameModal = document.getElementById("loadGameModal");
    modalTable = document.getElementById("table");
    modalCancelar = document.getElementsByClassName("modal-btn")[0];
    modalTitle = document.getElementsByClassName("modal-title")[0];
    modalText = document.getElementsByClassName("modal-text")[0];
    modalLoadingT = document.getElementsByClassName("text")[0];
    contactModal = document.getElementById("contactModal");
    contactNombre = document.getElementById("contactNombre");
    contactEmail = document.getElementById("contactEmail");
    contactMensaje = document.getElementById("contactMensaje");
    cancelContact = document.getElementById("cancel-contact");
    acceptContact = document.getElementById("accept-contact");
    if (localStorage.partidasGuardadas != null) {
        guardadasLS = JSON.parse(localStorage.partidasGuardadas);
    } else {
        guardadasLS = [];
    }
}

var partidaCargada;

function limpiarItems() {
    gameName.value = "";
    contactNombre.value = "";
    contactEmail.value = "";
    contactMensaje.value = "";
}

function showNewGameScreen() {
    newGameModal.classList.add("modal-show");
    cancelGameButton.onclick = () => {
        newGameModal.classList.remove("modal-show");
        limpiarItems();
    }
    window.onclick = function(e) {
        if (e.target == newGameModal) {
            newGameModal.classList.remove("modal-show");
            limpiarItems();
        }
    }
}

function newGame() {
    sessionStorage.gameName = gameName.value;
    location = "./wordle.html";
}

function showLoadGameScreen() {
    loadGameModal.classList.add("modal-show");
    window.onclick = function(e) {
        if (e.target == loadGameModal) {
            loadGameModal.classList.remove("modal-show");
            limpiarItems();
        }
    }
}

function showContactScreen() {
    contactModal.classList.add("modal-show");
    cancelContact.onclick = () => {
        contactModal.classList.remove("modal-show");
        limpiarItems();
    }
    window.onclick = function(e) {
        if (e.target == contactModal) {
            contactModal.classList.remove("modal-show");
            limpiarItems();
        }
    }
}

function llenarTabla(){
    let head = `
    <tr><th>ID</th>
    <th>Jugador</th>
    <th>Tiempo</th>
    <th>Fecha</th></tr>`;
    let body = "";
    for (let i = 0; i < guardadasLS.length; i++) {
        body += `
        <tr name="partida"><td>${i}</td>
        <td>${guardadasLS[i].jugador}</td>
        <td>${guardadasLS[i].minutos.toString().padStart(2,"0")}:${guardadasLS[i].segundos.toString().padStart(2,"0")}</td>
        <td>${guardadasLS[i].fecha} - ${guardadasLS[i].hora}</td></tr>`;
    }
    document.getElementById("encabezado").innerHTML = head;
    document.getElementById("contenido").innerHTML = body;
}

function mostrarPartidasGuardadas(){
    if (guardadasLS == null || guardadasLS.length == 0) {
        noExistenPartidas();
        return;
    }
    llenarTabla();
    let tr = document.getElementsByName("partida");
    tr.forEach(x => {
        x.onclick = (e) => {
            let id = e.path[1].innerHTML.split(">")[1];
            id = id.toString().split("<")[0];
            partidaCargada = guardadasLS[id];
            sessionStorage.partida = JSON.stringify(partidaCargada);
            sessionStorage.nroPartida = id;
            newGame();
        }
    });
    existenPartidas();
}

function noExistenPartidas(){
    modalLoading.classList.add("hidden");
    modalLoadingT.classList.add("hidden");
    modalTitle.innerHTML = "No existe ninguna partida guardada :/";
    modalTitle.style.fontSize = "35px";
    modalTitle.style.marginTop = "70px";
    modalTitle.classList.remove("hidden");
    modalCancelar.classList.remove("hidden");
}

function existenPartidas(){
    //modalLoading.classList.add("hidden");
    modalLoadingT.classList.add("hidden");
    modalTitle.innerHTML = "Partidas guardadas";
    modalTitle.classList.remove("hidden");
    modalCancelar.classList.remove("hidden");
    modalTable.classList.remove("hidden");
}