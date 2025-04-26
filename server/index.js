import express from "express"
import router from './router/index.js'

const PORT = 8080
const app = express()

app.use('/', router);

app.use((req, res) => {
    res.status(404).send('Not found!');
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
