window.onload = function() {
    loadItems();
    newGameButton.onclick = (e) => {
        e.preventDefault();
        showNewGameScreen();
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
}

function showNewGameScreen() {
    newGameModal.classList.add("modal-show");
    cancelGameButton.onclick = () => {
        newgameModal.classList.remove("modal-show");
    }
    window.onclick = function(e) {
        if (e.target == newGameModal) {
            newGameModal.classList.remove("modal-show");
        }
    }
}