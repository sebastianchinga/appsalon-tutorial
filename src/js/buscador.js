document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    buscarPorFecha();
}

function buscarPorFecha() {
    // Seleccionamos el input fecha
    const fechaInput = document.querySelector('#fecha');
    // Escuchamos ese input por el metodo input y le pasamos un callback
    fechaInput.addEventListener('input', function(e) { // Le pasamos el evento e
        // Leemos el valor seleccionado y la almacenamos en una variable
        const fechaSeleccionada = e.target.value;

        // Lo redirigimos a una URL get (la petición será get)
        window.location = `?fecha=${fechaSeleccionada}`;
    })
}