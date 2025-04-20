import { test, expect } from '@playwright/test';

// Test suite for the frontend components
test.describe('Frontend Tests', () => {
  // Test the navigation and basic UI elements
  test('should navigate through the application', async ({ page }) => {
    // Go to the home page
    await page.goto('http://localhost:3000');
    
    // Check if the title is correct
    await expect(page).toHaveTitle(/Mental Health Support/);
    
    // Check if the navbar contains the correct links
    await expect(page.locator('nav')).toContainText('Mental Health Support');
    await expect(page.locator('nav')).toContainText('Dashboard');
    await expect(page.locator('nav')).toContainText('Chat');
    await expect(page.locator('nav')).toContainText('Assessment');
    
    // Navigate to Dashboard
    await page.click('text=Dashboard');
    await expect(page.url()).toContain('/dashboard');
    await expect(page.locator('h4')).toContainText('Welcome to AI Mental Health Support');
    
    // Navigate to Chat
    await page.click('text=Chat');
    await expect(page.url()).toContain('/chat');
    
    // Navigate to Assessment
    await page.click('text=Assessment');
    await expect(page.url()).toContain('/assessment');
    await expect(page.locator('h4')).toContainText('Mental Health Assessment');
  });
  
  // Test the Chat component
  test('should send and receive messages in Chat', async ({ page }) => {
    // Go to the chat page
    await page.goto('http://localhost:3000/chat');
    
    // Type a message
    await page.fill('textarea', 'Hello, I am feeling a bit stressed today.');
    
    // Send the message
    await page.click('button:has-text("Send")');
    
    // Wait for the response
    await page.waitForSelector('text=Hello, I am feeling a bit stressed today.');
    
    // Check if the user message is displayed
    await expect(page.locator('text=Hello, I am feeling a bit stressed today.')).toBeVisible();
    
    // Wait for the AI response (this might take some time)
    await page.waitForResponse(response => 
      response.url().includes('/api/ai/chat') && response.status() === 200
    );
    
    // Check if there's an AI response
    const responseElements = await page.locator('div.MuiPaper-root >> nth=1').count();
    expect(responseElements).toBeGreaterThan(0);
  });
  
  // Test the Assessment component
  test('should complete an assessment and show results', async ({ page }) => {
    // Go to the assessment page
    await page.goto('http://localhost:3000/assessment');
    
    // Fill out the assessment form
    const questions = await page.locator('div.MuiBox-root h6').count();
    
    for (let i = 0; i < questions; i++) {
      await page.locator('textarea').nth(i).fill('I have been feeling good lately.');
    }
    
    // Submit the assessment
    await page.click('button:has-text("Submit Assessment")');
    
    // Wait for the response
    await page.waitForResponse(response => 
      response.url().includes('/api/ai/assess') && response.status() === 200
    );
    
    // Check if the results are displayed
    await page.waitForSelector('text=Assessment Results');
    await expect(page.locator('text=Assessment Results')).toBeVisible();
    await expect(page.locator('text=Stress Level')).toBeVisible();
    await expect(page.locator('text=Anxiety Level')).toBeVisible();
    await expect(page.locator('text=Depression Risk')).toBeVisible();
    await expect(page.locator('text=Overall Wellbeing')).toBeVisible();
    await expect(page.locator('text=Recommendations')).toBeVisible();
  });
  
  // Test error handling in Chat
  test('should handle errors in Chat', async ({ page }) => {
    // Go to the chat page
    await page.goto('http://localhost:3000/chat');
    
    // Mock a failed API response
    await page.route('**/api/ai/chat', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ detail: 'Server error' })
      });
    });
    
    // Type a message
    await page.fill('textarea', 'This should trigger an error.');
    
    // Send the message
    await page.click('button:has-text("Send")');
    
    // Check if the error message is displayed
    await page.waitForSelector('div.MuiAlert-root');
    await expect(page.locator('div.MuiAlert-root')).toContainText('Server error');
  });
  
  // Test error handling in Assessment
  test('should handle errors in Assessment', async ({ page }) => {
    // Go to the assessment page
    await page.goto('http://localhost:3000/assessment');
    
    // Mock a failed API response
    await page.route('**/api/ai/assess', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ detail: 'Server error' })
      });
    });
    
    // Fill out the assessment form
    const questions = await page.locator('div.MuiBox-root h6').count();
    
    for (let i = 0; i < questions; i++) {
      await page.locator('textarea').nth(i).fill('Test answer');
    }
    
    // Submit the assessment
    await page.click('button:has-text("Submit Assessment")');
    
    // Check if the error message is displayed
    await page.waitForSelector('div.MuiAlert-root');
    await expect(page.locator('div.MuiAlert-root')).toContainText('Server error');
  });
});
