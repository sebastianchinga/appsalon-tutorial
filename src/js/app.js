let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    id: '', // Id del cliente
    nombre: '', // Nombre del cliente
    fecha: '', // Fecha de la cita
    hora: '', // Hora de la cita
    servicios: [] // Servicios
}

document.addEventListener('DOMContentLoaded', function () {
    iniciarApp();
})

function iniciarApp() {
    mostrarSeccion();
    tabs(); // Cambia la seccion cuando se presionen los tabs
    botonesPaginador(); // Agrega o quita los botones del paginador
    paginaSiguiente();
    paginaAnterior();

    consultarAPI();
    idCliente();
    nombreCliente(); // Añade el nombre del cliente al objeto de cita
    seleccionarFecha(); // Añade la fecha de la cita en el objeto cita
    seleccionarHora(); // Añade la hora de la cita en el objeto cita

    mostrarResumen(); // Muestra el resúmen de la cita
}

function mostrarSeccion() {

    // Ocultamos la seccion que tenga la clase .mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    const tabAnterior = document.querySelector('.actual');
    if (seccionAnterior, tabAnterior) {
        seccionAnterior.classList.remove('mostrar');
        tabAnterior.classList.remove('actual');
    }

    // Seleccionar la seccion con el paso
    const pasoSelector = `#paso-${paso}`; // Selecciono el id #paso- y el número que tengo en la variable let paso
    const seccion = document.querySelector(pasoSelector);

    seccion.classList.add('mostrar');

    // Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');
}

function tabs() {
    const botones = document.querySelectorAll('.tabs button');
    botones.forEach(boton => {
        boton.addEventListener('click', function (e) {
            paso = parseInt(e.target.dataset.paso);
            mostrarSeccion();
            botonesPaginador();
        })
    });
}

function botonesPaginador() {
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    if (paso === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }
    else if (paso === 3) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');
        mostrarResumen();
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function () {
        if (paso <= pasoInicial) return;
        paso--;
        botonesPaginador();
    })
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function () {
        if (paso >= pasoFinal) return;
        paso++;
        botonesPaginador();
    })
}

// async: Significa que la funcion se va a ejecutar y pueden arrancar otras funciones
// Tal vez se completen las otras funciones que nuestra función asincrona
async function consultarAPI() {

    try {
        // const url = `${location.origin}/api/servicios`; // URL que voy a consumir
        const url = '/api/servicios'; // URL que voy a consumir
        const resultado = await fetch(url); // fetch: Funcion que permite consumir el servicio de mi api || await: Detiene el código que sigue hasta que cargue toda la información
        const servicios = await resultado.json();
        mostrarServicios(servicios);

    } catch (error) {
        console.log(error);
    }

}

function mostrarServicios(servicios) {
    servicios.forEach(servicio => {
        const { id, nombre, precio } = servicio;

        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id; // Crear un atributo personalizado (data-)
        servicioDiv.onclick = function () {
            seleccionarServicio(servicio);
        };

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);
    })
}

function seleccionarServicio(servicio) {
    const { id } = servicio;
    // Extrayendo los servicios del objeto cita porque estamos escribiendo sobre el
    const { servicios } = cita;

    // Selecciono el servicio
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

    // Comprobar si un servicio ya fue agregado
    if (servicios.some(agregado => agregado.id === id)) {
        // Eliminarlo
        cita.servicios = servicios.filter(agregado => agregado.id !== id);
        divServicio.classList.remove('seleccionado');
    } else {
        // Traemos un nuevo arreglo (copia) de servicios (...servicios) y el servicio que se está recibiendo
        // se está agregando
        cita.servicios = [...servicios, servicio];
        divServicio.classList.add('seleccionado');
    }


    console.log(servicio);
}

function idCliente() {
    const id = document.querySelector('#id').value;
    cita.id = id;
}

function nombreCliente() {
    const cliente = document.querySelector('#nombre').value;
    cita.nombre = cliente;
}

