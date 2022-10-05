var SERVER_NAME = 'image-api'
var PORT = 3000
var HOST = '127.0.0.1'

var restify = require('restify')
var imagesSave = require('save')('images')
var server = restify.createServer({ name: SERVER_NAME })

var getRequestCounter = 0
var postRequestCounter = 0

server.listen(PORT, HOST, function () {
    console.log('Server %s listening at %s', server.name, server.url)
})

server
  // Allow the use of POST
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())

server.get('/', function (req, res, next) {
    getRequestCounter+=1
    console.log('GET Request: images home page')
    console.log('Processed Request Count--> Get:%s, Post:%s', getRequestCounter, postRequestCounter)
    res.send('This is the home page')
    return next();
});

//Get all images in the system
server.get('/images', function (req, res, next) {
    getRequestCounter+=1
    console.log('GET Request: get all images')
    console.log('Processed Request Count--> Get:%s, Post:%s', getRequestCounter, postRequestCounter)
    imagesSave.find({}, function (error, images) {
        res.send(images)
    })
})

server.get('/images/:id', function (req, res, next) {
    getRequestCounter+=1
    console.log('GET Request: get image by ID')
    console.log('Processed Request Count--> Get:%s, Post:%s', getRequestCounter, postRequestCounter)
    imagesSave.findOne({ _id: req.params.id }, function (error, image) {
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

        if (image) {
            res.send(image)
        } else {
            res.send(404)
        }
    })
})

// //Create a new image
server.post('/images', function (req, res, next) {
    postRequestCounter+=1
    console.log('POST Request: add new image infoamtion')
    console.log('Processed Request Count--> Get:%s, Post:%s', getRequestCounter, postRequestCounter)
    console.log("name="+req.params.name)
    if (req.params.name === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new restify.InvalidArgumentError('name must be supplied'))
    }
    if (req.params.url === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new restify.InvalidArgumentError('url must be supplied'))
    }
    if (req.params.size === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new restify.InvalidArgumentError('size must be supplied'))
    }

    var newImage = {
        name: req.params.name,
        url: req.params.url,
        size: req.params.size
    }

    // Create the image using the persistence engine
    imagesSave.create(newImage, function (error, image) {

        // If there are any errors, pass them to next in the correct format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

        // Send the user if no issues
        res.send(201, image)
    })
})

//delete image with image id
server.del('/images/:id', function (req, res, next) {

    // Delete the user with the persistence engine
    imagesSave.delete(req.params.id, function (error, image) {
  
      // If there are any errors, pass them to next in the correct format
      if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
  
      // Send a 204 response
      res.send(204)
    })
  })

  //Delete all images 
  server.del('/images', function (res,res,next){
    imagesSave.deleteMany({},function (error, image) {
  
        // If there are any errors, pass them to next in the correct format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
    
        // Send a 200 OK response
        res.send()
      })
  })


