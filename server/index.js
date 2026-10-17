import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(express.json());

const contentDir = path.join(__dirname, '../content');

// Get Projects
app.get('/api/projects', (req, res) => {
  try {
    const data = fs.readFileSync(path.join(contentDir, 'projects.json'), 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read projects' });
  }
});

// Save Projects
app.post('/api/projects', (req, res) => {
  try {
    fs.writeFileSync(path.join(contentDir, 'projects.json'), JSON.stringify(req.body, null, 2), 'utf8');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save projects' });
  }
});

// Get Experience
app.get('/api/experience', (req, res) => {
  try {
    const data = fs.readFileSync(path.join(contentDir, 'experience.json'), 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read experience' });
  }
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Local admin backend running at http://127.0.0.1:${PORT}`);
});
