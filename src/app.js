import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import coursesRouter from './routes/courses.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/courses', coursesRouter);

export default app;
