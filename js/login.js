document.addEventListener('DOMContentLoaded', function () {
    var registerModal = document.getElementById("registerModal");
    var loginModal = document.getElementById("loginModal");
    var verificarModal = document.getElementById("VerificarModal");

    var openRegisterBtn = document.getElementById("openRegister");
    var openLoginBtn = document.getElementById("openLogin");
    var openVerificarBtn = document.getElementById("openVerficar");
    var openLoginFromRegisterBtn = document.getElementById("openLoginFromRegister");
    var openRegisterFromLoginBtn = document.getElementById("openRegisterFromLogin");
    var openLoginFromVerificarBtn = document.getElementById("openLoginFromVerificar");
    var openVerifivarFromLoginBtn = document.getElementById("openVerificarFromLogin");

    var closeRegisterBtn = document.getElementById("closeRegister");
    var closeLoginBtn = document.getElementById("closeLogin");
    var closeVerificarBtn = document.getElementById("closeVerificar");

    // Abre el modal de registro
    openRegisterBtn.onclick = function () {
        registerModal.style.display = "block";
    }

    // Abre el modal de login
    openLoginBtn.onclick = function () {
        loginModal.style.display = "block";
    }

    // Abre el modal de verificación
    openVerificarBtn.onclick = function () {
        verificarModal.style.display = "block";
    }

    // Abre el modal de login desde el formulario de registro
    openLoginFromRegisterBtn.onclick = function () {
        registerModal.style.display = "none";
        loginModal.style.display = "block";
    }

    // Abre el modal de login desde el formulario de verificación
    openLoginFromVerificarBtn.onclick = function () {
        verificarModal.style.display = "none";
        loginModal.style.display = "block";
    }

    // Abre el modal de registro desde el formulario de login
    openRegisterFromLoginBtn.onclick = function () {
        loginModal.style.display = "none";
        registerModal.style.display = "block";
    }
    // Abre el modal de verificación desde el formulario de login
    openVerifivarFromLoginBtn.onclick = function () {
        loginModal.style.display = "none";
        verificarModal.style.display = "block";
    }


    // Cierra el modal de registro
    closeRegisterBtn.onclick = function () {
        registerModal.style.display = "none";
    }

    // Cierra el modal de login
    closeLoginBtn.onclick = function () {
        loginModal.style.display = "none";
    }

    // Cierra el modal de verificación
    closeVerificarBtn.onclick = function () {
        verificarModal.style.display = "none";
    }

    // Cierra los modales si se hace clic fuera del contenido
    window.onclick = function (event) {
        if (event.target == registerModal) {
            registerModal.style.display = "none";
        }
        if (event.target == loginModal) {
            loginModal.style.display = "none";
        }
        if (event.target == verificarModal) {
            verificarModal.style.display = "none";
        }
    }

    // Maneja el envío del formulario de registro
    document.getElementById("registerForm").addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent default form submission
    
        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true; // Deshabilitar el botón de envío
    
        const nombre = document.getElementById("nombre").value;
        const correo = document.getElementById("correo").value;
        const clave = document.getElementById("clave").value;
    
        // Agregar log para verificar los datos del formulario
        console.log('Registro:', { nombre, correo, clave });
    
        // Construir la URL con los parámetros
        const url = `https://gmingenieros.somee.com/api/toDo/RegistrarseTodoList/${encodeURIComponent(nombre)}/${encodeURIComponent(correo)}/${encodeURIComponent(clave)}`;
    
        fetch(url, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta del servidor:', data); // Agregar log para la respuesta del servidor
    
            const messageContainer = document.getElementById("registerMessage");
            if (data.isSuccess) {
                messageContainer.innerHTML = '<span class="success">Registro exitoso</span>';
                setTimeout(() => {
                    registerModal.style.display = "none";
                    loginModal.style.display = "flex";
                }, 500);
            } else {
                messageContainer.innerHTML = `<span class="error">${data.message}</span>`;
            }
        })
        .catch((error) => {
            console.error('Error:', error); // Agregar log para errores
            document.getElementById("registerMessage").innerHTML = '<span class="error">Error en el registro</span>';
        })
        .finally(() => {
            submitButton.disabled = false; // Habilitar el botón de envío nuevamente
        });
    });
    
      
    // Maneja el envío del formulario de login
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
    
        const correo = document.getElementById('correoLogin').value;
        const clave = document.getElementById('claveLogin').value;
    
        const url = `https://gmingenieros.somee.com/api/toDo/Login/${encodeURIComponent(correo)}/${encodeURIComponent(clave)}`;
    
        fetch(url, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.isSuccess) {
                // Guardar el token y el ID de usuario en cookies
                document.cookie = `token=${data.token}; path=/`;
                document.cookie = `idusuario=${data.userId}; path=/`;
                window.location.href = 'listado.html'; // Redirigir a la otra página
            } else {
                document.getElementById("loginMessage").innerHTML = `<span class="error">${data.message}</span>`;
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            document.getElementById("loginMessage").innerHTML = '<span class="error">Error en el inicio de sesión</span>';
        });
    });
    
    
    

    // Maneja el envío del formulario de verificación de correo
    document.getElementById("VerificarForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const correo = document.getElementById("correoVerificar").value;
        const codigo = document.getElementById("codigoVerificar").value;

        // Construir la URL con los parámetros
        const url = `https://gmingenieros.somee.com/api/toDo/VerificarCorreo?correo=${encodeURIComponent(correo)}&codigo=${encodeURIComponent(codigo)}`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                const messageContainer = document.getElementById("verificarMessage");
                if (data.isSuccess) {
                    messageContainer.innerHTML = '<span class="success">Correo verificado exitosamente</span>';
                    // Cerrar el modal de verificación y abrir el modal de login
                    setTimeout(() => {
                        verificarModal.style.display = "none";
                        loginModal.style.display = "flex";
                    }, 500);  // Esperar un segundo para que el mensaje se muestre
                } else {
                    messageContainer.innerHTML = `<span class="error">${data.message}</span>`;
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                document.getElementById("verificarMessage").innerHTML = '<span class="error">Error en la verificación del correo</span>';
            });
    });
});
