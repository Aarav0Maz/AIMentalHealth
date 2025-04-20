import { test, expect } from '@playwright/test';

// Test suite for the backend API
test.describe('Backend API Tests', () => {
  // Test the chat API endpoint
  test('should get a response from the chat API', async ({ request }) => {
    // Send a POST request to the chat API
    const response = await request.post('http://localhost:8000/api/ai/chat', {
      data: {
        messages: [
          {
            role: 'user',
            content: 'Hello, how are you?'
          }
        ],
        user_id: 'test_user'
      }
    });
    
    // Check if the response is successful
    expect(response.status()).toBe(200);
    
    // Check if the response has the correct structure
    const data = await response.json();
    expect(data).toHaveProperty('response');
    expect(typeof data.response).toBe('string');
    expect(data.response.length).toBeGreaterThan(0);
    
    // Check if sentiment analysis is included
    expect(data).toHaveProperty('sentiment');
    if (data.sentiment) {
      expect(data.sentiment).toHaveProperty('score');
      expect(data.sentiment).toHaveProperty('label');
    }
  });
  
  // Test the assessment API endpoint
  test('should get a response from the assessment API', async ({ request }) => {
    // Send a POST request to the assessment API
    const response = await request.post('http://localhost:8000/api/ai/assess', {
      data: {
        user_responses: [
          {
            question: 'How have you been feeling lately?',
            answer: 'I have been feeling good lately.'
          },
          {
            question: 'Have you been experiencing any stress?',
            answer: 'A little bit of stress at work, but nothing major.'
          },
          {
            question: 'How is your sleep quality?',
            answer: 'I sleep well most nights.'
          },
          {
            question: 'Do you have any concerns about your mental health?',
            answer: 'Not really, I feel pretty balanced.'
          },
          {
            question: 'What activities do you enjoy doing?',
            answer: 'I enjoy reading, hiking, and spending time with friends.'
          }
        ],
        user_id: 'test_user'
      }
    });
    
    // Check if the response is successful
    expect(response.status()).toBe(200);
    
    // Check if the response has the correct structure
    const data = await response.json();
    expect(data).toHaveProperty('assessment');
    expect(data).toHaveProperty('recommendations');
    
    // Check assessment properties
    expect(data.assessment).toHaveProperty('stress_level');
    expect(data.assessment).toHaveProperty('anxiety_level');
    expect(data.assessment).toHaveProperty('depression_risk');
    expect(data.assessment).toHaveProperty('overall_wellbeing');
    
    // Check recommendations
    expect(Array.isArray(data.recommendations)).toBe(true);
    expect(data.recommendations.length).toBeGreaterThan(0);
  });
  
  // Test the chat API with invalid data
  test('should handle invalid data in chat API', async ({ request }) => {
    // Send a POST request with invalid data
    const response = await request.post('http://localhost:8000/api/ai/chat', {
      data: {
        // Missing required fields
        user_id: 'test_user'
      }
    });
    
    // Check if the response indicates an error
    expect(response.status()).toBe(422); // Unprocessable Entity
  });
  
  // Test the assessment API with invalid data
  test('should handle invalid data in assessment API', async ({ request }) => {
    // Send a POST request with invalid data
    const response = await request.post('http://localhost:8000/api/ai/assess', {
      data: {
        // Missing required fields
        user_id: 'test_user'
      }
    });
    
    // Check if the response indicates an error
    expect(response.status()).toBe(422); // Unprocessable Entity
  });
  
  // Test the chat API with a complex conversation
  test('should handle a multi-turn conversation', async ({ request }) => {
    // First message
    const response1 = await request.post('http://localhost:8000/api/ai/chat', {
      data: {
        messages: [
          {
            role: 'user',
            content: 'I have been feeling stressed lately.'
          }
        ],
        user_id: 'test_user'
      }
    });
    
    expect(response1.status()).toBe(200);
    const data1 = await response1.json();
    expect(data1).toHaveProperty('response');
    
    // Second message (continuing the conversation)
    const response2 = await request.post('http://localhost:8000/api/ai/chat', {
      data: {
        messages: [
          {
            role: 'user',
            content: 'I have been feeling stressed lately.'
          },
          {
            role: 'assistant',
            content: data1.response
          },
          {
            role: 'user',
            content: 'What can I do to feel better?'
          }
        ],
        user_id: 'test_user'
      }
    });
    
    expect(response2.status()).toBe(200);
    const data2 = await response2.json();
    expect(data2).toHaveProperty('response');
    expect(data2.response.length).toBeGreaterThan(0);
  });
});
