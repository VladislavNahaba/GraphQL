const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const config = require('config');
const mongoose = require('mongoose');
const schema = require('./schema/schema')

const app = express();

app.use(express.json({ extended: true }));

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.use('/directors', require('./routes/directors.routes'));
app.use('/', require('./routes/index'));
app.use('*', (_, res) => res.send('<h1>No such page</h1>'));

const dbConnection = mongoose.connection;
dbConnection.on('error', console.error.bind(console, 'Mongoose connection error:'));
dbConnection.once('open', () => console.log('Mongoose connected!'));

const PORT = config.get('port') || 9000;

const start = async () => {
    try{
        await mongoose.connect(config.get('mongoUrl'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        app.listen(PORT, err => err ? console.error(err) : console.log(`Server Started on: http://0.0.0.0:${PORT}/`));
    } catch (e) {
        console.log('Server error!', e.message);
        process.exit(1);
    }
};
start();
