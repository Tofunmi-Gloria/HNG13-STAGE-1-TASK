const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

// In-memory database
const database = {};

// Function to analyze the string
function analyzeString(str) {
  const lowerStr = str.toLowerCase();
  const length = str.length;
  const isPalindrome = lowerStr === lowerStr.split('').reverse().join('');
  const uniqueCharacters = new Set(str).size;
  const wordCount = str.trim() === "" ? 0 : str.trim().split(/\s+/).length;
  const shaHash = crypto.createHash('sha256').update(str).digest('hex');

  const characterFrequencyMap = {};
  for (const char of str) {
    characterFrequencyMap[char] = (characterFrequencyMap[char] || 0) + 1;
  }

  return {
    length,
    is_palindrome: isPalindrome,
    unique_characters: uniqueCharacters,
    word_count: wordCount,
    sha256_hash: shaHash,
    character_frequency_map: characterFrequencyMap
  };
}

// Root route for testing
app.get('/', (req, res) => {
  res.send('✅ Backend is running. Use POST /strings to analyze a string.');
});

// POST /strings - analyze & store
app.post('/strings', (req, res) => {
  const { value } = req.body;

  if (typeof value !== 'string') {
    return res.status(422).json({ error: 'Value must be a string' });
  }

  // Check if already exists
  const exists = Object.values(database).find(r => r.value === value);
  if (exists) return res.status(409).json({ error: 'String already exists' });

  const properties = analyzeString(value);
  const record = {
    id: properties.sha256_hash,
    value,
    properties,
    created_at: new Date().toISOString()
  };

  database[record.id] = record;
  res.status(201).json(record);
});

// GET /strings/:value - fetch specific string
app.get('/strings/:value', (req, res) => {
  const valueParam = req.params.value;

  const record = Object.values(database).find(r => r.value === valueParam);

  if (!record) return res.status(404).json({ error: 'String not found' });

  res.json(record);
});

// GET /strings - fetch all with optional filters
app.get('/strings', (req, res) => {
  let results = Object.values(database);

  const { is_palindrome, min_length, max_length, word_count, contains_character } = req.query;

  if (is_palindrome !== undefined) {
    results = results.filter(r => r.properties.is_palindrome === (is_palindrome === 'true'));
  }
  if (min_length) {
    results = results.filter(r => r.properties.length >= parseInt(min_length));
  }
  if (max_length) {
    results = results.filter(r => r.properties.length <= parseInt(max_length));
  }
  if (word_count) {
    results = results.filter(r => r.properties.word_count === parseInt(word_count));
  }
  if (contains_character) {
    results = results.filter(r => r.value.includes(contains_character));
  }

  res.json({ data: results, count: results.length, filters_applied: req.query });
});

// DELETE /strings/:value - delete string
app.delete('/strings/:value', (req, res) => {
  const valueParam = req.params.value;

  const record = Object.values(database).find(r => r.value === valueParam);

  if (!record) return res.status(404).json({ error: 'String not found' });

  delete database[record.id];
  res.status(204).send();
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
