/*******************/
    "use strict"    //determinar sintaxis estricto y correcto
/******************/           


/*seleccion de elemetnos*/
const startButton = document.getElementById("btn-empezar");
const nextButton = document.getElementById("btn-siguiente");
const selectButton = document.getElementById("btn-seleccionar");
const sendButton = document.getElementById("btn-enviar");
const contenedorPregunta = document.getElementById("contenedor-pregunta");
const pregunta_Elemento = document.getElementById("pregunta");
const respuestas_Elemento = document.getElementById("botones-respuesta");
const progress_Elemento = document.getElementById("circulos-progreso");
const pantallaFinal = document.getElementById("pantalla-final");
const pantallaInicial = document.getElementById("pantalla-inicial");

/* cantidad de preguntas respondidas correctamente*/
var score =0;


let perguntasMezcladas, indexPregunta; /*let perimte redefinir*/


startButton.onclick = startGame;
selectButton.onclick = selectAnswers;
sendButton.onclick = sendAnswer;


function startGame(){
    console.log("Comienzo de cuestionario");
    indexPregunta=0;
    score =0;
    startButton.classList.add('oculto');
    perguntasMezcladas = preguntas.sort(() => Math.random() - .5).slice(0,10);  // (Math.Random() .-5) puede dar un numero positivo o negativo, por eso sort ordena aleatoriamente
    pantallaFinal.classList.add("oculto");
    pantallaInicial.classList.add("oculto");
    contenedorPregunta.classList.remove('oculto');

    showProgress();
    setNextQuestion();
    nextButton.onclick = function(){
        document.getElementById("circulo"+indexPregunta).classList.remove('actual');
        indexPregunta++;
        setNextQuestion();
    }
}

function setNextQuestion(){
    /*reset*/
    clearStatusClass(document.body);
    nextButton.classList.add("oculto");

    while(respuestas_Elemento.firstChild){
        respuestas_Elemento.removeChild(respuestas_Elemento.firstChild);
    };

    /*  determinar pregunta, progreso y mostrarla   */
    var pregunta = perguntasMezcladas[indexPregunta];

    document.getElementById("circulo"+indexPregunta).classList.add('actual');
    
    showQuestion(pregunta);
}



function showQuestion(pregunta){
    switch(pregunta.tipo){
        case 'boton':
            showQuestionBoton(pregunta);
            break;
        case 'imagen':
            showQuestionImagen(pregunta);
            break;
        case 'multiple':
            showQuestionMultiple(pregunta);
            break;
        case 'completar':
            showQuestionCompletar(pregunta);
            break;  
    }
}
function showQuestionBoton(pregunta){
    pregunta_Elemento.innerHTML = pregunta.pregunta;
    pregunta.respuestas.forEach(respuesta =>
    {
        var boton = document.createElement("button");
        boton.innerHTML = respuesta.texto;
        boton.classList.add('btn');

        if (respuesta.correct){
            boton.dataset.correct = respuesta.correct; /*para chequear mas tarde*/ 
        }

        boton.addEventListener ("click", selectAnswer);
        respuestas_Elemento.appendChild(boton);
    });
}

function showQuestionImagen(pregunta){
    pregunta_Elemento.innerHTML = pregunta.pregunta;
    pregunta.respuestas.forEach(respuesta =>
    {
        var imagen = document.createElement("img");
        imagen.src = respuesta.texto;
        imagen.classList.add('imagen');

        if (respuesta.correct){
            imagen.dataset.correct = respuesta.correct; /*para chequear mas tarde*/ 
        }

        imagen.addEventListener ("click", selectAnswer);
        respuestas_Elemento.appendChild(imagen);
    });
}

function showQuestionMultiple(pregunta){
    pregunta_Elemento.innerHTML = pregunta.pregunta;
    var idIndex=0;
    pregunta.respuestas.forEach(respuesta =>
    {   
        var label= document.createElement("label");
        
        var checkBox = document.createElement("input");
        checkBox.type= "checkbox";
        // checkBox.value= 1;
        checkBox.id = "checkbox"+idIndex++;

        label.htmlFor = checkBox.id;

        if(respuesta.correct){
            checkBox.dataset.correct = respuesta.correct;
            label.dataset.correct = respuesta.correct;
        }
        
        respuestas_Elemento.appendChild(checkBox);
        respuestas_Elemento.appendChild(label);
        label.classList.add('checkbox');
        label.innerHTML += respuesta.texto;
        checkBox.addEventListener("click", clickCheckBox);
    })
    
    
}

