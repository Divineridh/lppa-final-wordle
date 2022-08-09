if (sessionStorage.gameName == null) {
  location = "./index.html";
}

var palabras =["claro","limon","autos","manco","limas","rodeo","avion","aires","estan","estas","muela","toman","tomar","topes","tacho","turbo","unete","uvula","usalo","mares","tango"]
let palabra = palabras[Math.floor(Math.random()*palabras.length)];

var matriz = [
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,0,0,0,0]
];

var respuestas = [
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,0,0,0,0]
];

var colorTablero = [
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,0,0,0,0]
];

var color = {
  VERDE: 1,
  AMARILLO: 2,
  GRIS: 3
}

var nroPartida;
var cronometro;
var mins;
var secs;

window.onload = () => {
  loadItems();
  
  if (partidaCargada == null) {
      crearPartidaNueva();
      console.log(palabra)
  } else {
      cargarPartidaGuardada();
  }
  inputs.forEach(x => x.onkeyup = handleInputs);
  inputs.forEach(x => x.onkeydown = clearTile);
  btnGuardar.onclick = (e) => {
      e.preventDefault();
      setTimeout(guardarPartida,500);
  }
  btnInicio.onclick = () => location = "./index.html";
  btnGanadores.onclick = () => location = "";
  btnCodigo.onclick = () => location.href = "https://github.com/Divineridh/lppa-final-wordle";
}

function loadItems(){
  inputs = document.querySelectorAll("input");
  filas = document.querySelectorAll("fieldset");
  modal = document.getElementById("sctModal");
  modalClose = document.getElementsByClassName("modal-btn")[0];
  modalTitle = document.getElementsByClassName("modal-title")[0];
  modalText = document.getElementsByClassName("modal-text")[0];
  modalImage = document.getElementsByClassName("modal-img")[0];
  btnGuardar = document.getElementsByClassName("btnGuardar")[0];
  pNombre = document.getElementsByClassName("nombre-cronometro")[0];
  pCronometro = document.getElementsByClassName("nombre-cronometro")[1];
  btnInicio = document.getElementsByClassName("btnNav")[0];
  btnGanadores = document.getElementsByClassName("btnNav")[1];
  btnContacto = document.getElementsByClassName("btnNav")[2];
  btnCodigo = document.getElementsByClassName("btnNav")[3];
  if (localStorage.partidasGuardadas != null) {
      //createBoard(); // borrar en caso de que no funciones
      guardadasLS = JSON.parse(localStorage.partidasGuardadas);
  } else {
      guardadasLS = [];
  }
  if (sessionStorage.partida != null) {
      //createBoard(); // borrar en caso de que no funciones
      partidaCargada = JSON.parse(sessionStorage.partida);
      nroPartida = parseInt(sessionStorage.nroPartida);
      sessionStorage.removeItem("partida");
      sessionStorage.removeItem("nroPartida");
      sessionStorage.gameName = partidaCargada.jugador;
  } else {
      partidaCargada = null;
      nroPartida;
  }

}

