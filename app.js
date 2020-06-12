const express = require('express');
const path = require('path');
//importing routes
const routes = require('./routes/index');
const books = require('./routes/books');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//setting port for heroku, it takes either the port used by the env or 3000
const port = process.env.PORT || 3000;
//middleware to serve the static files in the public folder
app.use("/static", express.static("public"));
//To be able to use req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', routes);
app.use('/books', books);


//This middleware will just be responsible for creating the error object and handing off to the error handler (REDIRECTING TO THE 404 ERROR)
app.use((req,res,next) => {
    const err = new Error("Not found!");
    err.status = 404;
    next(err);
});

//if an error is passed to the middleware, the middleware will look for this and it will render the error template (THIS IS THE ERROR HANDLER)
app.use((err, req, res, next)=>{
    res.locals.error = err;
    res.locals.image = "/static/images/not-found.jpg";
    res.status(err.status);
    res.render("error");
});
console.log("App running on port: " + port);
app.listen(port);