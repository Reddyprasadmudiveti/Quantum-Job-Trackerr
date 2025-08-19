const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const { AUTH } = require('../database/jobSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

describe('User Profile API Endpoints', () => {
  let token;
  let userId;
  
  // Setup test user before tests
  beforeAll(async () => {
    // Clear test users
    await AUTH.deleteMany({ email: 'test@example.com' });
    
    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const testUser = new AUTH({
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: hashedPassword,
      isVerified: true
    });
    
    const savedUser = await testUser.save();
    userId = savedUser._id;
    
    // Generate token for test user
    token = jwt.sign(
      { id: userId, email: 'test@example.com' },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });
  
  // Clean up after tests
  afterAll(async () => {
    await AUTH.deleteMany({ email: 'test@example.com' });
    await mongoose.connection.close();
  });
  
  describe('GET /api/user/profile', () => {
    test('should return user profile when authenticated', async () => {
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user.firstName).toBe('Test');
      expect(response.body.user.lastName).toBe('User');
    });
    
    test('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/user/profile');
      
      expect(response.status).toBe(401);
    });
  });
  
  describe('PUT /api/user/profile', () => {
    test('should update user profile when authenticated', async () => {
      const updatedProfile = {
        firstName: 'Updated',
        lastName: 'Name',
        profilePicture: 'https://example.com/updated.jpg'
      };
      
      const response = await request(app)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(updatedProfile);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.firstName).toBe('Updated');
      expect(response.body.user.lastName).toBe('Name');
      expect(response.body.user.profilePicture).toBe('https://example.com/updated.jpg');
      
      // Verify database was updated
      const updatedUser = await AUTH.findById(userId);
      expect(updatedUser.firstName).toBe('Updated');
      expect(updatedUser.lastName).toBe('Name');
    });
    
    test('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .put('/api/user/profile')
        .send({ firstName: 'Test' });
      
      expect(response.status).toBe(401);
    });
  });
  
  describe('PUT /api/user/password', () => {
    test('should update password when current password is correct', async () => {
      const passwordData = {
        currentPassword: 'password123',
        newPassword: 'newPassword123'
      };
      
      const response = await request(app)
        .put('/api/user/password')
        .set('Authorization', `Bearer ${token}`)
        .send(passwordData);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Password updated successfully');
      
      // Verify password was updated
      const updatedUser = await AUTH.findById(userId);
      const passwordMatch = await bcrypt.compare('newPassword123', updatedUser.password);
      expect(passwordMatch).toBe(true);
    });
    
    test('should return 400 when current password is incorrect', async () => {
      const passwordData = {
        currentPassword: 'wrongPassword',
        newPassword: 'newPassword456'
      };
      
      const response = await request(app)
        .put('/api/user/password')
        .set('Authorization', `Bearer ${token}`)
        .send(passwordData);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Current password is incorrect');
    });
    
    test('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .put('/api/user/password')
        .send({
          currentPassword: 'password123',
          newPassword: 'newPassword123'
        });
      
      expect(response.status).toBe(401);
    });
  });
});