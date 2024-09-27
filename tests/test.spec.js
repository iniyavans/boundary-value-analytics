// const { bvaTest } = require('../bva');
const { test } = require('@playwright/test');
// Import the function from your package
const { bvaTest } = require('boundary-value-analytics');

test.describe('Boundary Value Analysis Tests', () => {

  test('Boundary value testing', async ({ page }) => {

    // Navigate to the application (replace with actual URL)
    await page.goto('http://127.0.0.1:5500/');  // Replace with your local or actual URL

    // Specify the element XPath and boundary values
    const minValue = 18;
    const maxValue = 45;
    const elementXPath = "//input[@id='age-input']";  // Example XPath of the age input field
    const submitXPath = "//button[@id='submit-btn']"; // Example XPath of the submit button
    const successXPath = "//div[@class='success-message']";  // XPath of success message
    const errorXPath = "//div[@class='error-message']";  // XPath of error message

    await bvaTest(minValue, maxValue, elementXPath, submitXPath, successXPath, errorXPath, page);

  });
});

