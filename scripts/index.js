window.onload = function() {
    loadItems();
    newGameButton.onclick = () => {
        location = "./wordle.html";
    }
}

function loadItems() {
    newGameButton = document.getElementById("new-game-button");
    loadGameButton = document.getElementById("load-game-button");
    contactButton = document.getElementById("contact-button");
    gameName = document.getElementById("game-name");
    newGameModal = document.getElementById("newGameModal");
}

function showNewGameScreen() {
    newGameModal.classList.add("modal-show");
}