function showQuestionCompletar(pregunta){

    pregunta_Elemento.innerHTML = pregunta.pregunta;
    

    var respuesta = Array.from(pregunta.respuestas)[0]; //ya que solo tiene un elemento
    
    var inputText = document.createElement("input");
    inputText.type = "text";
    inputText.id="inputText"
    // inputText.placeholder = "su respuesta";
    
    var label = document.createElement("label");
    label.htmlFor = "inputText";
    var n = respuesta.texto.indexOf('|');

    
    respuestas_Elemento.appendChild(label);
    label.classList.add("input");

    label.innerHTML = respuesta.texto.substr(0, n);
    label.appendChild(inputText);
    inputText.dataset.correct = respuesta.texto.substr(n+1);


    inputText.onkeydown = function(evento){
        if( evento.keyCode == 13)   //13 es el codigo para el Enter
            inputText.blur();
    }
    inputText.addEventListener('focusout', function(){
        if(inputText.value.length > 2){
            sendButton.classList.remove('oculto');
        }
    } );
     
    
}

function showProgress(){

    progress_Elemento.classList.remove('oculto');

    /*resetear*/
    while(progress_Elemento.firstChild){
        progress_Elemento.removeChild(progress_Elemento.firstChild);
    };

    for(var i = 0; i < perguntasMezcladas.length; i++){
        var circulo = document.createElement("div");
        circulo.classList.add("circulo");
        circulo.id = "circulo"+i;
        progress_Elemento.appendChild(circulo);
    }

}

function showPantallaFinal(){

    progress_Elemento.classList.add("oculto");
    contenedorPregunta.classList.add("oculto");
    nextButton.classList.add("oculto");
    nextButton.innerHTML = "Siguiente";

    /*Mostrar el div de pantalla final*/
    pantallaFinal.classList.remove("oculto");

    startButton.innerHTML = "Reiniciar";
    startButton.classList.remove("oculto");

    /*mas cosas de pantalla final*/ 
    var titulo = document.getElementById("titulo");
    var puntaje= document.getElementById("puntaje");
    var aprobado = score > (perguntasMezcladas.length) * 0.5;

    titulo.innerHTML = aprobado? 
        "Felicitaciones! Aprobaste la evaluaci??n sideral" :
        "No lograste superar la evaluaci??n, contempla las estrellas e intentalo nuevamente";
    puntaje.innerHTML = "Respuestas correctas: " + score.toString() + "/" + perguntasMezcladas.length.toString();

    setStatusClass(document.body, aprobado);
}


function selectAnswer(e){
    var botonSeleccionado = e.target;
    var correct = botonSeleccionado.dataset.correct;
    
    setStatusClass(document.body, correct);
    setStatusClass(document.getElementById("circulo"+indexPregunta), correct);
    
    
    /*Marcar correcta e incorrectas, anular el evento en click*/
    Array.from(respuestas_Elemento.children).forEach(boton => {
        setStatusClass(boton, boton.dataset.correct);
        boton.classList.add("blocked");
        boton.removeEventListener("click", selectAnswer);
    });
    
    if(correct) score++;
    
    showControlButton();
}

function sendAnswer(){
    
    var respuesta = document.getElementById("inputText");
    var correct=false;
    
    
    var texto = respuesta.value;
    texto = texto.toUpperCase();
    texto= texto.trim();

    if( texto == respuesta.dataset.correct ){
        correct= true;
        respuesta.classList.add("correct");
    }
    else{
        respuesta.classList.add("incorrect");

        respuesta.value+= "   ["+respuesta.dataset.correct.toLowerCase()+"]";
    }

    inputText.classList.add("blocked");
    setStatusClass(document.body, correct);
    setStatusClass(document.getElementById("circulo"+indexPregunta), correct);
    sendButton.classList.add('oculto');

    if(correct) score++;

    showControlButton();
}

