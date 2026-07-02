const express = require('express');
const cors = require('cors');
const studentRoutes = require('./routes/students');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.json({
    message: 'Student Management System API is running',
    endpoints: ['/students', '/students/:id']
  });
});

app.use('/students', studentRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Student Management API listening on http://localhost:${PORT}`);
});
