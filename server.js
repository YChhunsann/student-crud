const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// Mock Database
let students = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// Routes
// GET: Fetch all students
app.get('/students', (req, res) => {
  res.json(students);
});

// POST: Add a new student
app.post('/students', (req, res) => {
  const { name, email } = req.body;
  const newStudent = { id: students.length + 1, name, email };
  students.push(newStudent);
  res.status(201).json(newStudent);
});

// PUT: Update a student by ID
app.put('/students/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const student = students.find(s => s.id === parseInt(id));

  if (student) {
    student.name = name || student.name;
    student.email = email || student.email;
    res.json(student);
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
});

// DELETE: Remove a student by ID
app.delete('/students/:id', (req, res) => {
  const { id } = req.params;
  students = students.filter(s => s.id !== parseInt(id));
  res.status(204).send();
});

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

