/* ---------------------------------- texto --------------------------------- */
function validarTexto(texto) {
  return texto.length >= 1
}

function normalizarTexto(texto) {
  const regex = /\s/g
  return texto.replace(regex, '')
}

/* ---------------------------------- email --------------------------------- */
function validarEmail(email) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  return regex.test(email)
}

function normalizarEmail(email) {
  return email.toLowerCase()
}

/* -------------------------------- password -------------------------------- */
function validarContrasenia(contrasenia) {
  return contrasenia.length >= 8
}

function compararContrasenias(contrasenia_1, contrasenia_2) {
  return contrasenia_1 === contrasenia_2
}
