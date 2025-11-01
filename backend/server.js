const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path'); // ✅ add this

dotenv.config();

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// ✅ Serve static frontend files (HTML, CSS, JS) from the root folder
app.use(express.static(path.join(__dirname, "../")));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

// ✅ Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });

