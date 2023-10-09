const lib_ctrl = {};
const {User, Book, Borrow, Return} = require('./model')
const sequelize = require("sequelize");

lib_ctrl.getUsers = () => {
    return new Promise((resolve) => {
        User.findAll().then(resp => {
            resolve(resp);
        })
    })
}


lib_ctrl.getUser = (id) => {
    return new Promise((resolve) => {
        User.findOne({id: id}).then((resp) => {
            let user = {...resp.dataValues};
            Promise.all([lib_ctrl.getBorrowBooks(id), lib_ctrl.getReturnedBooks(id)]).then(resp => {
                user.returnedBooks = resp[0];
                user.borrowedBooks = resp[1];
                resolve(user);
            })
        })
    })
}

lib_ctrl.createUser = (user) => {
    return new Promise((resolve) => {
        User.create(user).then((resp) => {
            resolve(resp.dataValues)
        })
    })
}

lib_ctrl.isUserExists = (userId) => {
    return new Promise(resolve => {
        console.log("userid:", userId)
        User.findByPk(userId).then(resp => {
            resolve(resp);
        })
    })
}

lib_ctrl.getBooks = () => {
    return new Promise((resolve) => {
        Book.findAll().then(resp => {
            resolve(resp);
        });
    });
}

lib_ctrl.createBook = (book) => {
    return new Promise((resolve) => {
        Book.create(book).then((resp) => {
            resolve(resp.dataValues)
        })
    })
}

lib_ctrl.isBookExists = (bookId) => {
    return new Promise(resolve => {
        Book.findByPk(bookId).then(resp => {
            resolve(resp);
        })
    })
}

lib_ctrl.isBookInside = (bookId) => {
    return new Promise(resolve => {
        Book.findByPk(bookId).then(resp => {
            resolve(resp.inside);
        })
    })
}

lib_ctrl.getBook = (id) => {
    return new Promise((resolve) => {
        Book.findByPk(id).then((book) => {
            lib_ctrl.calculateScore(id).then(score => {
                book = {...book.dataValues, score};
                resolve(book);
            })
        })
    })
}

lib_ctrl.calculateScore = (bookId) => {
    return new Promise((resolve) => {
      Return.findOne({
          where: {bookId},
          attributes: [[sequelize.fn('avg', sequelize.col('score')), 'score']],
        }).then(resp => {
            resolve(resp.score)
        })
    })
}

lib_ctrl.getBorrowBooks = (userId) => {
    return new Promise((resolve) => {
        Borrow.findAll({
            where: {userId},
            include: [{
                model: Book
            }]
        }).then((resp) => {
            resolve(resp);
        });
    });
};

lib_ctrl.borrowBook = (userId, bookId) => {
    return new Promise((resolve) => {
        Book.findByPk(bookId).then((book) => {
            book.update({inside: false});
            Borrow.create({userId, bookId}).then(resp => {
                resolve(resp.dataValues);
            })
        })
    })
}

lib_ctrl.getReturnedBooks = (userId) => {
    return new Promise((resolve) => {
        Return.findAll({
            where: {userId},
            include: [{
                model: Book
            }]
        }).then((resp) => {
            resolve(resp);
        });
    });
};

lib_ctrl.returnedBook = (userId, bookId, score) => {
    return new Promise((resolve) => {
        Book.findByPk(bookId).then((book) => {
            book.update({inside: true});
            Return.create({userId, bookId, score}).then(resp => {
                resolve(resp.dataValues);
            })
        })
    })
}

module.exports = lib_ctrl;
