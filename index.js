const express = require("express")
const app = express()

persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/api/persons", (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    if (!persons.some(person => person.id == id)){
        return response.status(404).end()
    }

    const person = persons.find(person => person.id == id)
    response.json(person)
})


app.get("/info", (request, response) => {
    const arrayLength = persons.length
    const date = Date()

    response.send(
        "<div>Phonebook has info for " + arrayLength + " people</div>"
        + "<div>" + date + "</div"
    )
})



const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})