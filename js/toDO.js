function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) {
            const cookieValue = decodeURIComponent(c.substring(nameEQ.length));
            
            return cookieValue;
        }
    }
    console.log(`Cookie no encontrada - Nombre: ${name}`);
    return null;
}

document.addEventListener('DOMContentLoaded', () => {
    
    // Obtener el token y el ID de usuario desde las cookies
    const token = getCookie('token');
    const userId = getCookie('idusuario');

    if (!token || !userId) {
        console.error('Token o ID de usuario no encontrados en las cookies.');
        return;
    }

    // Imprimir los valores en la consola para verificar
    console.log('Token:', token);
    console.log('UserId:', userId);

    // Manejar el envío del formulario de agregar tarea
    document.getElementById('agregar-tarea-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const tarea = document.getElementById('nueva-tarea').value;
        const completado = document.getElementById('nueva-tarea-completado').checked;
        agregarTarea(tarea, completado);
    });

    // Función para actualizar la lista de tareas
    function actualizarListaTareas() {
        fetch(`https://localhost:7085/api/toDo/Obtener_Las_Tareas/${userId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const tablaBody = document.getElementById('tabla-body');
            tablaBody.innerHTML = ''; // Limpiar la tabla antes de volver a llenarla
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.tareaId}</td>
                    <td>
                        <input maxlength="69" type="text" value="${item.tarea}" data-id="${item.tareaId}" class="editable-tarea" />
                    </td>
                    <td>
                        <input class="estado" type="checkbox" ${item.completado ? 'checked' : ''} onchange="updateEstado(${item.tareaId}, this.checked)" />
                    </td>
                    <td>
                        <button class="btneliminar" onclick="eliminarTarea(${item.tareaId})">Eliminar</button>                   
                    </td>`
                    ;
                tablaBody.appendChild(row);
            });

            // Inicializar eventos después de agregar las tareas
            initEditableTareas();
        })
        .catch(error => console.error('Error al obtener los datos:', error));
    }

    // Llamar a la función para actualizar la lista de tareas al cargar la página
    actualizarListaTareas();

    // Función para actualizar el estado de una tarea
    window.updateEstado = function(id, completado) {
        fetch(`https://localhost:7085/api/toDo/ActualizarEstadoTarea/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completado })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al actualizar el estado');
            }
            return response.text(); // Leer como texto para evitar problemas de JSON vacío
        })
        .then(text => {
            // Intentar parsear la respuesta como JSON
            try {
                const data = text ? JSON.parse(text) : {};
                console.log('Estado actualizado:', data);
            } catch (error) {
                console.log('Estado actualizado pero sin cuerpo de respuesta JSON');
            }
        })
        .catch(error => console.error('Hubo un problema con la solicitud:', error));
    };

    // Función para inicializar campos de tareas editables
    function initEditableTareas() {
        document.querySelectorAll('.editable-tarea').forEach(input => {
            input.addEventListener('blur', function() {
                const id = this.getAttribute('data-id');
                const tarea = this.value;
                updateTarea(id, tarea);
            });
        });
    }

    // Función para actualizar una tarea
    function updateTarea(id, tarea) {
        fetch(`https://localhost:7085/api/toDo/Actualizar_Tarea/${id}/${encodeURIComponent(tarea)}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al actualizar la tarea');
            }
            return response.text(); // Leer como texto para evitar problemas de JSON vacío
        })
        .then(text => {
            // Intentar parsear la respuesta como JSON
            try {
                const data = text ? JSON.parse(text) : {};
                console.log('Tarea actualizada:', data);
            } catch (error) {
                console.log('Tarea actualizada pero sin cuerpo de respuesta JSON');
            }
        })
        .catch(error => console.error('Error al actualizar la tarea:', error));
    }

    // Función para agregar una tarea
    function agregarTarea(tarea, completado) {
        fetch(`https://localhost:7085/api/toDo/Agregar_Tarea/${encodeURIComponent(tarea)}/${completado}/${userId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al agregar la tarea');
            }
            return response.text(); // Leer como texto para evitar problemas de JSON vacío
        })
        .then(text => {
            if (text) {
                try {
                    const data = JSON.parse(text);
                    console.log('Tarea agregada:', data);
                } catch (error) {
                    console.log('Error al parsear la respuesta JSON:', error);
                }
            } else {
                console.log('Tarea agregada, pero la respuesta está vacía.');
            }
            // Limpiar el formulario
            document.getElementById('nueva-tarea').value = '';
            document.getElementById('nueva-tarea-completado').checked = false;
            // Actualizar la lista de tareas
            actualizarListaTareas();
        })
        .catch(error => console.error('Error al agregar la tarea:', error));
    }
    
    window.eliminarTarea =function (id) {
        fetch(`https://localhost:7085/api/toDo/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar la tarea');
            }
            console.log('Tarea eliminada con éxito');
            // Actualizar la lista de tareas después de la eliminación
            actualizarListaTareas();
        })
        .catch(error => console.error('Error al eliminar la tarea:', error));
    }
});
function autoExpandInput(input) {
    input.style.height = 'auto'; // Resetea la altura para medir el nuevo tamaño
    input.style.height = `${input.scrollHeight}px`; // Ajusta la altura al tamaño del contenido
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.editable-tarea').forEach(input => {
        input.addEventListener('input', () => autoExpandInput(input));
        // Ajusta el tamaño al cargar la lista
        autoExpandInput(input);
    });
});



