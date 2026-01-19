# Express.js CRUD API - Interview Quick Reference

## 📦 Basic Server Setup

### Minimal Express Server

```javascript
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### With ES Modules (Modern Syntax)

```javascript
import express from 'express';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => console.log('Server started'));
```

---

## 🔄 CRUD Operations - Complete Example

### In-Memory Data Store (for demo)

```javascript
const express = require('express');
const app = express();

app.use(express.json());

// In-memory database
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

let nextId = 3;
```

### CREATE - POST Request

```javascript
// Create a new user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  // Validation
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  const newUser = {
    id: nextId++,
    name,
    email
  };
  
  users.push(newUser);
  res.status(201).json(newUser); // 201 = Created
});
```

### READ - GET Requests

```javascript
// Get all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Get single user by ID
app.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

// With query parameters
app.get('/api/search', (req, res) => {
  const { name, email } = req.query;
  let results = users;
  
  if (name) {
    results = results.filter(u => u.name.toLowerCase().includes(name.toLowerCase()));
  }
  if (email) {
    results = results.filter(u => u.email.includes(email));
  }
  
  res.json(results);
});
```

### UPDATE - PUT/PATCH Requests

```javascript
// PUT - Replace entire resource
app.put('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;
  
  const index = users.findIndex(u => u.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Replace entire object (PUT semantics)
  users[index] = { id, name, email };
  res.json(users[index]);
});

// PATCH - Partial update
app.patch('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updates = req.body;
  
  const index = users.findIndex(u => u.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Merge updates (PATCH semantics)
  users[index] = { ...users[index], ...updates };
  res.json(users[index]);
});
```

### DELETE - DELETE Request

```javascript
// Delete a user
app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const deletedUser = users.splice(index, 1)[0];
  res.json({ message: 'User deleted', user: deletedUser });
  // OR just: res.status(204).send(); // 204 = No Content
});
```

---

## 🛣️ Express Router (Modular Routes)

### routes/users.js

```javascript
const express = require('express');
const router = express.Router();