function selectAnswers(){

    var correct= true;
    selectButton.classList.add('oculto');

    Array.from(respuestas_Elemento.children).forEach(checkBox => {
        if( checkBox.getAttribute("type")== "checkbox")     //excluyo los labels
        {
            if (checkBox.checked && !checkBox.dataset.correct)  {
                correct = false;
                checkBox.classList.add("wrong");
            }
            if (!checkBox.checked && checkBox.dataset.correct){
                correct = false;
                checkBox.classList.add("wrong");
            }
        }

            setStatusClass(checkBox, checkBox.dataset.correct);
            checkBox.classList.add("blocked");
            checkBox.removeEventListener("click", clickCheckBox);
    });

    setStatusClass(document.body, correct);
    setStatusClass(document.getElementById("circulo"+indexPregunta), correct);
    
    if(correct) score++;
    
    showControlButton();    
}

function showControlButton(){
    if( perguntasMezcladas.length > indexPregunta +1){
        nextButton.classList.remove("oculto");
    }else{
        nextButton.classList.remove("oculto");
        nextButton.innerHTML = "Finalizar";
        nextButton.onclick = showPantallaFinal;
    }
}
function setStatusClass(elemento, correct){
    /*reset*/
    clearStatusClass(elemento);
    /**/
    if(correct){
        elemento.classList.add("correct");
    }else {
        elemento.classList.add("incorrect");
    }
}

function clearStatusClass (elemento){
    elemento.classList.remove("correct");
    elemento.classList.remove("incorrect");
    elemento.classList.remove("blocked");
}
 

function clickCheckBox(e)
{
    var checkBoxSelected = e.target;
    

    selectButton.classList.add('oculto');
    /*verifico si hay alguna casilla seleccionada*/
    Array.from(respuestas_Elemento.children).forEach(checkBox => {
        if (checkBox.checked)
            selectButton.classList.remove('oculto');
    });
}
//////////////////////////////////////////PREGUNTAS/////////////////////////////////
//#region preguntas

