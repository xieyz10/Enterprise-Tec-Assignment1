var SERVER_NAME = 'image-api'
var PORT = 3000
var HOST = '127.0.0.1'

var restify = require('restify')
var imageSave = require('save')('images')
var server = restify.createServer({ name: SERVER_NAME })

server.listen(PORT, HOST, function () {
    console.log('Server %s listening at %s', server.name, server.url)
    console.log('Resources:')
    console.log(' /images')
    console.log(' /images/:id')
})



