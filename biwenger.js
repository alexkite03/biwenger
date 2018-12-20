$(document).ready(function () {
    do {
        //Alerta para Authorization
        var token = prompt("Por favor, inserta tu Bearer");
        //Alerta para x-league
        var xleague = prompt("Por favor, inserta tu x-league");
        //Alerta para dinero inicial
        var abonoinicial = prompt("Por favor, inserta el dinero inicial de tu liga");
    }
    while (token == '' || xleague == '' || abonoinicial == '');
    $.when(
        //Llamada API para obtener las ventas de los jugadores
        $.ajax({
            url: "https://cors-anywhere.herokuapp.com/https://biwenger.as.com/api/v2/league/board?type=transfer&limit=200",
            headers: {
                'Authorization': 'Bearer ' + token,
                'x-league': xleague,
                'Accept': 'application/json',
            },
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                ventas(data);
            }
        }),
        //Llamada API para obtener las compras de los jugadores
        $.ajax({
            url: "https://cors-anywhere.herokuapp.com/https://biwenger.as.com/api/v2/league/board?type=market&limit=200",
            headers: {
                'Authorization': 'Bearer ' + token,
                'x-league': xleague,
                'Accept': 'application/json',
            },
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                compras(data);
            }
        }),
        //Llamada API para obtener los abonos al finalizar jornada
        $.ajax({
            url: "https://cors-anywhere.herokuapp.com/https://biwenger.as.com/api/v2/league/board?type=roundFinished&limit=38",
            headers: {
                'Authorization': 'Bearer ' + token,
                'x-league': xleague,
                'Accept': 'application/json',
            },
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                abonos(data);
            }
        }),

        //Llamada API para obtener las penalizaciones y abonos realizadas por administradores
        $.ajax({
            url: "https://cors-anywhere.herokuapp.com/https://biwenger.as.com/api/v2/league/board?type=bonus&limit=200",
            headers: {
                'Authorization': 'Bearer ' + token,
                'x-league': xleague,
                'Accept': 'application/json',
            },
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                bonus(data);
            }
        }),

        //Llamada API para obtener el valor de equipo
        $.ajax({
            url: "https://cors-anywhere.herokuapp.com/https://biwenger.as.com/api/v2/league?fields=*,standings,group(id,name)&include=all,-lastAccess",
            headers: {
                'Authorization': 'Bearer ' + token,
                'x-league': xleague,
                'Accept': 'application/json',
            },
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                valor(data);
            }
        })

    ).then(function calculototal() {
        //console.log (totalcompras);
        //console.log (totalventas);

        arraydef = [];
        for (var i = 0; i < totalvalor.length; i++) {
            arraydef.push([]);
        }

        // Recorrer valor que es fijo para añadir los nombres de los usuarios y su valor
        for (var t = 0; t < totalvalor.length; t++) {
            arraydef[t]["nombre"] = totalvalor[t].nombre;
            arraydef[t]["valor"] = totalvalor[t].cantidad;
            // Bucle para meter las compras
            if (totalcompras.length == 0) {
                arraydef[t]["compras"] = parseInt(0);
             }
            else {
                for (var u = 0; u < totalcompras.length; u++) {
                    // Buscamos las compras del usuario.
                    if (arraydef[t]["nombre"] == totalcompras[u].nombre) {
                        arraydef[t]["compras"] = totalcompras[u].cantidad;
                    }
                }
            }
            //Bucle para meter los abonos
            if (totalabonos.length == 0) {
                arraydef[t]["abonos"] = parseInt(0);
            }
            else {
                for (var u = 0; u < totalabonos.length; u++) {
                    // Buscamos el abono del usuario.
                    if (arraydef[t]["nombre"] == totalabonos[u].nombre) {
                        arraydef[t]["abonos"] = totalabonos[u].cantidad;
                    }
                }
            }
            //Bucle para meter los bonus
            if (totalbonus.length == 0) {
                arraydef[t]["bonus"] = parseInt(0);
            } else {
                for (var u = 0; u < totalbonus.length; u++) {
                    // Buscamos los bonus del usuario.
                    if (arraydef[t]["nombre"] == totalbonus[u].nombre) {
                        arraydef[t]["bonus"] = totalbonus[u].cantidad;
                    }
                }
            }
            //Bucle para meter las ventas
            if (totalventas.length == 0) {
                arraydef[t]["ventas"] = parseInt(0);
            }
            else {
                for (var u = 0; u < totalventas.length; u++) {
                    // Buscamos el valor del usuario.
                    if (arraydef[t]["nombre"] == totalventas[u].nombre) {
                        arraydef[t]["ventas"] = totalventas[u].cantidad;
                    }
                }
            }
        }

        console.log(arraydef);

        for (var u = 0; u < arraydef.length; u++) {
            // Realizamos calculos:
            var dinerofinal = parseInt(abonoinicial) + parseInt(arraydef[u]["ventas"]) +
                parseInt(arraydef[u]["abonos"]) + parseInt(arraydef[u]["bonus"]) - parseInt(
                    arraydef[u]["compras"]);
            var pre = parseInt(arraydef[u]["valor"]);
            var division = 4;
            var arr = parseInt(pre) / parseInt(division);
            var pujamaxima = parseInt(arr) + parseInt(dinerofinal);
            //console.log('El jugador: ' + arraydef[u]["nombre"] + ' tiene en total: ' + dinerofinal + ' y una puja máxima de: ' + pujamaxima);
            // Mandamos imprimir
			$("p.carga").remove();
            $("p.dinero").append('El jugador: ' + arraydef[u]["nombre"] + ' tiene en total: ' +
                dinerofinal + ' € y una puja máxima de: ' + pujamaxima + ' € <br>');

        }
    });

});

