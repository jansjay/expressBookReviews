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
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    console.log(password);  
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
    const review = req.body.review;
    let reviews = books[isbn].reviews;        
    if(!reviews){
        reviews[1] = {reviewText: review, by: req.session.authorization.username};
    } else {
        let id = 0;
        // Get max review ID
        for(id in reviews){}
        reviews[++id] = {reviewText: review, by: req.session.authorization.username};
    }
    books[isbn].reviews = reviews;
    res.send(JSON.stringify(books[isbn], null, 3))
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let reviews = books[isbn].reviews;
    let newReviews = [];        
    if(!reviews){
    } else {
        let index = 0;
        // Get max review ID
        for(id in reviews){
            if(reviews[id].by === req.session.authorization.username) {
            }
            else {
                newReviews[index++] = reviews[id];
            }
        }
        books[isbn].reviews = newReviews;
    }    
    res.send(JSON.stringify(books[isbn], null, 3))
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
