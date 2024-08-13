const express = require('express');
const cors = require('cors');
const { connect } = require('mongoose');
require('dotenv').config();
const upload = require("express-fileupload")

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "https://frontend-75cg.onrender.com" }));

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.use(notFound);
app.use(errorHandler);


const port = process.env.PORT;
connect(process.env.MONGO_URI).
    then(
        app.listen(port || 5000, () => console.log(`Server running on port ${port}`))).
    catch(error => console.log(error));