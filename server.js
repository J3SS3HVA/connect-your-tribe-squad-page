// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Stel het basis endpoint in
const apiUrl = 'https://fdnd.directus.app/items'

// Haal alle squads uit de WHOIS API op
const squadData = await fetchJson(apiUrl + '/squad')
const everyone = await fetchJson(apiUrl + '/person/')

// Maak een nieuwe express app aan
const app = express()

// Array voor de messages
const messages = [];

// Stel ejs in als template engine
app.set('view engine', 'ejs')
app.set('views', './views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

// 1. Routes die HTTP Requests en Responses afhandelen

// 1.1. Maak een GET route voor de index
app.get('/', async function (request, response) {
  // Haal alle personen uit de WHOIS API op
  const apiData = await fetchJson(apiUrl + '/person/')
  const persons = apiData.data;

  // Render index.ejs uit de views map en geef de opgehaalde data mee als variabele, genaamd persons
  response.render('index', { persons, squads: squadData.data })
})

// 1.2. Maak een GET route voor de person
app.get('/person/:id', async function (request, response) {
  try {
    // Gebruik de request parameter id en haal de juiste persoon uit de WHOIS API op
    const apiData = await fetchJson(apiUrl + '/person/' + request.params.id);
    const person = apiData.data;

    // Render person.ejs uit de views map en geef de opgehaalde data mee als variable, genaamd person
    response.render('person', { person, squads: squadData.data, messages }); // voeg 'messages' hier toe
  } catch (error) {
    console.error('Error fetching person data:', error);
    response.status(500).send('Internal Server Error');
  }
})

// 1.3. Maak een POST route voor de person
app.post('/', function (request, response) {
  // Er is nog geen afhandeling van POST, redirect naar GET op /
  const id = request.body.id;
  const bericht = request.body.bericht;

  // Voeg het bericht toe aan de messages array
  messages.push(bericht);

  // Redirect naar de GET route voor de specifieke persoon met het bijgewerkte bericht
  response.redirect(303, '/person/' + id);
})

// 2. Start de webserver

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})
