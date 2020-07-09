const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('data', getid = (request) => {
	return JSON.stringify(request.body)
})

app.use(express.json())

app.use(express.static('build'))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
	{
		name: "Arto Hellas",
		number: "040-123456",
		id: 1
	},
	{
		name: "Ada Lovelace",
		number: "39-44-5323523",
		id: 2
	},
	{
		name: "Dan Abramov",
		number: "12-43-234345",
		id: 3
	},
	{
		name: "Mary Poppendieck",
		number: "39-23-6423122",
		id: 4
	}
]

app.get('/info', (request, response) => {
  response.send(
		`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
	)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	const person = persons.find(person => person.id === id)

	if(person) {
		response.json(person)
	} else {
		response.status(404).end()
	}
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
	const body = request.body
	
	if(!body.name) {
		return response.status(400).json({
			error: 'Name missing'
		})
	}

	if(!body.number) {
		return response.status(400).json({
			error: 'Number missing'
		})
	}

	if(persons.some(person => person.name === body.name)) {
		return response.status(400).json({
			error: 'Name must be unique'
		})
	}

	const person = {
		name: body.name,
		number: body.number,
		id: Math.floor(Math.random()*10000)
	}

	persons = persons.concat(person)
	response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})