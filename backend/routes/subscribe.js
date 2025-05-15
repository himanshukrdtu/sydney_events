const express = require('express');
const router = express.Router();
const Email = require('../models/email');

router.post('/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const newEmail = new Email({ email });
    await newEmail.save();
    res.status(201).json({ message: 'Email saved' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
