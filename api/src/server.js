require('dotenv').config();
const pathJoin = require('path').join;
const app = require('express')();
const api = require('express')();
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require("passport");
const controllerDirectory = pathJoin(__dirname, 'controllers');
const { db } = require("./utils/hspc_db")

// check db connection
db.connect()
    .then(obj => {
        obj.done()
    })
    .catch(error => {
        console.log('ERROR:', error.message || error)
        process.exit()
    })

//region Set Up Middleware
api.use(helmet());
// noinspection JSLint
api.use(cors({
    origin: [process.env.APP_URL], // domain location(s)
}));
api.use(morgan('combined'));
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({
    extended: true
}));

// Passport middleware
api.use(passport.initialize());// Passport config
require("./utils/passport")(passport);
//endregion

// Set Up Controllers
require('fs').readdirSync(controllerDirectory).forEach((controller) => {
    //console.debug("loading controller: " + controller);
    api.use(`/${controller.substring(0, controller.lastIndexOf('.'))}`, require(pathJoin(controllerDirectory, controller)));
});


app.use('/api', api);

if (process.env.NODE_ENV === 'production' || process.env.REACT_APP_ENABLED === 'true') {
    app.use('/', require('express').static('./react/build'));
}

if (process.env.NODE_ENV !== 'production') {
    app.use('/docs', require('express').static('apidoc'));
}

// Start App Listener
module.exports = app;