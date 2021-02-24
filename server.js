const express = require('express');
const connectDB = require('./config/db');
const app = express()

//connect Database
connectDB()

//Init Middleware
app.use(express.json());

app.use('/api/users', require('./route/api/users'));
app.use('/api/auth', require('./route/api/auth'));
app.use('/api/profile', require('./route/api/profile'));
app.use('/api/posts', require('./route/api/posts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
}); 