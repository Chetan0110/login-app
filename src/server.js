const express = require("express")
var bodyParser = require('body-parser')
const path = require("path")
const mongoose = require('mongoose');

require('./mongoose/user');
const configs = require("./configs/configs").configs;

const MONGO_HOST = process.env.NODE_ENV === "prod" ? configs.MONGO_PROD_HOST : configs.MONGO_LOCAL_HOST;
// DB Connection with mongodb docker image host
// To connect with localhost db, relace it with "localhost" 
mongoose.connect(`mongodb://${MONGO_HOST}/loginApp_db`, { useNewUrlParser: true });
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
