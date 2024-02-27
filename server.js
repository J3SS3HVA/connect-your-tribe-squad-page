// 1. opzetten van web server 

// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Stel het basis endpoint in
const apiUrl = 'https://fdnd.directus.app/items'

// Haal alle squads uit de WHOIS API op
const squadData = await fetchJson(apiUrl + '/squad')
// const data = await fetchJson('https://fdnd.directus.app/items/person/15') // { data } 
// data.data.custom = JSON.parse(data.data.custom)

// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'))

// 2. routes die HTTP Requests en Responses afhandelen

// Maak een GET route voor de index
// stap 1
app.get('/', function (request, response) {
  // Haal alle personen uit de WHOIS API op
  // stap 2
  fetchJson(apiUrl + '/person/').then((apiData) => {
    // apiData bevat gegevens van alle personen uit alle squads
    // Je zou dat hier kunnen filteren, sorteren, of zelfs aanpassen, voordat je het doorgeeft aan de view

    // stap 3
    // Render index.ejs uit de views map en geef de opgehaalde data mee als variabele, genaamd persons

    // stap 4
    // Html maken op basis van JSON data
    response.render('index', {persons: apiData.data, squads: squadData.data})
  })
})

const messages = []
app.get('/person/:id', function (request, response) {
  fetchJson('https://fdnd.directus.app/items/person/' + request.params.id)
      .then((apiData) => {

        if (apiData.data) {
          let info = apiData.data;
          response.render('person', {person: info, squads: squadData.data, messages: messages});


        } else {
          // console.log('No data found for person with id: ' + request.params.id);
        }
      })
      .catch((error) => {
        // console.error('Error fetching person data:', error);
      });
});

// Maak een POST route voor de person
app.post('/', function (request, response) {
  // Er is nog geen afhandeling van POST, redirect naar GET op /
  messages.push(request.body.bericht)
  // gebruik maken van person variable omdat er anders weer undefined staat
  const person = everyone.data;
  response.redirect('/person/' + person.id);


})
// 3. start de webserver
// Maak een GET route voor een detailpagina met een request parameter id
app.get('/person/:id', function (request, response) {
  // Gebruik de request parameter id en haal de juiste persoon uit de WHOIS API op
  fetchJson(apiUrl + '/person/' + request.params.id).then((apiData) => {
    // Render person.ejs uit de views map en geef de opgehaalde data mee als variable, genaamd person
    response.render('person', {person: apiData.data, squads: squadData.data})
  })
})

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})


