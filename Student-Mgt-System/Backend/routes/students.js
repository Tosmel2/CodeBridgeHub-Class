const express = require('express');
const { body, validationResult } = require('express-validator');
const students = require('../data/students');

const router = express.Router();

const studentValidationRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('A valid email is required'),
  body('course').trim().notEmpty().withMessage('Course is required'),
  body('level').trim().notEmpty().withMessage('Level is required')
];

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

router.get('/', (req, res) => {
  res.status(200).json(students);
});

router.get('/:id', (req, res) => {
  const student = students.find((item) => item.id === parseInt(req.params.id, 10));
  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }
  res.status(200).json(student);
});

router.post('/', studentValidationRules, validateRequest, (req, res) => {
  const { name, email, course, level } = req.body;
  const nextId = students.length ? Math.max(...students.map((student) => student.id)) + 1 : 1;
  const newStudent = { id: nextId, name, email, course, level };
  students.push(newStudent);
  res.status(201).json(newStudent);
});

router.put('/:id', studentValidationRules, validateRequest, (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const studentIndex = students.findIndex((item) => item.id === studentId);

  if (studentIndex === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const { name, email, course, level } = req.body;
  students[studentIndex] = { id: studentId, name, email, course, level };
  res.status(200).json(students[studentIndex]);
});

router.delete('/:id', (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const studentIndex = students.findIndex((item) => item.id === studentId);

  if (studentIndex === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const deletedStudent = students.splice(studentIndex, 1)[0];
  res.status(200).json({ message: 'Student deleted', student: deletedStudent });
});

module.exports = router;
