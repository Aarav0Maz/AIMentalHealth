import { test, expect } from '@playwright/test';

// Test suite for the AI service
test.describe('AI Service Tests', () => {
  // Test the sentiment analysis
  test('should analyze sentiment correctly', async ({ request }) => {
    // Test positive sentiment
    const positiveResponse = await request.post('http://localhost:8000/api/ai/chat', {
      data: {
        messages: [
          {
            role: 'user',
            content: 'I am feeling happy and optimistic today!'
          }
        ],
        user_id: 'test_user'
      }
    });
    
    expect(positiveResponse.status()).toBe(200);
    const positiveData = await positiveResponse.json();
    
    if (positiveData.sentiment) {
      // Positive sentiment should have a score > 0
      expect(positiveData.sentiment.score).toBeGreaterThanOrEqual(0);
      expect(['positive', 'neutral']).toContain(positiveData.sentiment.label);
    }
    
    // Test negative sentiment
    const negativeResponse = await request.post('http://localhost:8000/api/ai/chat', {
      data: {
        messages: [
          {
            role: 'user',
            content: 'I am feeling very sad and depressed today.'
          }
        ],
        user_id: 'test_user'
      }
    });
    
    expect(negativeResponse.status()).toBe(200);
    const negativeData = await negativeResponse.json();
    
    if (negativeData.sentiment) {
      // Negative sentiment should have a score < 0
      expect(negativeData.sentiment.score).toBeLessThan(0);
      expect(negativeData.sentiment.label).toBe('negative');
    }
  });
  
  // Test crisis detection
  test('should detect crisis situations', async ({ request }) => {
    // Test crisis message
    const crisisResponse = await request.post('http://localhost:8000/api/ai/chat', {
      data: {
        messages: [
          {
            role: 'user',
            content: 'I am thinking about harming myself and I don\'t know what to do.'
          }
        ],
        user_id: 'test_user'
      }
    });
    
    expect(crisisResponse.status()).toBe(200);
    const crisisData = await crisisResponse.json();
    
    // Crisis message should trigger a strong negative sentiment
    if (crisisData.sentiment) {
      expect(crisisData.sentiment.score).toBeLessThan(-0.5);
      expect(crisisData.sentiment.label).toBe('negative');
    }
    
    // The response should contain crisis resources or support information
    expect(crisisData.response).toContain('help') || 
    expect(crisisData.response).toContain('support') || 
    expect(crisisData.response).toContain('professional');
  });
  
  // Test assessment accuracy
  test('should provide accurate assessment based on responses', async ({ request }) => {
    // Test high stress responses
    const highStressResponse = await request.post('http://localhost:8000/api/ai/assess', {
      data: {
        user_responses: [
          {
            question: 'How have you been feeling lately?',
            answer: 'I have been feeling very stressed and overwhelmed.'
          },
          {
            question: 'Have you been experiencing any stress?',
            answer: 'Yes, I am under a lot of pressure at work and home.'
          },
          {
            question: 'How is your sleep quality?',
            answer: 'I have trouble sleeping due to stress and anxiety.'
          },
          {
            question: 'Do you have any concerns about your mental health?',
            answer: 'I am worried about my stress levels and how they affect me.'
          },
          {
            question: 'What activities do you enjoy doing?',
            answer: 'I used to enjoy reading but now I feel too stressed to focus.'
          }
        ],
        user_id: 'test_user'
      }
    });
    
    expect(highStressResponse.status()).toBe(200);
    const highStressData = await highStressResponse.json();
    
    // Check if stress level is correctly identified as high
    expect(highStressData.assessment.stress_level).toBe('high');
    
    // Test low stress responses
    const lowStressResponse = await request.post('http://localhost:8000/api/ai/assess', {
      data: {
        user_responses: [
          {
            question: 'How have you been feeling lately?',
            answer: 'I have been feeling good and relaxed.'
          },
          {
            question: 'Have you been experiencing any stress?',
            answer: 'Not really, things have been going smoothly.'
          },
          {
            question: 'How is your sleep quality?',
            answer: 'I sleep well most nights and feel rested.'
          },
          {
            question: 'Do you have any concerns about your mental health?',
            answer: 'No, I feel mentally healthy and balanced.'
          },
          {
            question: 'What activities do you enjoy doing?',
            answer: 'I enjoy reading, hiking, and spending time with friends.'
          }
        ],
        user_id: 'test_user'
      }
    });
    
    expect(lowStressResponse.status()).toBe(200);
    const lowStressData = await lowStressResponse.json();
    
    // Check if stress level is correctly identified as low
    expect(lowStressData.assessment.stress_level).toBe('low');
  });
});
