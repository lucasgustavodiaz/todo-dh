if (localStorage.jwt) {
  location.replace('./mis-tareas.html')
}

window.addEventListener('load', function () {
  /* ---------------------- obtenemos variables globales ---------------------- */
  const form = document.forms[0]
  const firstName = document.getElementById('inputNombre')
  const lastName = document.getElementById('inputApellido')
  const email = document.getElementById('inputEmail')
  const password = document.getElementById('inputPassword')
  const passwordRepeat = document.getElementById('inputPasswordRepetida')
  const url = 'http://todo-api.ctd.academy:3000/v1'

  /* -------------------------------------------------------------------------- */
  /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
  /* -------------------------------------------------------------------------- */
  form.addEventListener('submit', function (event) {
    event.preventDefault()

    const payload = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: normalizarEmail(email.value),
      password: password.value
    }

    const settings = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    }

    if (
      validarTexto(firstName.value) &&
      validarTexto(lastName.value) &&
      validarEmail(email.value) &&
      validarTexto(password.value) &&
      compararContrasenias(password.value, passwordRepeat.value)
    ) {
      realizarRegister(settings)
      form.reset()
    } else {
      alert('Complete los campos correctamente')
    }
  })

  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
  /* -------------------------------------------------------------------------- */
  function realizarRegister(settings) {
    fetch(`${url}/users`, settings)
      .then(response => {
        if (response.ok != true) {
          alert('Algo malió sal.')
        }
        return response.json()
      })
      .then(data => {
        if (data.jwt) {
          localStorage.setItem('jwt', JSON.stringify(data.jwt))
          location.replace('./mis-tareas.html')
        }
      })
      .catch(error => {
        console.log('Promesa rechazada')
        console.log(error)
      })
  }
})
