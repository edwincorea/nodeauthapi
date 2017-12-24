const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

// Routes
app.get("/api", (req, res) => {
    res.json({
        message: "Welcome to the API"
    });
});

// Protected route: we add a middleware function verifyToken
app.post("/api/posts", verifyToken, (req, res) => {
    //Decode token
    jwt.verify(req.token, "secretkey", (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: "Post created...",
                authData 
            });
        }
    });
});

app.post("/api/login", (req, res) => {
    // Mock user
    const user = {
        id: 1,
        username: "edwin.corea",
        email: "edwin.corea@gmail.com"
    };
    
    // Asynchronous call:
    // send user as a payload, 
    // a secret keyand 
    // and a callback
    jwt.sign({ user }, "secretkey", { expiresIn: "30s" }, (err, token) => {
        res.json({ token });
    });
});

// Format of Token
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
    // Get authorization header value
    const { authorization } = req.headers;
    console.log(req.headers);

    //Check if bearer is undefined
    if (typeof authorization === "undefined") {
        // Forbidden
        res.sendStatus(403);
    }

    // Split at the space
    const bearer = authorization.split(" ");

    // Get token from array
    const token = bearer[1];

    // Set the token
    req.token = token;

    // Next middleware
    next();
}

app.listen(5000, () => console.log("Server started on port 5000"));