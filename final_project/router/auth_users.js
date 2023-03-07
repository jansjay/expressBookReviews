const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    return users.filter((user)=> {
        return user.username === username
    }).length > 0;
}

const authenticatedUser = (username,password)=>{ 
    return users.filter((user)=>{
        return (user.username === username && user.password === password)
    }).length > 0;
}

regd_users.post("/login", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in, username or password not provided."});
    }
  
    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
  
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in.");
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password."});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const reviews = req.body.reviews;
    books[isbn].reviews = review;
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
