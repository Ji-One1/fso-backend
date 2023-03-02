require('dotenv').config()
const express = require("express")
const morgan = require('morgan')
const Contact = require('./models/mongo')
const app = express()

app.use(express.json())
app.use(express.static('build'))

morgan.token('content',  function (req, res){
    if (!req.body.name){
        return 
    }
    return  `{"name": "${req.body.name}", "number": "${req.body.number}"}`

})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))




const generateId = () => {
    return Math.floor(Math.random() * 1000000000);
}


app.get("/api/persons", (request, response) => {
    Contact.find({}).then(result => response.json(result))

})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Contact.findById(id).then(contact => response.json(contact))
})


app.post('/api/persons', (request, response) => {
    const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  } else if (persons.some(person => person.name === body.name)){
    return response.status(400).json({ 
        error: 'name already in phonebook!' 
      })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)
  console.log(persons);
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()

})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})