// All routes here are prefixed with /api/users
router.get('/', (req, res) => {
  res.json({ message: 'Get all users' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get user ${req.params.id}` });
});

router.post('/', (req, res) => {
  res.status(201).json({ message: 'User created', data: req.body });
});

router.put('/:id', (req, res) => {
  res.json({ message: `Update user ${req.params.id}` });
});

router.delete('/:id', (req, res) => {
  res.json({ message: `Delete user ${req.params.id}` });
});

module.exports = router;
```

### app.js (Main file)

```javascript
const express = require('express');
const usersRouter = require('./routes/users');

const app = express();

app.use(express.json());

// Mount router
app.use('/api/users', usersRouter);

app.listen(3000);
```

---

## 🔒 Middleware (IMPORTANT for Interviews!)

### Types of Middleware

```javascript
// 1. Application-level middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next(); // MUST call next() to continue
});

// 2. Route-specific middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Secret data' });
});

// 3. Error-handling middleware (4 arguments!)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 4. Built-in middleware
app.use(express.json());           // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded
app.use(express.static('public')); // Serve static files

// 5. Third-party middleware
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

app.use(cors());          // Enable CORS
app.use(helmet());        // Security headers
app.use(morgan('dev'));   // Request logging
```

### Middleware Execution Order

```javascript
// Middleware executes in ORDER they are defined!
app.use(middlewareA);  // Runs 1st
app.use(middlewareB);  // Runs 2nd
app.get('/test', middlewareC, handler); // middlewareC runs before handler
```

---

## 📊 HTTP Status Codes (Interview Must-Know!)

```javascript
// Success Codes
res.status(200).json(data);    // OK - GET success
res.status(201).json(data);    // Created - POST success
res.status(204).send();        // No Content - DELETE success

// Client Error Codes
res.status(400).json({ error: 'Bad Request' });       // Invalid input
res.status(401).json({ error: 'Unauthorized' });      // Not authenticated
res.status(403).json({ error: 'Forbidden' });         // No permission
res.status(404).json({ error: 'Not Found' });         // Resource doesn't exist
res.status(409).json({ error: 'Conflict' });          // Duplicate resource
res.status(422).json({ error: 'Validation Error' });  // Invalid data

// Server Error Codes
res.status(500).json({ error: 'Internal Server Error' });
res.status(503).json({ error: 'Service Unavailable' });
```

---

## 🔐 Request & Response Objects

### Request Object (req)

```javascript
app.post('/api/users/:id', (req, res) => {
  // URL Parameters
  req.params.id          // /api/users/123 → '123'
  
  // Query String
  req.query.search       // /api/users?search=john → 'john'
  req.query.page         // /api/users?page=2 → '2'
  
  // Request Body (POST/PUT/PATCH)
  req.body               // { name: 'John', email: 'john@test.com' }
  
  // Headers
  req.headers            // All headers
  req.headers.authorization  // 'Bearer token123'
  req.get('Content-Type')    // 'application/json'
  
  // Other
  req.method             // 'POST'
  req.path               // '/api/users/123'
  req.originalUrl        // '/api/users/123?foo=bar'
  req.ip                 // Client IP address
  req.cookies            // Cookies (requires cookie-parser)
});
```

### Response Object (res)

```javascript
app.get('/example', (req, res) => {
  // Send JSON
  res.json({ message: 'Hello' });
  
  // Send with status
  res.status(201).json({ id: 1 });
  
  // Send text
  res.send('Hello World');
  
  // Send HTML
  res.send('<h1>Hello</h1>');
  
  // Set headers
  res.set('X-Custom-Header', 'value');
  res.setHeader('Content-Type', 'text/html');
  
  // Redirect
  res.redirect('/new-url');
  res.redirect(301, '/permanent-redirect');
  
  // Send file
  res.sendFile('/path/to/file.pdf');
  
  // Download file
  res.download('/path/to/file.pdf', 'renamed.pdf');
  
  // Set cookie
  res.cookie('token', 'abc123', { httpOnly: true, maxAge: 3600000 });
  
  // Clear cookie
  res.clearCookie('token');
});
```

---

## ⚠️ Error Handling

### Async Error Handling

```javascript
// Without async error handler (errors get swallowed!)
app.get('/bad', async (req, res) => {
  const data = await someAsyncOperation(); // If this throws, Express won't catch it!
  res.json(data);
});

// With try-catch (verbose but works)
app.get('/good', async (req, res, next) => {
  try {
    const data = await someAsyncOperation();
    res.json(data);
  } catch (error) {
    next(error); // Pass to error handler
  }
});

// With wrapper function (cleaner)
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/better', asyncHandler(async (req, res) => {
  const data = await someAsyncOperation();
  res.json(data);
}));

// Express 5+ handles async errors automatically!
```

### Custom Error Class

```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// Usage
app.get('/user/:id', async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  res.json(user);
});

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});
```

---

## 📁 Serving Static Files & HTML

```javascript
const path = require('path');

// Serve static files from 'public' folder
app.use(express.static('public'));
// Now: public/style.css → http://localhost:3000/style.css

// With virtual prefix
app.use('/static', express.static('public'));
// Now: public/style.css → http://localhost:3000/static/style.css

// Serve HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Using template engine (EJS example)
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/profile', (req, res) => {
  res.render('profile', { name: 'John', age: 30 });
});
```

---

## 🗄️ Complete CRUD with MongoDB (Mongoose)

```javascript
const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydb');

// Define Schema & Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: Number,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// CREATE
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ ALL (with pagination)
app.get('/api/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments();
    
    res.json({
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ONE
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE
app.put('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Return updated doc, run schema validations
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE
app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
```

---

## 🎯 Interview Questions & Answers

### Q1: What is Express.js?
**A:** Express is a minimal, fast, and unopinionated web framework for Node.js that provides robust features for building web and mobile applications including routing, middleware support, and HTTP utilities.

### Q2: What is middleware?
**A:** Middleware are functions that have access to request (req), response (res), and next() function. They execute sequentially and can:
- Execute any code
- Modify req/res objects
- End the request-response cycle
- Call the next middleware

### Q3: Difference between PUT and PATCH?
**A:** 
- **PUT**: Replaces the entire resource
- **PATCH**: Partially updates the resource

### Q4: What is app.use() vs app.get()?
**A:**
- `app.use()`: Mounts middleware, matches ALL HTTP methods
- `app.get()`: Only handles GET requests to a specific route

### Q5: How to handle errors in Express?
**A:** Use error-handling middleware with 4 parameters: `(err, req, res, next)`. For async routes, wrap in try-catch or use asyncHandler wrapper.

### Q6: What is express.Router()?
**A:** Router is a mini Express application that can have its own middleware and routes. Used for modular, mountable route handlers.

### Q7: Difference between req.params, req.query, req.body?
**A:**
- `req.params`: URL parameters (`/users/:id` → req.params.id)
- `req.query`: Query string (`?name=john` → req.query.name)
- `req.body`: Request body from POST/PUT (needs body-parser)

---

## 📋 Project Structure (Best Practice)

```
project/
├── src/
│   ├── controllers/       # Route handlers
│   │   └── userController.js
│   ├── routes/           # Route definitions
│   │   ├── index.js
│   │   └── userRoutes.js
│   ├── models/           # Database models
│   │   └── User.js
│   ├── middleware/       # Custom middleware
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── services/         # Business logic
│   │   └── userService.js
│   ├── utils/            # Helper functions
│   │   └── helpers.js
│   ├── config/           # Configuration
│   │   └── db.js
│   └── app.js           # Express app setup
├── tests/
├── .env
├── .gitignore
├── package.json
└── server.js            # Entry point
```

---

## 🚀 Quick Setup Commands

```bash
# Initialize project
npm init -y

# Install dependencies
npm install express mongoose dotenv cors helmet morgan

# Dev dependencies
npm install -D nodemon

# Add to package.json scripts
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}

# Run
npm run dev
```

---

## 💡 Pro Tips for Interviews

1. **Always validate input** - Don't trust user data
2. **Use async/await** - Cleaner than callbacks
3. **Proper status codes** - 201 for create, 204 for delete
4. **Error handling** - Always have error middleware
5. **Environment variables** - Use dotenv for secrets
6. **Security middleware** - cors, helmet, rate-limiting
7. **Logging** - Use morgan or winston
8. **Pagination** - Never return unlimited data
9. **Versioning** - `/api/v1/users` for future-proofing
10. **RESTful naming** - Use nouns, not verbs (`/users` not `/getUsers`)

---

## 🔐 Security Best Practices in Express

### 1. Helmet - Security Headers

```javascript
const helmet = require('helmet');

// Use all default protections
app.use(helmet());

// Or configure individually
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "same-site" },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: "deny" },        // Prevents clickjacking
  hidePoweredBy: true,                   // Removes X-Powered-By header
  hsts: { maxAge: 31536000 },            // Strict Transport Security
  ieNoOpen: true,
  noSniff: true,                         // Prevents MIME sniffing
  referrerPolicy: { policy: "no-referrer" },
  xssFilter: true,                       // XSS protection
}));
```

### 2. CORS - Cross-Origin Resource Sharing

```javascript
const cors = require('cors');

// Allow all origins (NOT recommended for production)
app.use(cors());

// Allow specific origins
app.use(cors({
  origin: 'https://mywebsite.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,  // Allow cookies
  maxAge: 86400       // Cache preflight for 24 hours
}));

// Multiple origins
const allowedOrigins = ['https://app.com', 'https://admin.app.com'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
```

### 3. Rate Limiting - Prevent DDoS/Brute Force

```javascript
const rateLimit = require('express-rate-limit');

// General rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests per window
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Stricter limit for auth routes
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 5,                     // 5 login attempts
  message: { error: 'Too many login attempts' },
  skipSuccessfulRequests: true,
});

app.use('/api/auth/login', authLimiter);
```

### 4. Input Validation & Sanitization

```javascript
const { body, param, query, validationResult } = require('express-validator');

// Validation middleware
const validateUser = [
  body('email')
    .isEmail().withMessage('Invalid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/\d/).withMessage('Password must contain a number'),
  body('name')
    .trim()
    .escape()  // Prevents XSS
    .notEmpty().withMessage('Name is required'),
];

// Check validation results
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

app.post('/api/users', validateUser, handleValidation, createUser);

// Sanitize MongoDB queries (prevent NoSQL injection)
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());

// Prevent parameter pollution
const hpp = require('hpp');
app.use(hpp());
```

### 5. SQL Injection Prevention

```javascript
// NEVER do this (vulnerable!)
const query = `SELECT * FROM users WHERE id = ${req.params.id}`;

// Use parameterized queries instead
// With mysql2
const [rows] = await connection.execute(
  'SELECT * FROM users WHERE id = ?',
  [req.params.id]
);

// With pg (PostgreSQL)
const result = await pool.query(
  'SELECT * FROM users WHERE id = $1',
  [req.params.id]
);
```

### 6. XSS (Cross-Site Scripting) Prevention

```javascript
const xss = require('xss');

// Sanitize user input
app.post('/api/comments', (req, res) => {
  const sanitizedComment = xss(req.body.comment);
  // Save sanitizedComment to database
});

// With express-validator
body('comment').escape();  // Converts < > & to HTML entities

// Set Content-Type header
res.setHeader('Content-Type', 'application/json');  // Not text/html
```

### 7. Authentication Security

```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Hash password (never store plain text!)
const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Verify password
const isMatch = await bcrypt.compare(password, hashedPassword);

// JWT best practices
const token = jwt.sign(
  { userId: user._id, role: user.role },
  process.env.JWT_SECRET,
  {
    expiresIn: '15m',        // Short expiry
    algorithm: 'HS256',
    issuer: 'your-app-name',
    audience: 'your-app-users'
  }
);

// Verify JWT middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

### 8. Cookie Security

```javascript
const cookieParser = require('cookie-parser');

app.use(cookieParser());

// Set secure cookie
res.cookie('session', sessionId, {
  httpOnly: true,      // Not accessible via JavaScript
  secure: true,        // Only sent over HTTPS
  sameSite: 'strict',  // CSRF protection
  maxAge: 3600000,     // 1 hour
  signed: true,        // Signed cookie
  domain: '.yoursite.com',
  path: '/'
});

// Read signed cookie
const session = req.signedCookies.session;
```

### 9. HTTPS & SSL

```javascript
const https = require('https');
const fs = require('fs');

// Force HTTPS in production
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

// Create HTTPS server
const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem')
};

https.createServer(options, app).listen(443);
```

### 10. Environment Variables Security

```javascript
// .env file (NEVER commit to git!)
DB_URI=mongodb://localhost:27017/mydb
JWT_SECRET=super-secret-key-min-32-chars-long
API_KEY=your-api-key

// Load with dotenv
require('dotenv').config();

// Access
const dbUri = process.env.DB_URI;

// Validate required env vars
const requiredEnvVars = ['DB_URI', 'JWT_SECRET', 'API_KEY'];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Missing required env var: ${varName}`);
    process.exit(1);
  }
});
```

### 11. File Upload Security

```javascript
const multer = require('multer');
const path = require('path');

// Configure safe file upload
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    // Generate safe filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,  // 5MB limit
    files: 1                     // Single file only
  },
  fileFilter: (req, file, cb) => {
    // Allow only specific file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type'));
  }
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  res.json({ filename: req.file.filename });
});
```

---

## 📝 Express Interview Questions (Advanced)

### Q8: How does Express handle multiple middleware?
**A:** Express uses a middleware stack. Each middleware can:
1. Execute code
2. Modify req/res
3. Call `next()` to pass control
4. End the cycle with `res.send()`

Middleware runs in the order defined. If `next()` isn't called, the request hangs.

### Q9: What is `next('route')` vs `next()`?
**A:**
- `next()` - Passes to next middleware in stack
- `next('route')` - Skips remaining middleware in current route, moves to next route
- `next(error)` - Skips to error-handling middleware

```javascript
app.get('/user/:id',
  (req, res, next) => {
    if (req.params.id === '0') {
      return next('route');  // Skip to next route
    }
    next();  // Continue to next middleware
  },
  (req, res) => {
    res.send('Regular user');
  }
);

app.get('/user/:id', (req, res) => {
  res.send('Special user 0');  // Only reached if next('route') called
});
```

### Q10: Difference between `app.use()` and `app.all()`?
**A:**
- `app.use('/path')` - Matches `/path`, `/path/anything`, `/path/foo/bar`
- `app.all('/path')` - Matches only exact `/path`

```javascript
app.use('/api', middleware);    // Matches /api, /api/users, /api/users/1
app.all('/api', middleware);    // Matches only /api
```

### Q11: What is `req.app`?
**A:** Reference to the Express application. Useful for accessing app settings from middleware:

```javascript
app.set('title', 'My App');

app.use((req, res, next) => {
  console.log(req.app.get('title'));  // 'My App'
  next();
});
```

### Q12: How to handle 404 errors in Express?
**A:** Add a catch-all middleware at the end:

```javascript
// All routes above...

// 404 handler (must be AFTER all routes)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler (must be LAST)
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
```

### Q13: What are route parameters vs query parameters?
**A:**

| Feature | Route Params | Query Params |
|---------|--------------|--------------|
| URL | `/users/:id` | `/users?id=1` |
| Access | `req.params.id` | `req.query.id` |
| Required | Yes | Optional |
| Use case | Identify resource | Filter/sort/paginate |

### Q14: How to handle request timeout?
**A:**

```javascript
const timeout = require('connect-timeout');

// Global timeout
app.use(timeout('30s'));

// Per-route timeout
app.get('/slow', timeout('5s'), (req, res) => {
  // Check if timed out
  if (!req.timedout) {
    res.send('Done');
  }
});

// Handle timeout
app.use((req, res, next) => {
  if (req.timedout) {
    res.status(503).json({ error: 'Request timeout' });
  }
  next();
});
```

### Q15: What is trust proxy and when to use it?
**A:** When Express runs behind a proxy (nginx, load balancer), client IP and protocol info is lost. `trust proxy` tells Express to trust proxy headers:

```javascript
app.set('trust proxy', 1);  // Trust first proxy

// Now these work correctly:
req.ip           // Client's real IP (from X-Forwarded-For)
req.protocol     // https (from X-Forwarded-Proto)
req.secure       // true if HTTPS
req.hostname     // Original hostname
```

### Q16: How to implement versioning in APIs?
**A:**

```javascript
// Method 1: URL versioning (most common)
app.use('/api/v1/users', usersV1Router);
app.use('/api/v2/users', usersV2Router);

// Method 2: Header versioning
app.use('/api/users', (req, res, next) => {
  const version = req.headers['api-version'] || '1';
  req.apiVersion = version;
  next();
});

// Method 3: Query parameter
app.get('/api/users', (req, res) => {
  const version = req.query.v || '1';
  // Route based on version
});
```

### Q17: What is Express Generator?
**A:** CLI tool to scaffold Express apps quickly:

```bash
npx express-generator myapp
cd myapp
npm install
npm start
```

Creates project with views, routes, public folder, and basic middleware.

### Q18: Difference between `res.send()` and `res.json()`?
**A:**
- `res.send()` - Sends response of any type (string, object, Buffer)
- `res.json()` - Explicitly sends JSON, sets Content-Type to application/json

`res.json()` also converts non-objects to JSON and handles `null`/`undefined`.

### Q19: How to implement graceful shutdown?
**A:**

```javascript
const server = app.listen(3000);

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

function gracefulShutdown() {
  console.log('Shutting down gracefully...');
  
  server.close(() => {
    console.log('HTTP server closed');
    
    // Close database connections
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
  
  // Force shutdown after 30s
  setTimeout(() => {
    console.error('Forcing shutdown');
    process.exit(1);
  }, 30000);
}
```

### Q20: What is `express.json()` vs `body-parser`?
**A:** Since Express 4.16+, `express.json()` and `express.urlencoded()` are built-in. They are wrappers around `body-parser`. No need to install `body-parser` separately anymore.

```javascript
// Modern (Express 4.16+)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Legacy (still works)
const bodyParser = require('body-parser');
app.use(bodyParser.json());
```

---

## 🛡️ Security Checklist for Production

```
✅ Use HTTPS (SSL/TLS)
✅ Set security headers with Helmet
✅ Enable CORS with specific origins
✅ Implement rate limiting
✅ Validate and sanitize all inputs
✅ Use parameterized queries (prevent SQL injection)
✅ Hash passwords with bcrypt (12+ rounds)
✅ Use short-lived JWTs with refresh tokens
✅ Set secure cookie flags (httpOnly, secure, sameSite)
✅ Keep dependencies updated (npm audit)
✅ Never expose stack traces in production
✅ Log security events (failed logins, suspicious activity)
✅ Implement request timeout
✅ Limit file upload size and types
✅ Use environment variables for secrets
✅ Enable HSTS (HTTP Strict Transport Security)
✅ Implement graceful shutdown
✅ Don't trust user input - ever!
```
