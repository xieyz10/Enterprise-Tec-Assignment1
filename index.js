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

// Allow the use of POST
server.use(restify.fullResponse())
// Maps req.body to req.params so there is no switching between them
server.use(restify.bodyParser())

//Get all images in the system
server.get('images',function(req,res,next){
    imageSave.find({}, function (error,images){
        res.send(images)
    })
})

server.get('/images/:id',function(req,res,next){
    imageSave.findOne({_id: req.params.id},function(error,image){
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

        if(image) {
            res.send(image)
        }else {
            res.send(404)
        }
    })
})



