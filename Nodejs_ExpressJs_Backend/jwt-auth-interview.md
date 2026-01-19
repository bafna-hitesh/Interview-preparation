# JWT, Authentication & Authorization - Interview Guide

## Table of Contents
1. [Authentication vs Authorization](#authentication-vs-authorization)
2. [What is JWT?](#what-is-jwt)
3. [JWT Structure](#jwt-structure)
4. [How JWT Works](#how-jwt-works)
5. [Authentication Strategies](#authentication-strategies)
6. [Token Storage](#token-storage)
7. [Security Best Practices](#security-best-practices)
8. [Common Interview Questions](#common-interview-questions)
9. [Code Examples](#code-examples)

---

## Authentication vs Authorization

### Authentication (AuthN)
**"Who are you?"**

Authentication is the process of verifying the identity of a user or system.

```
User provides credentials → System verifies → Identity confirmed
```

**Examples:**
- Username/password login
- Biometric scan (fingerprint, face ID)
- Two-factor authentication (2FA)
- OAuth login (Google, GitHub)

### Authorization (AuthZ)
**"What can you do?"**

Authorization determines what resources a user can access after authentication.

```
User authenticated → Check permissions → Grant/Deny access
```

**Examples:**
- Role-based access (Admin, User, Guest)
- Resource permissions (read, write, delete)
- API scopes (read:users, write:posts)

### Key Differences

| Aspect | Authentication | Authorization |
|--------|---------------|---------------|
| Purpose | Verify identity | Grant permissions |
| Order | Happens first | Happens after authentication |
| Question | "Who are you?" | "What can you access?" |
| Data | Credentials | Permissions/Roles |
| Response | Token/Session | Allow/Deny |

---

## What is JWT?

**JWT (JSON Web Token)** is an open standard (RFC 7519) for securely transmitting information between parties as a JSON object. This information is digitally signed and can be verified and trusted.

### Key Characteristics:
- **Self-contained**: Contains all user information needed
- **Stateless**: Server doesn't need to store session data
- **Compact**: Can be sent via URL, POST body, or HTTP header
- **Signed**: Ensures data integrity and authenticity

### When to Use JWT:
1. **Authorization**: Most common use case - after login, subsequent requests include JWT
2. **Information Exchange**: Securely transmit information between parties
3. **Single Sign-On (SSO)**: One token works across multiple services
4. **API Authentication**: Stateless authentication for REST APIs

---

## JWT Structure

A JWT consists of three parts separated by dots (`.`):

```
xxxxx.yyyyy.zzzzz
Header.Payload.Signature
```

### 1. Header
Contains metadata about the token type and signing algorithm.

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Common Algorithms:**
- `HS256` - HMAC with SHA-256 (symmetric)
- `RS256` - RSA with SHA-256 (asymmetric)
- `ES256` - ECDSA with SHA-256 (asymmetric)

### 2. Payload (Claims)
Contains the actual data (claims) about the user/entity.

```json
{
  "sub": "1234567890",
  "name": "Hitesh Bafna",
  "email": "hitesh@example.com",
  "role": "admin",
  "iat": 1516239022,
  "exp": 1516242622
}
```

**Types of Claims:**

| Type | Description | Examples |
|------|-------------|----------|
| **Registered** | Predefined, recommended claims | `iss`, `sub`, `exp`, `iat`, `aud` |
| **Public** | Defined by users, should be registered | `name`, `email` |
| **Private** | Custom claims agreed between parties | `role`, `userId` |

**Common Registered Claims:**
- `iss` (issuer): Who issued the token
- `sub` (subject): Who the token is about
- `aud` (audience): Who the token is intended for
- `exp` (expiration): When the token expires
- `iat` (issued at): When the token was issued
- `nbf` (not before): Token not valid before this time
- `jti` (JWT ID): Unique identifier for the token

### 3. Signature
Ensures the token hasn't been tampered with.

```javascript
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

### Complete JWT Example:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkhpdGVzaCBCYWZuYSIsImlhdCI6MTUxNjIzOTAyMn0.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

---

## How JWT Works

### Authentication Flow:

```
┌─────────┐                                    ┌─────────┐
│  Client │                                    │  Server │
└────┬────┘                                    └────┬────┘
     │                                              │
     │  1. POST /login {username, password}        │
     │─────────────────────────────────────────────>│
     │                                              │
     │                          2. Validate credentials
     │                          3. Generate JWT token
     │                                              │
     │  4. Response { token: "eyJhbGc..." }        │
     │<─────────────────────────────────────────────│
     │                                              │
     │  5. Store token (localStorage/cookie)       │
     │                                              │
     │  6. GET /api/profile                        │
     │  Authorization: Bearer eyJhbGc...           │
     │─────────────────────────────────────────────>│
     │                                              │
     │                          7. Verify JWT signature
     │                          8. Extract user from payload
     │                          9. Check authorization
     │                                              │
     │  10. Response { user data }                 │
     │<─────────────────────────────────────────────│
```

### Step-by-Step Process:

1. **User Login**: Client sends credentials to server
2. **Verify Credentials**: Server validates username/password
3. **Generate Token**: Server creates JWT with user info
4. **Return Token**: Server sends JWT to client
5. **Store Token**: Client stores JWT (localStorage, cookie)
6. **Authenticated Request**: Client includes JWT in Authorization header
7. **Verify Token**: Server verifies JWT signature
8. **Extract Claims**: Server reads user info from payload
9. **Process Request**: Server handles the request
10. **Return Response**: Server sends response to client

---

## Authentication Strategies

### 1. Session-Based Authentication

```
Client ─────> Login ─────> Server creates session
                              │
                              ▼
                         Session stored in
                         memory/database
                              │
                              ▼
Client <───── Session ID ────┘
(stored in cookie)
```

**Pros:**
- Easy to invalidate sessions
- Server has full control
- Simpler implementation

**Cons:**
- Server needs to store session state
- Scaling requires shared session storage
- CSRF vulnerabilities with cookies

### 2. Token-Based Authentication (JWT)

```
Client ─────> Login ─────> Server creates JWT
                              │
                              ▼
                         JWT signed with secret
                         (NOT stored on server)
                              │
                              ▼
Client <───── JWT token ─────┘
```

**Pros:**
- Stateless (no server storage)
- Easy to scale horizontally
- Works well with microservices
- Mobile-friendly

**Cons:**
- Cannot invalidate tokens easily
- Token size can be large
- Payload is only encoded, not encrypted

### 3. OAuth 2.0

**Authorization framework** for granting third-party access without sharing credentials.

**Grant Types:**
- **Authorization Code**: Web apps (most secure)
- **Implicit**: SPAs (deprecated)
- **Client Credentials**: Machine-to-machine
- **Password**: Direct username/password (discouraged)
- **Refresh Token**: Get new access token

### 4. API Keys

Simple authentication using a unique key per client.

```
GET /api/data
X-API-Key: abc123xyz789
```

**Best for:**
- Server-to-server communication
- Public APIs with rate limiting
- Simple integrations

---

## Token Storage

### Where to Store JWT?

| Storage | Security | XSS Vulnerable | CSRF Vulnerable |
|---------|----------|----------------|-----------------|
| localStorage | Low | Yes | No |
| sessionStorage | Medium | Yes | No |
| Cookie (httpOnly) | High | No | Yes |
| Memory (variable) | Highest | No | No |

### Recommendations:

**For Web Applications:**
```javascript
// Best: HttpOnly cookie with CSRF protection
res.cookie('token', jwt, {
  httpOnly: true,      // Prevents XSS access
  secure: true,        // HTTPS only
  sameSite: 'strict',  // Prevents CSRF
  maxAge: 3600000      // 1 hour
});
```

**For Mobile Apps:**
- Use secure storage (Keychain for iOS, Keystore for Android)
- Never store in plain text

**For SPAs (if not using cookies):**
```javascript
// Store in memory, refresh on page load
let accessToken = null;

function setToken(token) {
  accessToken = token;
}

function getToken() {
  return accessToken;
}
```

---

## Security Best Practices

### 1. Token Expiration

```javascript
// Short-lived access tokens (15-60 minutes)
const accessToken = jwt.sign(payload, secret, { expiresIn: '15m' });

// Long-lived refresh tokens (7-30 days)
const refreshToken = jwt.sign({ userId }, refreshSecret, { expiresIn: '7d' });
```

### 2. Refresh Token Rotation

```javascript
// When refresh token is used, issue new refresh token
app.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  
  // Verify refresh token
  const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
  
  // Generate new tokens
  const newAccessToken = generateAccessToken(decoded.userId);
  const newRefreshToken = generateRefreshToken(decoded.userId);
  
  // Invalidate old refresh token (store in blacklist)
  await blacklistToken(refreshToken);
  
  res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
});
```

### 3. Token Blacklisting (for logout)

```javascript
// Redis-based blacklist
const blacklist = new Set(); // Use Redis in production

function blacklistToken(token) {
  blacklist.add(token);
}

function isBlacklisted(token) {
  return blacklist.has(token);
}

// Middleware to check blacklist
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (isBlacklisted(token)) {
    return res.status(401).json({ error: 'Token revoked' });
  }
  
  // Continue with normal verification
}
```

### 4. Use Strong Secrets

```javascript
// Bad: Weak secret
const secret = 'mysecret';

// Good: Strong, random secret (256 bits minimum)
const secret = crypto.randomBytes(64).toString('hex');
// Or use environment variable
const secret = process.env.JWT_SECRET;
```

### 5. Validate All Claims

```javascript
jwt.verify(token, secret, {
  algorithms: ['HS256'],      // Prevent algorithm confusion
  issuer: 'your-app',         // Validate issuer
  audience: 'your-api',       // Validate audience
  clockTolerance: 30          // 30 seconds tolerance for exp
});
```

### 6. Never Store Sensitive Data in JWT

```javascript
// Bad: Sensitive data in payload
{
  "password": "hashed_password",
  "creditCard": "1234-5678-9012-3456"
}

// Good: Only necessary identifiers
{
  "sub": "user_123",
  "role": "admin"
}
```

### 7. Use HTTPS Only

```javascript
// Always use secure cookies in production
res.cookie('token', jwt, {
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'strict'
});
```

---

## Common Interview Questions

### Basic Questions

**Q1: What is the difference between authentication and authorization?**

**Answer:** Authentication verifies identity ("Who are you?") through credentials like username/password. Authorization determines access permissions ("What can you do?") after authentication is complete. Authentication always happens before authorization.

---

**Q2: What is JWT and what are its components?**

**Answer:** JWT (JSON Web Token) is a compact, URL-safe token format for securely transmitting information. It has three parts:
1. **Header**: Algorithm and token type
2. **Payload**: Claims/data about the user
3. **Signature**: Verification hash to ensure integrity

---

**Q3: Why use JWT over sessions?**

**Answer:**
- **Stateless**: Server doesn't store session data
- **Scalable**: Works across multiple servers without shared storage
- **Cross-domain**: Works well with microservices and APIs
- **Mobile-friendly**: Easy to use with mobile apps
- **Self-contained**: All needed info is in the token

---

**Q4: Where should you store JWT tokens?**

**Answer:** The most secure option for web apps is **HttpOnly cookies** with `secure` and `sameSite` flags. This prevents XSS attacks. For SPAs without cookie support, store in memory (JavaScript variable) and use refresh tokens. Avoid localStorage for sensitive tokens as it's vulnerable to XSS.

---

### Intermediate Questions

**Q5: How do you handle JWT expiration?**

**Answer:** Use a dual-token strategy:
1. **Access Token**: Short-lived (15-60 minutes) for API requests
2. **Refresh Token**: Long-lived (days/weeks) to get new access tokens

When access token expires, client uses refresh token to get a new access token without re-login.

```javascript
// Access token expired
if (error.status === 401) {
  const newAccessToken = await refreshAccessToken();
  // Retry original request with new token
}
```

---

**Q6: How do you invalidate/revoke a JWT?**

**Answer:** Since JWTs are stateless, you need additional mechanisms:
1. **Token Blacklist**: Store revoked tokens in Redis/database
2. **Short Expiration**: Use very short-lived tokens
3. **Refresh Token Rotation**: Issue new refresh token on each use, invalidate old one
4. **Version Field**: Store token version in database, increment on logout

---

**Q7: What is the difference between HS256 and RS256?**

**Answer:**

| Aspect | HS256 | RS256 |
|--------|-------|-------|
| Type | Symmetric | Asymmetric |
| Key | Single shared secret | Public/Private key pair |
| Sign | Secret key | Private key |
| Verify | Same secret key | Public key |
| Use case | Single service | Distributed systems |
| Speed | Faster | Slower |

RS256 is preferred when multiple services need to verify tokens but only one should sign them.

---

**Q8: Explain the OAuth 2.0 Authorization Code flow.**

**Answer:**
1. User clicks "Login with Google"
2. App redirects to Google with client_id and redirect_uri
3. User logs in and grants permission
4. Google redirects back with authorization code
5. App exchanges code for access token (server-side)
6. App uses access token to fetch user info
7. App creates session/JWT for the user

---

### Advanced Questions

**Q9: What is JWT algorithm confusion attack and how to prevent it?**

**Answer:** Attacker changes algorithm from RS256 to HS256 and signs with the public key (treating it as HMAC secret). Prevention:
1. Always specify allowed algorithms explicitly
2. Never accept algorithm from token header
3. Use asymmetric algorithms with proper key validation

```javascript
// Vulnerable
jwt.verify(token, publicKey);

// Secure
jwt.verify(token, publicKey, { algorithms: ['RS256'] });
```

---

**Q10: How would you implement role-based access control (RBAC) with JWT?**

**Answer:**
```javascript
// Include role in JWT payload
const token = jwt.sign({
  userId: user.id,
  role: 'admin',
  permissions: ['read:users', 'write:users', 'delete:users']
}, secret);

// Middleware to check role
function requireRole(roles) {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

// Usage
app.delete('/users/:id', requireRole(['admin']), deleteUser);
```

---

**Q11: What are the security risks of JWT and how to mitigate them?**

**Answer:**

| Risk | Mitigation |
|------|------------|
| Token theft | HttpOnly cookies, short expiration |
| XSS attacks | Don't store in localStorage |
| CSRF attacks | SameSite cookies, CSRF tokens |
| Algorithm confusion | Whitelist algorithms |
| Weak secrets | Use 256+ bit random secrets |
| Token tampering | Always verify signature |
| Information leakage | Don't store sensitive data in payload |

---

**Q12: How do you handle authentication in a microservices architecture?**

**Answer:**
1. **API Gateway Pattern**: Single entry point validates JWT
2. **Token Introspection**: Services verify tokens with auth service
3. **Public Key Distribution**: Services verify with shared public key
4. **Service-to-Service Auth**: Use client credentials grant

```
                    ┌─────────────┐
                    │ Auth Service │
                    └──────┬──────┘
                           │ Issue JWT
    ┌──────────────────────┼──────────────────────┐
    │                      │                      │
    ▼                      ▼                      ▼
┌────────┐           ┌────────┐            ┌────────┐
│Service A│           │Service B│            │Service C│
└────────┘           └────────┘            └────────┘
    │                      │                      │
    └──────────────────────┴──────────────────────┘
              All services verify with
              shared public key
```

---

**Q13: What is the difference between ID Token and Access Token in OIDC?**

**Answer:**

| Aspect | ID Token | Access Token |
|--------|----------|--------------|
| Purpose | User identity | API authorization |
| Audience | Client app | Resource server |
| Contains | User info (claims) | Scopes/permissions |
| Validate | Client verifies | API verifies |
| Format | Always JWT | JWT or opaque |

---

## Code Examples

### Complete JWT Authentication System

```javascript
// auth.js - JWT Authentication Module
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRY = '15m';
const REFRESH_EXPIRY = '7d';

// Generate tokens
function generateTokens(user) {
  const accessToken = jwt.sign(
    { 
      userId: user.id, 
      email: user.email,
      role: user.role 
    },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRY }
  );
  
  const refreshToken = jwt.sign(
    { userId: user.id },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRY }
  );
  
  return { accessToken, refreshToken };
}

// Verify access token
function verifyAccessToken(token) {
  try {
    return jwt.verify(token, ACCESS_SECRET);
  } catch (error) {
    throw new Error('Invalid access token');
  }
}

// Verify refresh token
function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
}

module.exports = { generateTokens, verifyAccessToken, verifyRefreshToken };
```

### Authentication Middleware

```javascript
// middleware/auth.js
const { verifyAccessToken } = require('./auth');

// Protect routes
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Role-based authorization
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
}

module.exports = { authenticate, authorize };
```

### Express Routes

```javascript
// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const { generateTokens, verifyRefreshToken } = require('./auth');
const { authenticate, authorize } = require('./middleware/auth');
const User = require('./models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role: 'user'
    });
    
    // Generate tokens
    const tokens = generateTokens(user);
    
    // Set refresh token as HttpOnly cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.status(201).json({
      message: 'User created successfully',
      accessToken: tokens.accessToken,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate tokens
    const tokens = generateTokens(user);
    
    // Set refresh token as HttpOnly cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.json({
      accessToken: tokens.accessToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ error: 'No refresh token' });
    }
    
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Get user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    // Generate new tokens
    const tokens = generateTokens(user);
    
    // Set new refresh token
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.json({ accessToken: tokens.accessToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  
  res.json({ message: 'Logged out successfully' });
});