function seleccionarFecha() {
    // Seleccionamos el input de fecha
    const inputFecha = document.querySelector('#fecha');
    // Le pasamos un evento input
    inputFecha.addEventListener('input', function (e) {
        const dia = new Date(e.target.value).getUTCDay();

        if ([0, 6].includes(dia)) {
            e.target.value = '';
            mostrarAlerta('Fines de semana no atendemos', 'error', '.formulario');
        } else {
            cita.fecha = e.target.value;
        }

    });

}

function seleccionarHora() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function (e) {
        const horaCita = e.target.value;
        // Separamos la hora y nos ubicamos en la posicion [0]
        const hora = horaCita.split(":")[0];

        // Validamos: Si la hora es menor a 10 o mayor a las 6
        if (hora < 10 || hora > 18) {
            // Reseteamos el input
            e.target.value = '';
            // Mostramos una alerta
            mostrarAlerta('Hora no válida', 'error', '.formulario');
        } else {
            // Agregamos la hora a nuestro objeto cita
            cita.hora = e.target.value;
        }
    });
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {
    // Previene que haya más de una alerta
    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia) {
        alertaPrevia.remove()
    };

    // Scripting para generar una alerta
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    // Mostrar alerta en el formulario
    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    if (desaparece) {
        // Eliminar alerta luego de 3 segundos
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }

}

function mostrarResumen() {
    const resumen = document.querySelector('.contenido-resumen');

    // Limpiar el contenido de Resúmen
    while (resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }

    if (Object.values(cita).includes('') || cita.servicios.length === 0) {
        mostrarAlerta('Faltan datos de Servicios, Fecha u Hora', 'error', '.contenido-resumen', false)
        return
    }

    // Formatear el div de Resúmen
    const { nombre, fecha, hora, servicios } = cita;

    // Heading
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resúmen de servicios';
    resumen.appendChild(headingServicios);

    // Iterando los servicios
    servicios.forEach(servicio => {
        // Destructuring 
        const { id, precio, nombre } = servicio

        // Creando elemento
        const contenedorServicio = document.createElement('DIV');
        // Agregando una clase
        contenedorServicio.classList.add('contenedor-servicio');

        // Creando un elemento
        const textoServicio = document.createElement('P');
        // Mostrando la información (nombre del servicio)
        textoServicio.textContent = nombre

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

        // Agregando nombre y precio del servicio dentro del contenedor
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio)
    });

    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resúmen de cita';
    resumen.appendChild(headingCita);

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

    // Formatear la fecha en español
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date(Date.UTC(year, mes, dia));

    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = fechaUTC.toLocaleDateString('es-MX', opciones);

    // Agregamos una fecha formateada
    const fechCita = document.createElement('P');
    fechCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora} horas`;

    // Botón para crear una cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechCita);
    resumen.appendChild(horaCita);
    resumen.appendChild(botonReservar)

}

async function reservarCita() {

    // Extraemos los datos del objeto cita
    const { nombre, fecha, hora, servicios, id } = cita

    // El map va a iterar los servicios, identifica el servicio.id y lo guarda en la variable servicioId
    const servicioId = servicios.map(servicio => servicio.id);
    // console.log(servicioId);

    // Creamos un objeto FormDATA
    const datos = new FormData();
    // La parte de la izquierda es como vamos acceder en la api
    datos.append('usuarioId', id); // Agregamos datos
    datos.append('fecha', fecha); // Agregamos datos
    datos.append('hora', hora); // Agregamos datos
    datos.append('servicios', servicioId); // Agregamos datos

    try {
        // Peticion hacia la api
        const url = '/api/citas';
        const respuesta = await fetch(url, { // Usamos await porque no sabemos cuanto va a demorar esa consulta
            method: 'POST',
            body: datos                      // Le pasamos la URL de la api y un objeto de configuracion, en este caso será
        })                                   // el método que se usará (POST)   

        const resultado = await respuesta.json();

        console.log(resultado);

        if (resultado.resultado) {
            Swal.fire({
                icon: "success",
                title: "Cita creada",
                text: "Tu cita fue creada correctamente",
                button: 'OK'
            }).then(() => {
                // Una vez presionamos el botón se redirigirá luego de 3 segundos
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            })
        }
        
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un error al guardar la cita",
        });
    }

    // console.log([...datos]);
}