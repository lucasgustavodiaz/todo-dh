// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.
if (!localStorage.jwt) {
  location.replace('./')
}

/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener('load', function () {
  /* ---------------- variables globales y llamado a funciones ---------------- */
  const jwt = JSON.parse(localStorage.jwt)
  const btnCerrarSesion = document.querySelector('#closeApp')
  const formCrearTarea = document.forms[0]
  const nombreUsuario = document.querySelector('.user-info p')
  const task = document.querySelector('#nuevaTarea')
  const url = 'http://todo-api.ctd.academy:3000/v1'

  obtenerNombreUsuario()
  consultarTareas()

  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

  btnCerrarSesion.addEventListener('click', function () {
    localStorage.removeItem('jwt')
    location.replace('./index.html')
  })

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */

  function obtenerNombreUsuario() {
    const settings = {
      method: 'GET',
      headers: {
        Authorization: jwt
      }
    }
    fetch(`${url}/users/getMe`, settings)
      .then(response => {
        if (response.ok != true) {
          alert('Algo malió sal.')
        }
        return response.json()
      })
      .then(data => {
        console.log(data)
        nombreUsuario.innerHTML = data.firstName
      })
      .catch(error => {
        console.log(error)
      })
  }

  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  function consultarTareas() {
    fetch(`${url}/tasks`, {
      method: 'GET',
      headers: { Authorization: jwt }
    })
      .then(response => {
        if (response.ok != true) {
          alert('Algo malió sal.')
        }
        return response.json()
      })
      .then(data => {
        console.log('cantidad de tareas')
        console.log(data)
        renderizarTareas(data)
        botonesCambioEstado()
        botonBorrarTarea()
      })
      .catch(error => {
        console.log(error)
      })
  }

  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  formCrearTarea.addEventListener('submit', function (event) {
    event.preventDefault()

    const payload = {
      description: task.value,
      completed: false
    }

    const settings = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        Authorization: jwt
      }
    }

    if (validarTexto(task.value)) {
      fetch(`${url}/tasks`, settings)
        .then(response => {
          if (response.ok != true) {
            alert('Algo malió sal.')
          }
          return response.json()
        })
        .then(data => {
          console.log(data)
          formCrearTarea.reset()
          consultarTareas()
        })
        .catch(error => {
          console.log(error)
        })
    } else {
      alert('Ingrese el nombre de la nueva tarea')
    }
  })

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(listado) {
    let countEndTasks = 0
    const cantFinalizadas = document.querySelector('#cantidad-finalizadas')
    const pendingTask = document.querySelector('.tareas-pendientes')
    const endTask = document.querySelector('.tareas-terminadas')
    pendingTask.innerHTML = ''
    endTask.innerHTML = ''

    listado.forEach(tarea => {
      let fecha = new Date(tarea.createdAt)

      if (tarea.completed) {
        countEndTasks += 1
        endTask.innerHTML += `
          <li class="tarea">
            <div class="hecha">
              <i class="fa-regular fa-circle-check"></i>
            </div>
            <div class="descripcion">
              <p class="nombre">${tarea.description}</p>
              <div class="cambios-estados">
                <button class="change completa" id="${tarea.id}"> <i class="fa-solid fa-rotate-left"></i></button>
                <button class="borrar" id="${tarea.id}"> <i class="fa-regular fa-trash-can"></i></button>
              </div>
            </div>
          </li>
        `
      } else {
        pendingTask.innerHTML += `
          <li class="tarea">
            <button class="change" id="${
              tarea.id
            }"><i class="fa-regular fa-circle"></i></button>
            <div class="descripcion">
              <p class="nombre">${tarea.description}</p>
              <p class="timestamp">${fecha.toLocaleDateString()}</p> 
            </div>
          </li>
        `
      }
    })

    cantFinalizadas.innerHTML = countEndTasks
  }

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado() {
    const btnCambiarEstado = document.querySelectorAll('.change')

    btnCambiarEstado.forEach(btn => {
      btn.addEventListener('click', function (event) {
        //segun el tipo de boton que fue clickeado, cambiamos el estado de la tarea
        const payload = {}

        if (event.target.classList.contains('completa')) {
          // si está completada, la paso a pendiente
          payload.completed = false
        } else {
          // sino, está pendiente, la paso a completada
          payload.completed = true
        }

        const settings = {
          method: 'PUT',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
            Authorization: jwt
          }
        }

        fetch(`${url}/tasks/${event.target.id}`, settings)
          .then(response => {
            if (response.ok != true) {
              alert('Algo malió sal.')
            }
            return response.json()
          })
          .then(data => {
            console.log(data)
            consultarTareas()
          })
      })
    })
  }

  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea() {
    const btnBorrarTarea = document.querySelectorAll('.borrar')

    btnBorrarTarea.forEach(btn => {
      btn.addEventListener('click', function (event) {
        const settings = {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: jwt
          }
        }
        fetch(`${url}/tasks/${event.target.id}`, settings)
          .then(response => {
            if (response.ok != true) {
              alert('Algo malió sal.')
            }
            return response.json()
          })
          .then(data => {
            console.log(data)
            consultarTareas()
          })
      })
    })
  }
})
