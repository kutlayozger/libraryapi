DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Books;
DROP TABLE IF EXISTS Borrows;
DROP TABLE IF EXISTS Returns;
DROP INDEX IF EXISTS IX_Borrow_User;
DROP INDEX IF EXISTS IX_Borrow_Book;
DROP INDEX IF EXISTS IX_Return_User;
DROP INDEX IF EXISTS IX_Return_Book;

CREATE TABLE Users (
    id integer NOT NULL  PRIMARY KEY autoincrement,
    name varchar(100) NOT NULL,
    createdAt datetime,
    updatedAt datetime
);

CREATE TABLE Books (
    id integer NOT NULL  PRIMARY KEY autoincrement,
    name varchar(100) NOT NULL,
    inside boolean,
    createdAt datetime,
    updatedAt datetime
);

CREATE TABLE Borrows (
    id integer NOT NULL  PRIMARY KEY autoincrement,
    userId integer,
    bookId integer,
    createdAt datetime,
    updatedAt datetime
);

CREATE TABLE Returns (
    id integer NOT NULL  PRIMARY KEY autoincrement,
    userId integer,
    bookId integer,
    score float,
    createdAt datetime,
    updatedAt datetime
);

Create  Index IX_Borrow_User on Borrows (userId, id);
Create  Index IX_Borrow_Book on Borrows (bookId, id);
Create  Index IX_Return_User on Returns (userId, id);
Create  Index IX_Return_Book on Returns (bookId, id);
