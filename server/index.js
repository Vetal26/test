import express from "express"
import cors from 'cors'
import bodyParser from 'body-parser'
import routes from './routes/index.js'

const PORT = 8080
const app = express()

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', routes);

app.use((req, res) => {
    res.status(404).send('Not found!');
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