function iniciarCronometro(m,s){
    cronometro = setInterval(function(){
        if (s >= 60) {
            s = 0;
            m++;
        }        
        pCronometro.innerHTML = `Tu tiempo es ${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
        mins = m;
        secs = s;
        s++;
    },1000)
  }

  function inicio(){
    for (let f = 0; f < matriz.length; f++) {
        document.getElementById(`row${f}`).onkeydown = function fn(e){
            if (e.keyCode === 13) { //ENTER
                guardarRespuesta(f);
            }
        }
    }
  }

function crearPartidaNueva(){
  pNombre.innerHTML = `Hola ${sessionStorage.gameName}`;
  for (let i = 0; i < filas.length; i++) {
      if (i != 0) {
          filas[i].disabled = true;
      }
  }
  iniciarCronometro(0,0);
  inputs[0].focus();
  inicio();
}

function pintarTablero(){
    for (let f = 0; f < matriz.length; f++) {
        for (let c = 0; c < matriz[f].length; c++) {
            let input = document.getElementById(`f${f}c${c}`);
            switch (colorTablero[f][c]) {
                case color.VERDE: 
                input.classList.add("verde");
                    break;
                case color.AMARILLO: 
                input.classList.add("amarillo");
                    break;
                case color.GRIS: 
                input.classList.add("gris");
                    break;
            }
        }
    }
  }

function cargarPartidaGuardada(){
  palabra = partidaCargada.palabra;
  respuestas = partidaCargada.tablero;
  colorTablero = partidaCargada.color;
  let filaCargada = null;
  for (let f = 0; f < matriz.length; f++) {
      for (let c = 0; c < matriz[f].length; c++) {
          let input = document.getElementById(`f${f}c${c}`);
          if(respuestas[f][c] == 0){
              if (filaCargada == null) {
                  filaCargada = f;
                  for (let i = 0; i < filas.length; i++) {
                      if (i != f) {
                          filas[i].disabled = true;
                      }
                  }
                  document.getElementById(`f${f}c0`).focus();
              }
          } else {
              input.value = respuestas[f][c];
          }
      }
  }
  pintarTablero();
  mins = partidaCargada.minutos;
  secs = partidaCargada.segundos;
  pNombre.innerHTML = `Hola ${partidaCargada.jugador}`;
  iniciarCronometro(mins,secs);
  inicio();        
}

function handleInputs(e){
  if (e.keyCode === 32) { 
      if (e.target.value == " ") {
          e.target.value = "";
      }
      return;
  }
  if (e.target.value.length == 1) {
      let next = e.target.nextElementSibling;
      if (!next) {
          return;
      }
      if (next.tagName.toLowerCase() === "input") {
          next.focus();
      }
  }
}

function clearTile(e){
  if (e.keyCode === 8) {
      if (e.target.value.length === 1) {
          return;
      }
      let prev = e.target.previousElementSibling;
      if (!prev) {
          return;
      }
      if (prev.tagName.toLowerCase() === "input") {
          prev.value = "";
          prev.focus();
      }
  }
}

function detenerJuego(){
    clearInterval(cronometro);
    filas.forEach(x => {
        x.disabled = true;
    });
    btnGuardar.disabled = true;
    btnGuardar.classList.add("disabled");
  }

function mostrarModal(resultado){
    switch (resultado) {
        case "win":
            modalTitle.innerHTML = "¡Ganaste!"
            modalTitle.style.color = "blue";
            modalText.innerHTML = "Bien hecho la palabra era " + palabra.toUpperCase() + ", ahora figuras en la tabla de ganadores.";
            modal.classList.add("modal-show");
            guardarPartidaGanada();
        break;
        case "lose":
            modalTitle.innerHTML = "¡Perdiste!"
            modalTitle.style.color = "red";
            modalText.innerHTML = "La palabra era " + palabra.toUpperCase() + ". Vuelve a intentarlo en otra ocacion.";
            modal.classList.add("modal-show");
        break;
        case "save":
            modalTitle.innerHTML = "¡Partida guardada!"
            modalTitle.style.color = "green";
            if (partidaCargada == null) {
                modalText.innerHTML = sessionStorage.nombre + ", se guardo tu partica. Para retomarla tienes que ir al menu de inicio.";
            } else {
                modalText.innerHTML = partidaCargada.jugador + ", se guardo tu partica. Para retomarla tienes que ir al menu de inicio.";
            }
            modal.classList.add("modal-show");
        break;
        case "error":
            clearInterval(cronometro);
            modalTitle.innerHTML = "¡Error!"
            modalTitle.style.color = "red";
            modalText.innerHTML = "No se puede guardar una partida que no esta empezada.";
            modal.classList.add("modal-show");
        break;
    }
  
    if (resultado != "error") {
        modalClose.onclick = function(){
            modal.classList.remove("modal-show");
        }
        window.onclick = function(e) {
            if (e.target == modal) {
                modal.classList.remove("modal-show");
            }
        }
    } else {
        modalClose.onclick = function(){
            modal.classList.remove("modal-show");
            iniciarCronometro(mins,secs);
        }
        window.onclick = function(e) {
            if (e.target == modal) {
                modal.classList.remove("modal-show");
                iniciarCronometro(mins,secs);
            }
        }
    }
  }

function siguienteFila(f,letrasCorrectas){
    filas[f].disabled = true;
    if (letrasCorrectas === palabra.length) {
        detenerJuego();
        mostrarModal("win");
        return;
    }
    fSig = f + 1;
    if (fSig == 6) {
        detenerJuego();
        mostrarModal("lose");
        return;
    }
    filas[fSig].disabled = false;
    document.getElementById(`f${fSig}c0`).focus();
  }

function revisarResultado(respuesta,f){
    let palabraArray = Array.from(palabra);
    var letrasCorrectas = 0;
    palabraArray.forEach(function(x,i){
        if (x === respuesta[i]) {
            colorTablero[f][i] = color.VERDE;
            letrasCorrectas++;
        } else if (palabraArray.includes(respuesta[i])) {
            colorTablero[f][i] = color.AMARILLO;
            } else {
            colorTablero[f][i] = color.GRIS;
            }
    })
    pintarTablero();
    siguienteFila(f,letrasCorrectas);
  }

function guardarRespuesta(f){
  respuestas[f] = [];
  for (let c = 0; c < matriz[c].length; c++) {
      let input = document.getElementById(`f${f}c${c}`);
      console.log(input.value);
      if (input.value == "" || input.value == " ") {
          return;
      }
      respuestas[f].push(input.value.toLowerCase());
  }
  revisarResultado(respuestas[f],f);
}

function guardarPartida(){
  if (JSON.stringify(respuestas) === JSON.stringify(matriz)) {
      mostrarModal("error");
      return;
  }
  detenerJuego();
  let fechaActual = new Date();
  let partida = {
      jugador: sessionStorage.nombre,
      palabra: palabra,
      tablero: respuestas,
      color: colorTablero,
      minutos: mins,
      segundos: secs,
      fecha: fechaActual.toLocaleDateString(),
      hora: fechaActual.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (partidaCargada == null) {
      guardadasLS.push(partida);
      localStorage.partidasGuardadas = JSON.stringify(guardadasLS);
  } else {
      partida.jugador = partidaCargada.jugador;
      guardadasLS[nroPartida] = partida;
      localStorage.partidasGuardadas = JSON.stringify(guardadasLS);
  }
  mostrarModal("save");
}

function guardarPartidaGanada(){
  let fechaActual = new Date();
  let ganada = {
      jugador: sessionStorage.nombre,
      palabra: palabra,
      tablero: respuestas,
      color: colorTablero,
      minutos: mins,
      segundos: secs,
      fecha: fechaActual.toLocaleDateString(),
      hora: fechaActual.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (localStorage.partidasGanadas == null) {
      var partidasGanadas = [];
  } else {
      var partidasGanadas = JSON.parse(localStorage.partidasGanadas);
  }

  partidasGanadas.push(ganada);
  localStorage.partidasGanadas = JSON.stringify(partidasGanadas);
  if (partidaCargada != null) {
      console.log(nroPartida);
      guardadasLS.splice(nroPartida,1);
      localStorage.partidasGuardadas = JSON.stringify(guardadasLS);
  }
}
