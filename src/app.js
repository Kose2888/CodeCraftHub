import express from 'express';
import coursesRouter from './routes/courses.js';

const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/courses', coursesRouter);

export default app;
