const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!isValid(username)) { 
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});    
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

public_users.get('/',function (req, res) {
    let responsePromise = new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve(JSON.stringify(books, null, 3));
        });
    });
    responsePromise.then((response) => {
        res.send(response);
    });
});

public_users.get('/isbn/:isbn',function (req, res) {
    let responsePromise = new Promise((resolve,reject) => {
        setTimeout(() => {
            const isbn = req.params.isbn;
            resolve(JSON.stringify(books[isbn], null, 3));
        });
    });
    responsePromise.then((response) => {
        res.send(response);
    });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let responsePromise = new Promise((resolve,reject) => {
        setTimeout(() => {
            const author = req.params.author;
            let booksArray = [];
            for(var id in books){
                if(books[id].author === author) {
                    booksArray.push(books[id]);
                }
            }
            resolve(JSON.stringify(booksArray, null, 3));
        });
    });
    responsePromise.then((response) => {
        res.send(response);
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let responsePromise = new Promise((resolve,reject) => {
        setTimeout(() => {
            const title = req.params.title;
            let booksArray = [];
            for(var id in books){
                if(books[id].title === title) {
                    booksArray.push(books[id]);
                }
            }
            resolve(JSON.stringify(booksArray, null, 3));
        });
    });
    responsePromise.then((response) => {
        res.send(response);
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let responsePromise = new Promise((resolve,reject) => {
        setTimeout(() => {
            const isbn = req.params.isbn;
            res.send(JSON.stringify(books[isbn].reviews));
        });
    });
    responsePromise.then((response) => {
        res.send(response);
    });
});

module.exports.general = public_users;
