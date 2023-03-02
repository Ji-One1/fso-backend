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

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }
  
app.use(errorHandler)




app.get("/api/persons", (request, response) => {
    Contact.find({})
        .then(result => response.json(result))

})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Contact.findById(id)
        .then(contact => response.json(contact))
})


app.post('/api/persons', (request, response) => {
    const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  } 

  const person = new Contact({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(result => response.json(result))
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Contact.findByIdAndRemove(request.params.id)
        .then(result => response.status(204).end())
        .catch(err => next(error))

})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})