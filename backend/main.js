const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true });
const app = express();
app.use(express.json())
app.use(cors())
const port = 3000; // process.env.PORT
app.use(express.urlencoded({extended: false}));
const UserSchema = new mongoose.Schema({
    name: String,
    age: Number
});
const User = mongoose.model('Users', UserSchema); 

(async () => {
    app.get('/test', async (req, res) => {
        res.status(200).send({ msg: "hello " });
    });

    app.get('/users', async (req, res) => {
        const users = await User.find({});
        if (users) {
            res.status(200).send(users);
        } else {
            res.status(404).send({ msg: "Not Found" });
        }
    });

    app.get('/users/:_id', async (req, res) => {
        const user = await User.findById(req.params._id);
        if (user) {
            res.status(200).send(user);
        } else {
            res.status(404).send({ msg: "Not Found" });
        }
    });
    
    app.put('/users/:_id',async (req, res) => {
        const user = await User.findById(req.params._id);
        console.log(req.body.name);
        user.name = req.body.name;
        user.age = req.body.age;
        await user.save();
        res.status(200).send({msg : "user has been updated"})
    })

    app.post('/users', async (req, res) => { 
        const user = new User();
        user.name = req.body.name;
        user.age = req.body.age;
        await user.save();
        res.status(200).send({ msg: "user was create" });
    });

    app.delete('/users/:_id', async (req, res) => { 
        const user = await User.findById(req.params._id);
        if (user) {
            await user.delete();
            res.status(200).send({ msg: "User was remove" });
        } else {
            res.status(404).send({ msg: "Not Found" });
        }
    });
})();

app.listen(port, () => {
    console.log(`Сервер был запущен: http://localhost:${port}\n`);
});