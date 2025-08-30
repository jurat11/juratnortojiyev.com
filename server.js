import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';
import nodemailer from 'nodemailer';
import { emailConfig } from './email-config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'project-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize SQLite database
const db = new Database('experiences.db');

// Create experiences table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS experiences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    period TEXT NOT NULL,
    company TEXT NOT NULL,
    job_title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'current',
    description TEXT,
    link TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create projects table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    skills TEXT NOT NULL,
    github TEXT,
    live TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Add status column to existing experiences table if it doesn't exist
try {
  db.exec('ALTER TABLE experiences ADD COLUMN status TEXT DEFAULT "current"');
} catch (error) {
  // Column already exists, ignore error
}

// Update existing experiences to have 'current' status if they don't have one
db.exec("UPDATE experiences SET status = 'current' WHERE status IS NULL OR status = ''");

// Insert initial data if experiences table is empty
const expCount = db.prepare('SELECT COUNT(*) as count FROM experiences').get();
if (expCount.count === 0) {
  const insert = db.prepare(`
    INSERT INTO experiences (period, company, job_title, status, description, link) 
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  insert.run('2023 - Present', 'Tech Solutions Inc.', 'Full Stack Developer', 'current', 'Developed web applications using React, Node.js, and SQLite. Implemented responsive designs and RESTful APIs.', 'https://techsolutions.com');
  insert.run('2022 - 2023', 'Digital Innovations', 'Frontend Developer', 'past', 'Built user interfaces with modern JavaScript frameworks. Collaborated with design teams to create intuitive user experiences.', 'https://digitalinnovations.com');
  insert.run('2021 - 2022', 'Startup Ventures', 'Junior Developer', 'past', 'Assisted in developing web applications and learning industry best practices.', 'https://startupventures.com');
}

// Insert initial data if projects table is empty
const projCount = db.prepare('SELECT COUNT(*) as count FROM projects').get();
if (projCount.count === 0) {
  const insert = db.prepare(`
    INSERT INTO projects (title, description, image, skills, github, live) 
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  insert.run('BiteWise AI Nutrition Assistant', 'A Telegram-based AI nutrition assistant that simplifies healthy eating. Features personalized calorie tracking, food recognition via photos, hydration tracking, and multilingual support (Uzbek, English, Russian).', '/public/placeholder.svg', 'Python,AI/ML,Telegram Bot API,Computer Vision,NLP', 'https://github.com/bitewise', 'https://t.me/BiteWiseBot');
  insert.run('Traffic Signal Optimization', 'Research project using reinforcement learning to optimize real-time traffic signals in Tashkent. Published findings on improving urban traffic flow through AI-driven signal control systems.', '/public/placeholder.svg', 'Python,Reinforcement Learning,Data Analysis,Urban Planning,Machine Learning', '', '');
  insert.run('Web Development Projects', 'Collection of responsive web applications built during my time at Unlock Admissions. Features modern design patterns, TypeScript integration, and optimized user experiences.', '/public/placeholder.svg', 'JavaScript,TypeScript,React,CSS,Responsive Design', '', 'https://unlockadmissions.com');
}

// API Routes for Experiences

// Get all experiences
app.get('/api/experiences', (req, res) => {
  try {
    const experiences = db.prepare('SELECT * FROM experiences ORDER BY created_at DESC').all();
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single experience
app.get('/api/experiences/:id', (req, res) => {
  try {
    const experience = db.prepare('SELECT * FROM experiences WHERE id = ?').get(req.params.id);
    if (experience) {
      res.json(experience);
    } else {
      res.status(404).json({ error: 'Experience not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new experience
app.post('/api/experiences', (req, res) => {
  try {
    const { period, company, job_title, status, description, link } = req.body;
    
    if (!period || !company || !job_title || !status) {
      return res.status(400).json({ error: 'Period, company, job title, and status are required' });
    }
    
    if (!['current', 'past'].includes(status)) {
      return res.status(400).json({ error: 'Status must be either "current" or "past"' });
    }
    
    const insert = db.prepare(`
      INSERT INTO experiences (period, company, job_title, status, description, link) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = insert.run(period, company, job_title, status, description || '', link || '');
    
    const newExperience = db.prepare('SELECT * FROM experiences WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newExperience);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update experience
app.put('/api/experiences/:id', (req, res) => {
  try {
    const { period, company, job_title, status, description, link } = req.body;
    
    if (!period || !company || !job_title || !status) {
      return res.status(400).json({ error: 'Period, company, job title, and status are required' });
    }
    
    if (!['current', 'past'].includes(status)) {
      return res.status(400).json({ error: 'Status must be either "current" or "past"' });
    }
    
    const update = db.prepare(`
      UPDATE experiences 
      SET period = ?, company = ?, job_title = ?, status = ?, description = ?, link = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    const result = update.run(period, company, job_title, status, description || '', link || '', req.params.id);
    
    if (result.changes > 0) {
      const updatedExperience = db.prepare('SELECT * FROM experiences WHERE id = ?').get(req.params.id);
      res.json(updatedExperience);
    } else {
      res.status(404).json({ error: 'Experience not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete experience
app.delete('/api/experiences/:id', (req, res) => {
  try {
    const deleteStmt = db.prepare('DELETE FROM experiences WHERE id = ?');
    const result = deleteStmt.run(req.params.id);
    
    if (result.changes > 0) {
      res.json({ message: 'Experience deleted successfully' });
    } else {
      res.status(404).json({ error: 'Experience not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API Routes for Projects

// Get all projects
app.get('/api/projects', (req, res) => {
  try {
    const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
    // Parse skills string back to array
    const projectsWithSkills = projects.map(project => ({
      ...project,
      skills: project.skills ? project.skills.split(',') : []
    }));
    res.json(projectsWithSkills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single project
app.get('/api/projects/:id', (req, res) => {
  try {
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    if (project) {
      // Parse skills string back to array
      project.skills = project.skills ? project.skills.split(',') : [];
      res.json(project);
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new project (with file upload)
app.post('/api/projects', upload.single('image'), (req, res) => {
  try {
    const { title, description, skills, github, live } = req.body;
    
    if (!title || !description || !skills) {
      return res.status(400).json({ error: 'Title, description, and skills are required' });
    }
    
    // Handle image upload
    let imagePath = '';
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    } else {
      return res.status(400).json({ error: 'Project image is required' });
    }
    
    // Convert skills array to comma-separated string
    const skillsString = Array.isArray(skills) ? skills.join(',') : skills;
    
    const insert = db.prepare(`
      INSERT INTO projects (title, description, image, skills, github, live) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = insert.run(title, description, imagePath, skillsString, github || '', live || '');
    
    const newProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
    // Parse skills string back to array
    newProject.skills = newProject.skills ? newProject.skills.split(',') : [];
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update project (with optional file upload)
app.put('/api/projects/:id', upload.single('image'), (req, res) => {
  try {
    const { title, description, skills, github, live } = req.body;
    
    if (!title || !description || !skills) {
      return res.status(400).json({ error: 'Title, description, and skills are required' });
    }
    
    // Get current project to check if we need to update image
    const currentProject = db.prepare('SELECT image FROM projects WHERE id = ?').get(req.params.id);
    if (!currentProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    let imagePath = currentProject.image;
    
    // Handle new image upload if provided
    if (req.file) {
      // Delete old image file if it exists and is not the placeholder
      if (currentProject.image && !currentProject.image.includes('placeholder.svg')) {
        const oldImagePath = path.join(__dirname, 'public', currentProject.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imagePath = `/uploads/${req.file.filename}`;
    }
    
    // Convert skills array to comma-separated string
    const skillsString = Array.isArray(skills) ? skills.join(',') : skills;
    
    const update = db.prepare(`
      UPDATE projects 
      SET title = ?, description = ?, image = ?, skills = ?, github = ?, live = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    const result = update.run(title, description, imagePath, skillsString, github || '', live || '', req.params.id);
    
    if (result.changes > 0) {
      const updatedProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
      // Parse skills string back to array
      updatedProject.skills = updatedProject.skills ? updatedProject.skills.split(',') : [];
      res.json(updatedProject);
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete project
app.delete('/api/projects/:id', (req, res) => {
  try {
    // Get project image before deletion
    const project = db.prepare('SELECT image FROM projects WHERE id = ?').get(req.params.id);
    
    const deleteStmt = db.prepare('DELETE FROM projects WHERE id = ?');
    const result = deleteStmt.run(req.params.id);
    
    if (result.changes > 0) {
      // Delete image file if it exists and is not the placeholder
      if (project && project.image && !project.image.includes('placeholder.svg')) {
        const imagePath = path.join(__dirname, 'public', project.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      res.json({ message: 'Project deleted successfully' });
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Email configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { fullName, email, phone, message } = req.body;
    
    // Validate required fields
    if (!fullName || !email || !phone || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Email content
    const mailOptions = {
      from: 'juratjushkinovich@gmail.com',
      to: 'juratjushkinovich@gmail.com',
      subject: `New Contact Form Inquiry from ${fullName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>Sent from your website contact form on ${new Date().toLocaleString()}</em></p>
      `
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    
    // Log the contact form submission
    console.log('Contact form submitted:', { fullName, email, phone, message, timestamp: new Date().toISOString() });
    
    res.status(200).json({ message: 'Message sent successfully!' });
    
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

// Serve admin panel
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Admin panel: http://localhost:${PORT}/admin`);
  console.log(`🔗 API: http://localhost:${PORT}/api/experiences`);
  console.log(`🔗 Projects API: http://localhost:${PORT}/api/projects`);
  console.log(`📁 Contact API: http://localhost:${PORT}/api/contact`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
});
