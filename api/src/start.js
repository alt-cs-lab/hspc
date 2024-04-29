const app = require('./server');

const server = app.listen(process.env.PORT || 3001, () => {
    console.log('App running on port ' + server.address().port + "\n");
});