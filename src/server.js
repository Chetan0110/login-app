const express = require("express")
var bodyParser = require('body-parser')
const path = require("path")
const mongoose = require('mongoose');
require('./mongoose/user');



// DB Connection with mongodb docker image host
// To connect with localhost db, relace it with "localhost" 
mongoose.connect("mongodb://172.17.0.2/loginApp_db", { useNewUrlParser: true });
mongoose.Promise = global.Promise;
mongoose.connection.on('connected', () => {
    console.log(`Mongoose connection open on loginApp_db`);
}).on('error', (err) => {
    console.log(`Connection error: ${err.message}`);
});

// port
const port = "4000";
// create express app
const app = express();

// bodyParser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Give routes to app
const routes = require("./routes/userRoutes");
app.use("/", routes);

app.use(express.static(path.join(__dirname, "../client/build")))
app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"))
})


// Start the server on port
app.listen(port, function(err) {
    if (err) {
        console.log(err)
    } else {
        console.log("Server Started On Port: " + port)
    }
})