//Declaracion de variables
var totalventas = [];
var totalcompras = [];
var totalabonos = [];
var totalbonus = [];
var totalvalor = [];

function ventas(datos) {
    //Funcion para leer las ventas
    var arrtt = [];
    for (var i = 0; i < datos.data.length; i++) {
        for (var o = 0; o < datos.data[i].content.length; o++) {
            // Almacenar usuarios en un array.
            if (datos.data[i].content[o].from.name == "Usuario") {

            } else {
                arrtt.push(datos.data[i].content[o].from.name);
            }
        }
    }

    // Recorrer el array de usuario limpio e ir sumando las cantidades por usuario.
    var arrttLimpio = arrtt.filter(function (item, index, array) {
        return array.indexOf(item) === index;
    })

    //arrttLimpio -> Array con todos los nombres

    for (var t = 0; t < arrttLimpio.length; t++) {
        var nombre = arrttLimpio[t];
        arrttLimpio[t] = new Array(0);
        arrttLimpio[t]["nombre"] = nombre;
        arrttLimpio[t]["cantidad"] = parseInt(0);
    }
    for (var i = 0; i < datos.data.length; i++) {
        for (var o = 0; o < datos.data[i].content.length; o++) {
            var nombre = datos.data[i].content[o].from.name;
            if (nombre == "Usuario") {} else {
                for (var t = 0; t < arrttLimpio.length; t++) {
                    if (arrttLimpio[t]["nombre"] == nombre) {
                        arrttLimpio[t]["cantidad"] += parseInt(datos.data[i].content[o].amount);
                    }
                }
            }
        }
    }
    //console.log(arrttLimpio);
    totalventas = arrttLimpio.sort();
}

function compras(datos) {
    //Funcion para leer las compras
    var arrtt = [];
    for (var i = 0; i < datos.data.length; i++) {
        for (var o = 0; o < datos.data[i].content.length; o++) {
            // Almacenar usuarios en un array.
            if (datos.data[i].content[o].to.name == "Usuario") {

            } else {
                arrtt.push(datos.data[i].content[o].to.name);
            }
        }
    }

    // Recorrer el array de usuario limpio e ir sumando las cantidades por usuario.
    var arrttLimpio = arrtt.filter(function (item, index, array) {
        return array.indexOf(item) === index;
    })
    for (var t = 0; t < arrttLimpio.length; t++) {
        var nombre = arrttLimpio[t];
        arrttLimpio[t] = new Array(0);
        arrttLimpio[t]["nombre"] = nombre;
        arrttLimpio[t]["cantidad"] = parseInt(0);
    }
    for (var i = 0; i < datos.data.length; i++) {
        for (var o = 0; o < datos.data[i].content.length; o++) {
            var nombre = datos.data[i].content[o].to.name;
            if (nombre == "Usuario") {} else {
                for (var t = 0; t < arrttLimpio.length; t++) {
                    if (arrttLimpio[t]["nombre"] == nombre) {
                        arrttLimpio[t]["cantidad"] += parseInt(datos.data[i].content[o].amount);
                    }
                }
            }
        }
    }
    //console.log(arrttLimpio);
    totalcompras = arrttLimpio.sort();
}

