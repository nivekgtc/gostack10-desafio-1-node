const express = require("express")

const server = express()

server.use(express.json())

const projects = []
let requestNumbers = 0



function checkIfProjectExists(req, res, next) {
  const { id } = req.params

  const project = projects.find(project => project.id === id)

  if (!project) return res.json({error: 'This project does not exists'})

  return next()
}

function globalMiddleware(req, res, next) {
  requestNumbers++
  console.log(`Number of requests: ${requestNumbers}`)
  return next()
}

server.use(globalMiddleware)

server.get('/projects', (req, res) => {

  return res.status(200).json({success: true, content: projects})
})
server.post('/projects', (req, res) => {
  const { id, title } = req.body

  const project = { id, title, tasks: [] }
  projects.push(project)

  return res.status(200).json({success: true, content: projects})
})
server.put('/projects/:id', checkIfProjectExists, (req, res) => {
  const { id } = req.params

  const { title } = req.body

  const project = projects.find(project => project.id === id)

  project.title = title

  return res.status(201).json({success: true, content: projects})
})

server.delete('/projects/:id', checkIfProjectExists, (req, res) => {
  const { id } = req.params

  const index = projects.findIndex(project => project.id === id)
  
  projects.splice(index, 1)

  return res.send()
})

server.post('/projects/:id/tasks', checkIfProjectExists, (req, res) => {
  const { id } = req.params

  const { title } = req.body

  const project = projects.find(project => project.id === id)
  project.tasks.push({ id, title })


  return res.status(200).json({success: true, content: projects})
})

server.listen(3333)