const PORT = process.env.PORT ?? 5000;
const user = {
    name: process.env.username ?? 'test',
    password: process.env.password ?? 'test',
}
const Application = require('./framework/Application');
const userRouter = require('./src/user-router');
const jsonParser = require('./framework/parseJson');
const urlParser = require('./framework/parseUrl');
const mongoose = require('mongoose');

const app = new Application();


app.use(jsonParser);
app.use(urlParser('http://localhost:5000'));
app.addRouter(userRouter);

const start = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${user.name}:${user.password}@cluster0.gvmkmuc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
        app.listen(PORT, () => console.log(`Server started on PORT=${PORT}`));
    } catch (e) {
        console.log(e);
    }
}

start();