const preguntas = [
    {
        pregunta: '??Qu?? es un a??o luz?',
        tipo: 'boton',
        respuestas:[
            {texto: 'Es la distancia recorrida por la luz en un a??o', correct: true},
            {texto: 'Es el tiempo que tarda la luz en recorrer la distancia que hay entre el Sol y la estrella m??s cercana', correct: false},
            {texto: 'Es una unidad de velocidad', correct: false},
            {texto: 'Es la distancia que hay entre el Sol y la Tierra', correct: false},
        ]
    },
    
    {
        pregunta: 'Complete la siguiente oraci??n:',
        tipo: 'completar',
        respuestas:[
            {texto: 'La teor??a helioc??ntrica fue propuesta en el a??o 1543 por Nicol??s |COPERNICO', correct: true},
        ]
    },

    {
        pregunta: 'Seleccione la im??gen que corresponda al planeta Jupiter',
        tipo: 'imagen',
        respuestas:[
            {texto: 'img/saturno.jpg', correct: false},
            {texto: 'img/jupiter.jpg', correct: true},
            {texto: 'img/venus.jpg', correct: false},
            {texto: 'img/titan.jpg', correct: false},
        ]
    },

    {
        pregunta: '??Cuales, de las siguientes afirmaciones, son ciertas para el Sol?',
        tipo: 'multiple',
        respuestas:[
            {texto: 'es una estrella enana', correct: true},
            {texto: 'se form?? hace aproximadamente 4,6 millones de a??os', correct: false},
            {texto: 'se encuentra a 1 UA (Unidad Astronomica) de la Tierra', correct: true},
            {texto: 'es 300 veces m??s grande que la Luna.', correct: false},
        ]
    },

    {
        pregunta: 'El eclipse lunar se da cuando: ',
        tipo: 'boton',
        respuestas:[
            {texto: 'la Tierra se sit??a entre la Luna y el Sol', correct: true},
            {texto: 'la Luna se sit??a entre la Tierra y el Sol', correct: false},
        ]
    },

    {
        pregunta: '??C??al de las siguientes im??genes corresponde a la primer fotograf??a de un agujero negro?',
        tipo: 'imagen',
        respuestas:[
            {texto: 'img/agujeroNegroFortnite.jpg', correct: false},
            {texto: 'img/agujeroNegro.jpg', correct: true},
            {texto: 'img/quasar.jpg', correct: false},
            {texto: 'img/eclipseSolar.jpg', correct: false},
        ]
    },

    {
        pregunta: '??C??al de las siguientes im??genes grafica el sentido de rotaci??n terrestre correctamente?',
        tipo: 'imagen',
        respuestas:[
            {texto: 'img/rotacionIncorrecta.jpg', correct: false},
            {texto: 'img/rotacionCorrecta.jpg', correct: true},
        ]
    },

    {
        pregunta: 'Complete la siguiente oraci??n:',
        tipo: 'completar',
        respuestas:[
            {texto: 'La rama de la astrnom??a que estudia el universo en conjunto, con sus leyes generales, or??gen y evoluci??n, recibe el nombre de |COSMOLOGIA', correct: true},
        ]
    },

    {
        pregunta: 'Complete la siguiente oraci??n:',
        tipo: 'completar',
        respuestas:[
            {texto: 'Si bien por extensi??n se llama "lunas" a los sat??lites de otros planetas, el t??rmino correcto es sat??lite |NATURAL', correct: true},
        ]
    },
    
    {
        pregunta: '??C??mo se llama la misi??n espacial de la NASA que logr?? la llegada del hombre a la Luna por primera vez?',
        tipo: 'boton',
        respuestas:[
            {texto: 'Apolo 13', correct: false},
            {texto: 'Voyager 1', correct: false},
            {texto: 'Apolo 11', correct: true},
            {texto: 'Apolo 10', correct: false},
        ]
    },

    {
        pregunta: 'La tripulaci??n del Apolo 11 estaba conformada por: ',
        tipo: 'multiple',
        respuestas:[
            {texto: 'Michael Collins', correct: true},
            {texto: 'Neil Armstrong', correct: true},
            {texto: 'Fred Haise', correct: false},
            {texto: 'Edwin Aldrin Jr.', correct: true},
        ]
    },

    {
        pregunta: '??Qui??n, de los siguientes f??sicos, fue el encargado de postular la "Ley de Gravitaci??n Universal"?',
        tipo: 'boton',
        respuestas:[
            {texto: 'Albert Einstein', correct: false},
            {texto: 'Isaac Newton', correct: true},
            {texto: 'Johannes Kepler', correct: false},
            {texto: 'Michael Faraday', correct: false},
        ]
    },

    {
        pregunta: 'Elija las denominaciones v??lidas para la clasificaci??n de estrellas seg??n su tama??o: ',
        tipo: 'multiple',
        respuestas:[
            {texto: 'Supergigante', correct: true},
            {texto: 'Enana brillante', correct: false},
            {texto: 'Gigante Brillante', correct: true},
            {texto: 'Ninguna de las anteriores', correct: false},
        ]
    },

    
    {
        pregunta: 'El cintur??n de asteroides que se encuentra entre las ??rbitas de Marte y J??piter recibe el nombre de: ',
        tipo: 'boton',
        respuestas:[
            {texto: 'Cintur??n de Kuiper', correct: false},
            {texto: 'Cintur??n principal', correct: true},
        ]
    },

    {
        pregunta: 'Seleccione los requisitos para que un a??o se considere bisiesto: ',
        tipo: 'multiple',
        respuestas:[
            {texto: 'Debe ser a??o secular', correct: false},
            {texto: 'Debe ser divisible por 4', correct: true},
            {texto: 'No debe ser a??o secular', correct: false},
            {texto: 'Debe ser divisible por 400 en caso de ser a??o secular', correct: true},
        ]
    },

    {
        pregunta: 'Complete la siguiente oraci??n:',
        tipo: 'completar',
        respuestas:[
            {texto: 'Por ser el planeta m??s r??pido al moverse alrededor del Sol, fue nombrado en honor al dios romano mensajero: |MERCURIO', correct: true},
        ]
    },

    {
        pregunta: 'Seleccione la im??gen que corresponda al planeta Marte',
        tipo: 'imagen',
        respuestas:[
            {texto: 'img/enanaMarron.jpg', correct: false},
            {texto: 'img/titan.jpg', correct: false},
            {texto: 'img/venus.jpg', correct: false},
            {texto: 'img/marte.jpg', correct: true},
        ]
    },
    
    {
        pregunta: 'Seleccione la im??gen donde se pueda apreciar la "espina dorsal" de la Via L??ctea',
        tipo: 'imagen',
        respuestas:[
            {texto: 'img/auroraBoreal.jpg', correct: false},
            {texto: 'img/constelacionOrion.jpg', correct: false},
            {texto: 'img/espinaDorsalViaLactea.jpg', correct: true},
            {texto: 'img/firmamentoPolar.jpg', correct: false},
        ]
    },

    {
        pregunta: '??Cu??l es el planeta m??s grande del Sistema Solar?',
        tipo: 'boton',
        respuestas:[
            {texto: 'Tierra', correct: false},
            {texto: 'Saturno', correct: false},
            {texto: 'Neptuno', correct: false},
            {texto: 'Jupiter', correct: true},
        ]
    },

    {
        pregunta: '??Cu??l es el planeta m??s peque??o conocido del Sistema Solar?',
        tipo: 'boton',
        respuestas:[
            {texto: 'Marte', correct: false},
            {texto: 'Mercurio', correct: true},
            {texto: 'Venus', correct: false},
            {texto: 'Urano', correct: false},
        ]
    },


    {
        pregunta: 'Seleccione la im??gen que corresponda a una Super Nova',
        tipo: 'imagen',
        respuestas:[
            {texto: 'img/superNova.jpg', correct: true},
            {texto: 'img/quasar2.jpg', correct: false},
            {texto: 'img/nebulosaPilares.jpg', correct: false},
            {texto: 'img/pulsar.jpg', correct: false},
        ]
    },

    {
        pregunta: '??Qu?? es lo que se cree que hay en el centro de nuestra galaxia?',
        tipo: 'boton',
        respuestas:[
            {texto: 'Un agujero negro masivo', correct: true},
            {texto: 'Un agujero blanco', correct: false},
            {texto: 'Un cumulo de estrellas muy antiguo', correct: false},
            {texto: 'Nada', correct: false},
        ]
    },

    {
        pregunta: '??De que elementos qu??micos est?? compuesto mayormente el Sol?',
        tipo: 'multiple',
        respuestas:[
            {texto: 'F??sforo', correct: false},
            {texto: 'Helio', correct: true},
            {texto: 'Hidr??geno', correct: true},
            {texto: 'Hierro', correct: false},
        ]
    },

    {
        pregunta: '??Por qu?? se producen las estaciones del a??o?',
        tipo: 'boton',
        respuestas:[
            {texto: 'Por la distancia entre la Tierra y el Sol', correct: false},
            {texto: 'Por la inclinaci??n de la Tierra con respecto al Sol', correct: true},
            {texto: 'Por la ??rbtia inclinada de la Luna con respecto a la de la Tierra', correct: false},
            {texto: 'Por los cambios de los vientos solares', correct: false},
        ]
    },

    {
        pregunta: 'Seleccione la im??gen que corresponda a un Cometa',
        tipo: 'imagen',
        respuestas:[
            {texto: 'img/asteroides.jpg', correct: false},
            {texto: 'img/meteorito.jpg', correct: false},
            {texto: 'img/estrellaFugaz.jpg', correct: false},
            {texto: 'img/cometa.jpg', correct: true},
        ]
    },
    {
        pregunta: '??Cu??l es el planeta del Sistema Solar con mayor cantidad de sat??lites naturales?',
        tipo: 'boton',
        respuestas:[
            {texto: 'Marte', correct: false},
            {texto: 'Jupiter', correct: false},
            {texto: 'Saturno', correct: true},
            {texto: 'Urano', correct: false},
        ]
    },
    {
        pregunta: '??Cu??l de los siguientes eventos puede desencadenar el nacimiento de un nuevo agujero negro?',
        tipo: 'boton',
        respuestas:[
            {texto: 'Una estrella Gigante muere', correct: true},
            {texto: 'Una estrella enana colisiona con otra', correct: false},
            {texto: 'Supernova en un sistema biniario (dos estrellas)', correct: false},
            {texto: 'Una estrella gigante termina de quemar el hidr??geno en su n??cleo', correct: false},
        ]
    },
]

//#endregion
