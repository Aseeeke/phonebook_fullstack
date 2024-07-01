const express = require('express');
const {response} = require("express");
const cors = require("cors");

const app = express();

const morgan = require('morgan')
morgan.token('body', (req) => {
    return JSON.stringify(req.body)
})

app.use(express.json());
app.use(cors())
app.use(express.static('dist'))
app.use(morgan(function (tokens, req, res) {
    if(req.method === 'POST') {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms',
            tokens.body(req)
        ].join(' ')
    }
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
    ].join(' ')
}))

let numbers = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(numbers)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = numbers.find(number => number.id === id)
    if(person) {
        res.json(person)
    }
    else {
        res.status(404).end()
    }
})

app.get('/info', (req, res) => {
    const now =  new Date()
    res.send(`Phonebook has info about ${numbers.length} people`  + "<br />" + now)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    numbers = numbers.filter(number => number.id !== id)
    res.status(204).end()
})

const generateId = () => {
    const maxId =numbers.length > 0 ? Math.random() * 100 : 1
    return String(maxId)
}

app.post('/api/persons', (req, res) => {
    const body = req.body
    if(!body.name || !body.number) {
        return res.status(400).end()
    }
    else if (numbers.filter(number => number.name === body.name).length > 0) {
        return res.status(400).json({
            error: 'Name is required to be unique'
        })
    }
    else {
        const number = {
            id: generateId(),
            name: body.name,
            number: body.number
        }
        numbers = numbers.concat(number)

        res.json(number)
    }
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})