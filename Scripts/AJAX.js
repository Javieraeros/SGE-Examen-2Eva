llamadaCursosXML(escribirCursos);

var respXML;
//Variable en la que guardaremos el valor del botón al que clickemos para darle un valor
//a la nota en el modo ratón
var numeroClick;
//Sacamos todo el xml y lo guardamos en la variable local respXML
function llamadaCursosXML(callback) {
    var oTablaXML = new XMLHttpRequest();
    oTablaXML.open("GET", "../Server/alumnos.xml");

    oTablaXML.onreadystatechange = function () {
        if (oTablaXML.readyState < 4) {
            document.getElementById("txtContenedor").innerHTML = "Cargando...";
        } else {
            if (oTablaXML.readyState == 4 && oTablaXML.status == 200) {

                //Para tratar los datos(darle formato)
                respXML = oTablaXML.responseXML;
                if (callback != null) {
                    callback(respXML);
                }
            }
        }
    }
    oTablaXML.send();
}
/**
Método al qeu llamamos para rellenar el select con lso cursos del xml
*/
function escribirCursos(respXML) {


    var select = document.createElement("Select");
    select.setAttribute("id", 0);
    select.setAttribute("onchange", "rellenaAlumnos()");
    var array = respXML.getElementsByTagName("curso");
    var option;
    var texto;

    option = document.createElement("option");
    option.setAttribute("value", 0);
    texto = document.createTextNode("Selecciona una opción");
    option.appendChild(texto);
    select.appendChild(option);

    for (i = 0; i < array.length; i++) {
        option = document.createElement("option");
        option.setAttribute("value",array[i].getElementsByTagName("codigoCurso")[0].textContent)
        texto = document.createTextNode(array[i].getElementsByTagName("nombreCurso")[0].textContent);
        option.appendChild(texto);
        select.appendChild(option);
    }

    //Para vaciar el texto que teniamos en cargando...
    document.getElementById("txtContenedor").innerHTML = "";

    document.getElementById("txtContenedor").appendChild(select);
}

/*
Método que nos crea la tabla de alumnos
*/
function rellenaAlumnos() {
    var idSeleccionado = document.getElementById("0").value;
    var boton = document.getElementById("btnAceptar");
    var radioButton = document.getElementById("radioButtons");

    document.getElementById("tableContenedor").innerHTML = "";
    if (idSeleccionado != 0) {
        //creamos la tabla
        var table = document.createElement("TABLE");
        table.setAttribute("border", "3");

        var arrayCursos = respXML.getElementsByTagName("curso");
        var codigoCurso;
        var alumnos;
        for (i = 0; i < arrayCursos.length && codigoCurso !== idSeleccionado; i++) {
            codigoCurso = arrayCursos[i].getElementsByTagName("codigoCurso")[0].firstChild.nodeValue;
            alumnos = arrayCursos[i].getElementsByTagName("alumnos");
        }

        //Crea las cabeceras
        var fila = document.createElement("TR");
        var columna = document.createElement("TH");
        var texto = document.createTextNode("Nombre");
        columna.appendChild(texto);
        fila.appendChild(columna);

        columna = document.createElement("TH");
        texto = document.createTextNode("Notas");
        columna.appendChild(texto);
        fila.appendChild(columna);
        table.appendChild(fila);

        //Crea las filas con los alumnos
        for (i = 0; i < alumnos[0].getElementsByTagName("alumno").length; i++) {
            fila = document.createElement("TR");
            columna = document.createElement("TD");
            texto = document.createTextNode(alumnos[0].getElementsByTagName("alumno")[i].textContent);
            columna.appendChild(texto);
            fila.appendChild(columna);
            columna = document.createElement("TD");
            texto = document.createElement("input");
            texto.setAttribute("id", i);
            texto.setAttribute("type", "number");
            columna.appendChild(texto);
            fila.appendChild(columna);
            table.appendChild(fila);
        }
        document.getElementById("tableContenedor").appendChild(table);

        //Hacemos visible el botón y lso radio button

        boton.setAttribute("type", "button");
        radioButton.setAttribute("style", "visibility:visible");
    } else {
        boton.setAttribute("type", "hidden");
        radioButton.setAttribute("style", "visibility:hidden");

    }
    
}
/*
Método al que se llama cuando clickamos en guardar
*/
function compruebaErrores() {
    var tabla = document.getElementsByTagName("table")[0];
    var arrayInputs = tabla.getElementsByTagName("input");
    var estaBien = true;
    for (i = 0; i < arrayInputs.length; i++) {
        if (arrayInputs[i].value == "" || arrayInputs[i].value < 0 || arrayInputs[i].value > 10) {
            arrayInputs[i].setAttribute("style", "background-color:red");
            estaBien = false;
        } else {
            arrayInputs[i].setAttribute("style", "background-color:white");
        }
    }
    if (estaBien) {
        alert("Todo correcto");
    } else {
        alert("Algún dato es incorrecto");
    }
}

/*
Método al que se llama cuando pinchamos en el radiobutton de raton
*/
function clickRaton() {
    var contenedorNumeros = document.getElementById("contenedorNumeros");
    contenedorNumeros.innerHTML = "";
    contenedorNumeros.setAttribute("style", "visibility:visible");

    var lista = document.createElement("select");
    lista.setAttribute("id", "lista");
    lista.setAttribute("onchange","numeroClickado()");
    var option;
    for (i = 0; i < 11; i++) {
        option = document.createElement("option");
        option.setAttribute("value", i);
        texto = document.createTextNode(i);
        option.appendChild(texto);
        lista.appendChild(option);
    }
    contenedorNumeros.appendChild(lista);

    var tabla = document.getElementsByTagName("table")[0];
    var arrayInputs = tabla.getElementsByTagName("input");
    var estaBien = true;
    for (i = 0; i < arrayInputs.length; i++) {
        arrayInputs[i].setAttribute("readonly", "readonly");
        arrayInputs[i].addEventListener("focus", ponNota);
    }
}

/*
Método al que se llama cuando pinchamos en el radiobutton de teclado
*/
function clickTeclado() {
    var contenedorNumeros = document.getElementById("contenedorNumeros");
    contenedorNumeros.setAttribute("style", "visibility:hidden");
    var tabla = document.getElementsByTagName("table")[0];
    var arrayInputs = tabla.getElementsByTagName("input");
    var estaBien = true;
    for (i = 0; i < arrayInputs.length; i++) {
        arrayInputs[i].removeAttribute("readonly");
    }
}

/*
Método que usamos para guardar en una variable global el número que vamos a poner en las diferentes celdas de notas
*/
function numeroClickado() {
    numeroClick = document.getElementById("lista").value;
}

function ponNota() {
    this.value = numeroClick;
}