// Protected route example
router.get('/profile', authenticate, async (req, res) => {
  const user = await User.findById(req.user.userId).select('-password');
  res.json(user);
});

// Admin only route
router.get('/admin/users', authenticate, authorize('admin'), async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

module.exports = router;
```

### Frontend Token Handling

```javascript
// auth-service.js - Frontend
class AuthService {
  constructor() {
    this.accessToken = null;
  }
  
  async login(email, password) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Important for cookies
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const data = await response.json();
    this.accessToken = data.accessToken;
    return data.user;
  }
  
  async refreshToken() {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include'
    });
    
    if (!response.ok) {
      this.accessToken = null;
      throw new Error('Session expired');
    }
    
    const data = await response.json();
    this.accessToken = data.accessToken;
    return this.accessToken;
  }
  
  async fetchWithAuth(url, options = {}) {
    // Add authorization header
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${this.accessToken}`
    };
    
    let response = await fetch(url, { ...options, headers, credentials: 'include' });
    
    // If 401, try to refresh token
    if (response.status === 401) {
      try {
        await this.refreshToken();
        headers['Authorization'] = `Bearer ${this.accessToken}`;
        response = await fetch(url, { ...options, headers, credentials: 'include' });
      } catch (error) {
        // Redirect to login
        window.location.href = '/login';
        throw error;
      }
    }
    
    return response;
  }
  
  async logout() {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    this.accessToken = null;
  }
}

export default new AuthService();
```

---

## Quick Reference Cheatsheet

### JWT Verification Checklist
- [ ] Verify signature with correct algorithm
- [ ] Check expiration (`exp`)
- [ ] Validate issuer (`iss`)
- [ ] Validate audience (`aud`)
- [ ] Check token blacklist (if implemented)

### Security Checklist
- [ ] Use HTTPS in production
- [ ] Strong secrets (256+ bits)
- [ ] Short access token expiry
- [ ] HttpOnly cookies for refresh tokens
- [ ] Implement token rotation
- [ ] Rate limit auth endpoints
- [ ] Log authentication events

### Common HTTP Status Codes
| Code | Meaning | When to Use |
|------|---------|-------------|
| 200 | OK | Successful authentication |
| 201 | Created | User registered |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Invalid/missing token |
| 403 | Forbidden | Valid token, no permission |
| 429 | Too Many Requests | Rate limited |

---

## Additional Resources

- [JWT.io](https://jwt.io/) - JWT debugger and library list
- [RFC 7519](https://tools.ietf.org/html/rfc7519) - JWT specification
- [OAuth 2.0](https://oauth.net/2/) - OAuth 2.0 documentation
- [OWASP Authentication Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

*Last updated: January 2026*
