import { test, expect } from '@playwright/test';

// End-to-end test suite
test.describe('End-to-End Tests', () => {
  // Test the complete user journey
  test('should complete a full user journey', async ({ page }) => {
    // Start at the home page
    await page.goto('http://localhost:3000');
    
    // Check the home page content
    await expect(page.locator('h2')).toContainText('AI Mental Health Support');
    
    // Navigate to the chat page
    await page.click('text=Chat');
    await expect(page.url()).toContain('/chat');
    
    // Send a message in the chat
    await page.fill('textarea', 'I have been feeling anxious about work lately.');
    await page.click('button:has-text("Send")');
    
    // Wait for the response
    await page.waitForResponse(response => 
      response.url().includes('/api/ai/chat') && response.status() === 200
    );
    
    // Check if the user message is displayed
    await expect(page.locator('text=I have been feeling anxious about work lately.')).toBeVisible();
    
    // Check if there's an AI response
    const responseElements = await page.locator('div.MuiPaper-root >> nth=1').count();
    expect(responseElements).toBeGreaterThan(0);
    
    // Navigate to the assessment page
    await page.click('text=Assessment');
    await expect(page.url()).toContain('/assessment');
    
    // Fill out the assessment form
    const questions = await page.locator('div.MuiBox-root h6').count();
    
    for (let i = 0; i < questions; i++) {
      await page.locator('textarea').nth(i).fill('I have been feeling anxious about work, but I am managing it with exercise and talking to friends.');
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
    
    // Check specific assessment results
    await expect(page.locator('text=Stress Level')).toBeVisible();
    await expect(page.locator('text=Anxiety Level')).toBeVisible();
    await expect(page.locator('text=Depression Risk')).toBeVisible();
    await expect(page.locator('text=Overall Wellbeing')).toBeVisible();
    
    // Check recommendations
    await expect(page.locator('text=Recommendations')).toBeVisible();
    
    // Navigate back to the home page
    await page.click('text=Mental Health Support');
    await expect(page.url()).toBe('http://localhost:3000/');
  });
  
  // Test performance metrics
  test('should load pages within acceptable time', async ({ page }) => {
    // Measure home page load time
    const homeStart = Date.now();
    await page.goto('http://localhost:3000');
    const homeLoadTime = Date.now() - homeStart;
    console.log(`Home page load time: ${homeLoadTime}ms`);
    expect(homeLoadTime).toBeLessThan(3000); // 3 seconds max
    
    // Measure chat page load time
    const chatStart = Date.now();
    await page.click('text=Chat');
    await expect(page.url()).toContain('/chat');
    const chatLoadTime = Date.now() - chatStart;
    console.log(`Chat page load time: ${chatLoadTime}ms`);
    expect(chatLoadTime).toBeLessThan(2000); // 2 seconds max
    
    // Measure assessment page load time
    const assessmentStart = Date.now();
    await page.click('text=Assessment');
    await expect(page.url()).toContain('/assessment');
    const assessmentLoadTime = Date.now() - assessmentStart;
    console.log(`Assessment page load time: ${assessmentLoadTime}ms`);
    expect(assessmentLoadTime).toBeLessThan(2000); // 2 seconds max
  });
  
  // Test accessibility
  test('should have proper accessibility attributes', async ({ page }) => {
    // Check home page accessibility
    await page.goto('http://localhost:3000');
    
    // Check if navigation has proper role
    await expect(page.locator('nav')).toHaveAttribute('role', 'navigation');
    
    // Check if buttons have proper attributes
    const buttons = await page.locator('button').all();
    for (const button of buttons) {
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      expect(ariaLabel || text).toBeTruthy();
    }
    
    // Check chat page accessibility
    await page.click('text=Chat');
    
    // Check if the chat input has proper attributes
    await expect(page.locator('textarea')).toHaveAttribute('aria-label', 'Message');
    await expect(page.locator('button:has-text("Send")')).toHaveAttribute('aria-label', 'Send message');
    
    // Check assessment page accessibility
    await page.click('text=Assessment');
    
    // Check if the assessment form has proper attributes
    const textareas = await page.locator('textarea').all();
    for (const textarea of textareas) {
      const ariaLabel = await textarea.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    }
  });
  
  // Test responsiveness
  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('http://localhost:3000');
    
    // Check if the navbar is still visible
    await expect(page.locator('nav')).toBeVisible();
    
    // Check if the content is properly displayed
    await expect(page.locator('h2')).toBeVisible();
    
    // Test on tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.reload();
    
    // Check if the navbar is still visible
    await expect(page.locator('nav')).toBeVisible();
    
    // Check if the content is properly displayed
    await expect(page.locator('h2')).toBeVisible();
    
    // Test on desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 }); // Desktop
    await page.reload();
    
    // Check if the navbar is still visible
    await expect(page.locator('nav')).toBeVisible();
    
    // Check if the content is properly displayed
    await expect(page.locator('h2')).toBeVisible();
  });
});
