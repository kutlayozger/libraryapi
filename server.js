const express = require("express"),
      cors = require("cors"),
      bodyParser = require("body-parser"),
      port = 3000,
      ctrl = require("./controller/library_controller"),
      app = express();

const checkUserMiddleware = (req, res, next) => {
    ctrl.isUserExists(req.params.userid).then((resp) => {
        if (resp) {
            next();
        } else {
            res.status(500);
            res.json({error: true, message: 'User not found'})
        }
    })
}

const checkBookMiddleware = (req, res, next) => {
    ctrl.isBookExists(req.params.bookid).then((resp) => {
        if (resp) {
            next();
        } else {
            res.status(500);
            res.json({error: true, message: 'Book not found'})
        }
    })
}

const bookShouldBeInside = (req, res, next) => {
    ctrl.isBookInside(req.params.bookid).then((resp) => {
        if (resp) {
            next();
        } else {
            res.status(500);
            res.json({error: true, message: 'Book still outside'})
        }
    })
}

const nameNotEmpty = (req, res, next) => {
    if (req.body.name) {
        next();
    } else {
        res.status(500);
        res.json({error: true, message: 'Name cannot be empty'})        
    }
}

app.use(cors());
app.use(
    bodyParser.json({
      limit: "50mb",
      extended: true,
      parameterLimit: 1000000
    })
);

app.use(
    bodyParser.urlencoded({
      limit: "50mb",
      extended: true,
      parameterLimit: 1000000
    })
);

app.get('/users', (req, res) => {
    ctrl.getUsers().then((resp) => {
        res.json(resp);
    })
})

app.get('/users/:userid', checkUserMiddleware, (req, res) => {
    ctrl.getUser(req.params.userid).then(resp => {
        res.json(resp);
    })
})

app.post('/users', nameNotEmpty, (req, res) => {
    ctrl.createUser(req.body).then((resp) => {
        res.json(resp);
    })
})

app.get('/books', (req, res) => {
    ctrl.getBooks().then(resp => {
        res.json(resp);
    })
})

app.get('/books/:bookid', checkBookMiddleware, (req, res) => {
    ctrl.getBook(req.params.bookid).then(resp => {
        res.json(resp);
    })
})

app.post('/books', nameNotEmpty, (req, res) => {
    ctrl.createBook(req.body).then((resp) => {
        console.log("resp:", resp);
        res.json(resp);
    })
})

app.post('/users/:userid/borrow/:bookid', checkUserMiddleware, checkBookMiddleware, bookShouldBeInside, (req, res) => {
    ctrl.borrowBook(req.params.userid, req.params.bookid).then(resp => {
        res.json(resp);
    })
});

app.post('/users/:userid/return/:bookid', checkUserMiddleware, checkBookMiddleware, (req, res) => {
    ctrl.returnedBook(req.params.userid, req.params.bookid, req.body.score).then(resp => {
        res.json(resp);
    })
});

app.listen(port, () => {
  console.log(`Library API on ${port}`)
})
