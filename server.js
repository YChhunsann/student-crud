const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// Path to the JSON file
const tmpFilePath = path.join(__dirname, 'tmp', 'students.json');

// Ensure directory exists
const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Read data from the file
function readData() {
  if (!fs.existsSync(tmpFilePath)) {
    return [];
  }
  const data = fs.readFileSync(tmpFilePath, 'utf8');
  return JSON.parse(data);
}

// Write data to the file
function writeData(data) {
  ensureDirExists(path.dirname(tmpFilePath));
  fs.writeFileSync(tmpFilePath, JSON.stringify(data, null, 2), 'utf8');
}

// GET: Fetch all students
app.get('/students', (req, res) => {
  const students = readData();
  console.log('Fetched students:', students);  // Debugging log
  res.json(students);
});

// POST: Add a new student
app.post('/students', (req, res) => {
  const { name, email } = req.body;

  // Validation
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required.' });
  }

  const students = readData();
  const newStudent = {
    id: students.length > 0 ? students[students.length - 1].id + 1 : 1,  // Auto incrementing ID
    name,
    email,
  };

  students.push(newStudent);
  writeData(students);
  console.log('New student added:', newStudent);  // Debugging log
  res.status(201).json(newStudent);
});

// PUT: Update a student by ID
app.put('/students/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const students = readData();
  const studentIndex = students.findIndex((s) => s.id === parseInt(id));

  if (studentIndex !== -1) {
    students[studentIndex] = {
      ...students[studentIndex],
      name: name || students[studentIndex].name,
      email: email || students[studentIndex].email,
    };
    writeData(students);
    res.json(students[studentIndex]);
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
});

// DELETE: Remove a student by ID
app.delete('/students/:id', (req, res) => {
  const { id } = req.params;
  let students = readData();
  const newStudents = students.filter((s) => s.id !== parseInt(id));

  if (students.length !== newStudents.length) {
    writeData(newStudents);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
