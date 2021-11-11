const express = require('express');
const app = express();
app.set('view engine', 'pug');
app.use('/static', express.static('public'));
const {projects} = require('./data.json');

/**
 * Route handlers
 */

// Index page route
app.get('/', (req, res) => {
    res.render('index', {projects});
})

// About page route
app.get('/about', (req, res) => {
    res.render('about');
})

// Projects page route
app.get('/project/:id', (req, res, next) => {
    const idProject = req.params.id;
    const project = projects.find( ({ id }) => id === +idProject );
    
    if (idProject < projects.length) {
        const technologies = project.technologies;
        res.render('project', {project, technologies});
    } else {
        const err = new Error();
        err.message = "Ooops, we could not find such project";
        err.status = 404;
        next(err);
    }
})


/**
 * Error handlers
 */

// 404 error handler
app.use((req, res, next) => {
    console.log("404 error handler");
    const err = new Error();
    err.message = 'Oops, page not found';
    err.status = 404;
    console.log(err.status, err.message);
    next(err);
});
  
// Global error handler
app.use((err, req, res, next) => {
   if (err) {
       console.log("Global error handler");
   }
   
   if (err.status === 404) {
       res.status(err.status)
       console.log(err.status, err.message);
       res.render('page-not-found', {err});
   } else {
       err.message = err.message || "there is a problem with a server";
       err.status = err.status || 500;
       res.status(err.status);
       console.log(err.status, err.message);
       res.render('error', {err});      
   }
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
})