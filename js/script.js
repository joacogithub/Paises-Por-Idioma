document.querySelector('#btnSearch').addEventListener('click', searchByLanguage)

document.querySelector('#txtSearch').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    searchByLanguage()
  }
})

function searchByLanguage() {
  let searchQuery = document.querySelector('#txtSearch').value
  const container = document.querySelector('#divContainer')

  container.innerHTML = ''

  fetch(`https://restcountries.com/v3.1/lang/${searchQuery}`)
    .then(response => response.json())
    .then(data => {
      data.forEach(element => {
        const countryName = element.name.common
        const officialCountryName = element.name.official
        const capital = element.capital

        const isIndependent = element.independent

        const currencies = element.currencies
        let currencyText = ''

        for (const currencyCode in currencies) {
          if (currencies.hasOwnProperty(currencyCode)) {
            let currency = currencies[currencyCode]
            let currencyName = currency.name
            let currencySymbol = currency.symbol

            currencyText += `
              Moneda: ${currencyName}, 
              Símbolo: ${currencySymbol} <br>
            `
          }
        }

        const divText = document.createElement('div')

        divText.innerHTML = `
        <h1>${countryName}</h1> 
        <h2>Nombre oficial: ${officialCountryName}</h2> 
        <h3>Capital: ${capital}</h3>
        <h4>Independiente: ${isIndependent ? 'Sí' : 'No'}</h4> 
        <h4>${currencyText}</h4> <br> <br>
        <hr>
        `

        container.appendChild(divText)
      })
    })
    .catch(error => {
      console.error(error)
      container.innerHTML = 'Error al obtener los datos, procura haber ingresado un idioma'
    })
}
