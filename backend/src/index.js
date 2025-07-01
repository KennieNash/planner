const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateJWT = require('./middleware/auth');
const authorizeRoles = require('./middleware/roles');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

app.use(cors());
app.use(express.json());

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, role } = req.body;
    if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role,
      },
    });
    res.status(201).json({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, phone: user.phone, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Profile update endpoint (protected)
app.put('/api/profile', authenticateJWT, async (req, res) => {
  try {
    const { id, firstName, lastName, phone } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'Missing user id' });
    }
    // Only allow the user to update their own profile
    if (req.user.id !== id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const user = await prisma.user.update({
      where: { id },
      data: { firstName, lastName, phone },
    });
    res.json({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, phone: user.phone, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Profile update failed' });
  }
});

// Get current user info (protected)
app.get('/api/me', authenticateJWT, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
      },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user info' });
  }
});

// Example admin-only endpoint
app.get('/api/admin', authenticateJWT, authorizeRoles('ADMIN'), (req, res) => {
  res.json({ message: 'Welcome, admin!' });
});

// Provider creates a new service (provider only)
app.post('/api/services', authenticateJWT, authorizeRoles('PROVIDER'), async (req, res) => {
  try {
    const { name, description, price } = req.body;
    if (!name || !description || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const service = await prisma.service.create({
      data: {
        name,
        description,
        price,
        providerId: req.user.id,
      },
    });
    res.status(201).json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// User creates a new service request (user only)
app.post('/api/requests', authenticateJWT, authorizeRoles('USER'), async (req, res) => {
  try {
    const { serviceId, details } = req.body;
    if (!serviceId || !details) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const request = await prisma.request.create({
      data: {
        serviceId,
        userId: req.user.id,
        details,
      },
    });
    res.status(201).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create request' });
  }
});

// Get all services for the current provider (provider only)
app.get('/api/services', authenticateJWT, authorizeRoles('PROVIDER'), async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: { providerId: req.user.id },
    });
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Update a service (provider only)
app.put('/api/services/:id', authenticateJWT, authorizeRoles('PROVIDER'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;
    // Ensure the service belongs to the provider
    const service = await prisma.service.findUnique({ where: { id: Number(id) } });
    if (!service || service.providerId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const updated = await prisma.service.update({
      where: { id: Number(id) },
      data: { name, description, price },
    });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// Delete a service (provider only)
app.delete('/api/services/:id', authenticateJWT, authorizeRoles('PROVIDER'), async (req, res) => {
  try {
    const { id } = req.params;
    const service = await prisma.service.findUnique({ where: { id: Number(id) } });
    if (!service || service.providerId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await prisma.service.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// Get all requests for the current user (user only)
app.get('/api/requests', authenticateJWT, authorizeRoles('USER'), async (req, res) => {
  try {
    const requests = await prisma.request.findMany({
      where: { userId: req.user.id },
    });
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Update a request (user only)
app.put('/api/requests/:id', authenticateJWT, authorizeRoles('USER'), async (req, res) => {
  try {
    const { id } = req.params;
    const { details } = req.body;
    // Ensure the request belongs to the user
    const request = await prisma.request.findUnique({ where: { id: Number(id) } });
    if (!request || request.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const updated = await prisma.request.update({
      where: { id: Number(id) },
      data: { details },
    });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update request' });
  }
});

// Delete a request (user only)
app.delete('/api/requests/:id', authenticateJWT, authorizeRoles('USER'), async (req, res) => {
  try {
    const { id } = req.params;
    const request = await prisma.request.findUnique({ where: { id: Number(id) } });
    if (!request || request.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await prisma.request.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete request' });
  }
});

// Create a new message thread for a service request (user or provider, only if participant)
app.post('/api/threads', authenticateJWT, authorizeRoles('USER', 'PROVIDER'), async (req, res) => {
  try {
    const { serviceRequestId } = req.body;
    if (!serviceRequestId) {
      return res.status(400).json({ error: 'Missing serviceRequestId' });
    }
    // Check if user is a participant in the service request
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: serviceRequestId },
    });
    if (!serviceRequest) return res.status(404).json({ error: 'Service request not found' });
    const userId = req.user.id;
    if (userId !== serviceRequest.customerId) {
      // Check if provider
      const service = await prisma.service.findUnique({ where: { id: serviceRequest.serviceId } });
      if (!service || userId !== service.providerId) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }
    // Only one thread per service request
    let thread = await prisma.messageThread.findUnique({ where: { serviceRequestId } });
    if (!thread) {
      thread = await prisma.messageThread.create({ data: { serviceRequestId } });
    }
    res.status(201).json(thread);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create thread' });
  }
});

// List all threads for the current user (user or provider, as participant)
app.get('/api/threads', authenticateJWT, authorizeRoles('USER', 'PROVIDER'), async (req, res) => {
  try {
    const userId = req.user.id;
    // Find all threads where the user is the customer or provider
    const customerThreads = await prisma.messageThread.findMany({
      where: {
        serviceRequest: {
          customerId: userId,
        },
      },
      include: { serviceRequest: true },
    });
    const providerThreads = await prisma.messageThread.findMany({
      where: {
        serviceRequest: {
          service: {
            providerId: userId,
          },
        },
      },
      include: { serviceRequest: true },
    });
    // Merge and deduplicate threads
    const threadsMap = new Map();
    [...customerThreads, ...providerThreads].forEach(t => threadsMap.set(t.id, t));
    res.json(Array.from(threadsMap.values()));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch threads' });
  }
});

// Send a message (user or provider, must be participant in thread)
app.post('/api/messages', authenticateJWT, authorizeRoles('USER', 'PROVIDER'), async (req, res) => {
  try {
    const { threadId, content, type } = req.body;
    if (!threadId || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Check if user is a participant in the thread
    const thread = await prisma.messageThread.findUnique({
      where: { id: threadId },
      include: { serviceRequest: true },
    });
    if (!thread) return res.status(404).json({ error: 'Thread not found' });
    // Only allow if user is the customer or provider for the service request
    const userId = req.user.id;
    const customerId = thread.serviceRequest.customerId;
    const service = await prisma.service.findUnique({ where: { id: thread.serviceRequest.serviceId } });
    const providerId = service ? service.providerId : null;
    if (userId !== customerId && userId !== providerId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const message = await prisma.message.create({
      data: {
        threadId,
        senderId: userId,
        content,
        type: type || 'TEXT',
      },
    });
    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get all messages in a thread (user or provider, must be participant)
app.get('/api/messages/:threadId', authenticateJWT, authorizeRoles('USER', 'PROVIDER'), async (req, res) => {
  try {
    const { threadId } = req.params;
    const thread = await prisma.messageThread.findUnique({
      where: { id: threadId },
      include: { serviceRequest: true },
    });
    if (!thread) return res.status(404).json({ error: 'Thread not found' });
    // Only allow if user is the customer or provider for the service request
    const userId = req.user.id;
    const customerId = thread.serviceRequest.customerId;
    const service = await prisma.service.findUnique({ where: { id: thread.serviceRequest.serviceId } });
    const providerId = service ? service.providerId : null;
    if (userId !== customerId && userId !== providerId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const messages = await prisma.message.findMany({
      where: { threadId },
      orderBy: { createdAt: 'asc' },
    });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
}); 