function abonos(datos) {
    //Funcion para leer los abonos al finalizar jornada     

    var arrtt = [];
    for (var i = 0; i < datos.data.length; i++) {
        for (var o = 0; o < datos.data[i].content.results.length; o++) {
            // Almacenar usuarios en un array.
            if (datos.data[i].content.results[o].user.name == "Usuario") {

            } else {
                arrtt.push(datos.data[i].content.results[o].user.name);
            }
        }
    }

    // Recorrer el array de usuario limpio e ir sumando las cantidades por usuario.
    var arrttLimpio = arrtt.filter(function (item, index, array) {
        return array.indexOf(item) === index;
    })
    for (var t = 0; t < arrttLimpio.length; t++) {
        var nombre = arrttLimpio[t];
        arrttLimpio[t] = new Array(0);
        arrttLimpio[t]["nombre"] = nombre;
        arrttLimpio[t]["cantidad"] = parseInt(0);
    }
    for (var i = 0; i < datos.data.length; i++) {
        for (var o = 0; o < datos.data[i].content.results.length; o++) {
            var nombre = datos.data[i].content.results[o].user.name;
            if (datos.data[i].content.results[o].bonus) {
                if (nombre == "Usuario") {} else {
                    for (var t = 0; t < arrttLimpio.length; t++) {
                        if (arrttLimpio[t]["nombre"] == nombre) {
                            arrttLimpio[t]["cantidad"] += parseInt(datos.data[i].content.results[o].bonus);
                        }
                    }
                }
            } else {}
        }
    }
    //console.log(arrttLimpio);
    totalabonos = arrttLimpio.sort();
}

function bonus(datos) {
    //Funcion para leer los bonus o penalizaciones de administracion   

    var arrtt = [];
    for (var i = 0; i < datos.data.length; i++) {
        for (var o = 0; o < datos.data[i].content.length; o++) {
            // Almacenar usuarios en un array.
            //If para evitar usuarios eliminados de la liga
            if (datos.data[i].content[o].user.name == "Usuario") {} else {
                arrtt.push(datos.data[i].content[o].user.name);
            }
        }
    }

    // Recorrer el array de usuario limpio e ir sumando las cantidades por usuario.
    var arrttLimpio = arrtt.filter(function (item, index, array) {
        return array.indexOf(item) === index;
    })
    for (var t = 0; t < arrttLimpio.length; t++) {
        var nombre = arrttLimpio[t];
        arrttLimpio[t] = new Array(0);
        arrttLimpio[t]["nombre"] = nombre;
        arrttLimpio[t]["cantidad"] = parseInt(0);
    }
    for (var i = 0; i < datos.data.length; i++) {
        for (var o = 0; o < datos.data[i].content.length; o++) {
            var nombre = datos.data[i].content[o].user.name;
            if (datos.data[i].content[o].amount) {
                if (nombre == "Usuario") {} else {
                    for (var t = 0; t < arrttLimpio.length; t++) {
                        if (arrttLimpio[t]["nombre"] == nombre) {
                            arrttLimpio[t]["cantidad"] += parseInt(datos.data[i].content[o].amount);
                        }
                    }
                }
            } else {}
        }
    }
    //console.log(arrttLimpio);
    totalbonus = arrttLimpio.sort();
}

function valor(datos) {
    //Funcion para leer valor de equipo  

    var arrtt = [];
    for (var i = 0; i < datos.data.standings.length; i++) {
        // Almacenar usuarios en un array.
        //If para evitar usuarios eliminados de la liga
        if (datos.data.standings[i].name == "Usuario") {} else {
            arrtt.push(datos.data.standings[i].name);
        }
    }

    // Recorrer el array de usuario limpio e ir sumando las cantidades por usuario.
    var arrttLimpio = arrtt.filter(function (item, index, array) {
        return array.indexOf(item) === index;
    })
    for (var t = 0; t < arrttLimpio.length; t++) {
        var nombre = arrttLimpio[t];
        arrttLimpio[t] = new Array(0);
        arrttLimpio[t]["nombre"] = nombre;
        arrttLimpio[t]["cantidad"] = parseInt(0);
    }
    for (var i = 0; i < datos.data.standings.length; i++) {

        var nombre = datos.data.standings[i].name;
        if (datos.data.standings[i].name) {
            if (nombre == "Usuario") {} else {
                for (var t = 0; t < arrttLimpio.length; t++) {
                    if (arrttLimpio[t]["nombre"] == nombre) {
                        arrttLimpio[t]["cantidad"] += parseInt(datos.data.standings[i].teamValue);
                    }
                }
            }
        } else {}

    }
    //console.log(arrttLimpio);
    totalvalor = arrttLimpio.sort();
}