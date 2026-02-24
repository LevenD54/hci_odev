import express from 'express';
import { createServer as createViteServer } from 'vite';
import { initDb, getAssignments, getAssignment, takeAssignment, addAssignment, deleteAssignment, resetAssignment } from './src/db.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize DB
  initDb();

  // API Routes
  app.get('/api/assignments', (req, res) => {
    try {
      const assignments = getAssignments();
      res.json(assignments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/assignments/:id', (req, res) => {
    try {
      const assignment = getAssignment(Number(req.params.id));
      if (assignment) {
        res.json(assignment);
      } else {
        res.status(404).json({ error: 'Assignment not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/assignments/:id/take', (req, res) => {
    try {
      const { studentName, studentSurname, studentNo } = req.body;
      if (!studentName || !studentSurname || !studentNo) {
        return res.status(400).json({ error: 'Missing student information' });
      }
      
      const success = takeAssignment(Number(req.params.id), studentName, studentSurname, studentNo);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(400).json({ error: 'Assignment already taken or not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/assignments', (req, res) => {
    try {
      const { title, researchTopic, applicationSteps, imageUrl } = req.body;
      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }
      const id = addAssignment(title, researchTopic || '', applicationSteps || '', imageUrl || '');
      res.json({ id, success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.delete('/api/assignments/:id', (req, res) => {
    try {
      const success = deleteAssignment(Number(req.params.id));
      res.json({ success });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/assignments/:id/reset', (req, res) => {
    try {
      const success = resetAssignment(Number(req.params.id));
      res.json({ success });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
