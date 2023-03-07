const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;  
    if (username && password) {
        if (!doesExist(username)) { 
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});    
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null, 3));
});

public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    return books.filter((book)=>{
        return (book.author === author)
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    return books.filter((book)=>{
        return (book.title === title)
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
