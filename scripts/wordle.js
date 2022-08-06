import PALABRAS from "/palabras.json" assert { type: "json" };

const WORD_LENGTH = 5;
const FLIP_ANIMATION_DURATION = 500;
const targetWord = PALABRAS[Math.floor(Math.random() * PALABRAS.length)];
console.log(targetWord);
const guessGrid = document.querySelector("[data-guess-grid]");
const alertContainer = document.querySelector("[data-alert-container]");
const keyboard = document.querySelector("[data-keyboard]");

function startInteraction() {
    document.addEventListener("click", handleClick);
    document.addEventListener("keyup", handlePress);
}

function stopInteraction() {
    document.removeEventListener("click", handleClick);
    document.removeEventListener("keyup", handlePress);
  }

function getActiveTiles() {
    return guessGrid.querySelectorAll('[data-state="active"]');
}

function pressKey(key) {
    const activeTiles = getActiveTiles();
    if (activeTiles.length >= WORD_LENGTH) return;
    const nextTile = guessGrid.querySelector(
        ":not(.words-row):not([data-letter])"
    );
    nextTile.dataset.letter = key.toLowerCase();
    nextTile.textContent = key;
    nextTile.dataset.state = "active";
}

function deleteKey() {
    const activeTiles = getActiveTiles();
    const lastTile = activeTiles[activeTiles.length - 1];
    if (!lastTile) return;
    lastTile.textContent = "";
    delete lastTile.dataset.state;
    delete lastTile.dataset.letter;
}

function submitGuess() {
    const activeTiles = [...getActiveTiles()];
    if (activeTiles.length !== WORD_LENGTH) {
      showAlert("Not enough letters");
      shakeTiles(activeTiles);
      return;
    }
  
    const guess = activeTiles.reduce((word, tile) => {
      return word + tile.dataset.letter;
    }, "");
  
    if (!PALABRAS.includes(guess)) {
      showAlert("Not in word list");
      shakeTiles(activeTiles);
      return;
    }
  
    stopInteraction();
    activeTiles.forEach((...params) => flipTiles(...params, guess));
}

function keyPressed(e) {
    if (e.key.match(/^[a-z]$/)) {
        pressKey(e.key);
        return;
    }

    if (e.key === "Enter") {
        submitGuess();
        return;
    }

    if (e.key === "Backspace" || e.key === "Delete") {
        deleteKey();
        return;
    }
}

function handleClick(e) {
    if (e.target.matches("[data-key]")) {
      pressKey(e.target.dataset.key);
      return;
    }
  
    if (e.target.matches("[data-enter]")) {
      submitGuess();
      return;
    }
  
    if (e.target.matches("[data-delete]")) {
      deleteKey();
      return;
    }
}

function showAlert(message, duration = 1000) {
    const alert = document.createElement("div");
    alert.textContent = message;
    alert.classList.add("alert");
    alertContainer.prepend(alert);
    if (!duration) return;
    setTimeout(() => {
      alert.classList.add("hide");
      alert.addEventListener("transitionend", () => {
        alert.remove();
      });
    }, duration);
}

function flipTiles(tile, index, array, guess) {
    const letter = tile.dataset.letter;
    const key = keyboard.querySelector(`[data-key="${letter}"]`);
    setTimeout(() => {
      tile.classList.add("flip");
    }, (index * FLIP_ANIMATION_DURATION) / 2);
}

function shakeTiles(tiles) {
    tiles.forEach((tile) => {
      tile.classList.add("shake");
      tile.addEventListener(
        "animationend",
        () => {
          tile.classList.remove("shake");
        },
        { once: true }
      );
    });
}