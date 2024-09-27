const { expect } = require('@playwright/test');

/**
 * Function to automate Boundary Value Analysis (BVA) for both integers and floats
 * @param {number} minValue - The minimum boundary value.
 * @param {number} maxValue - The maximum boundary value.
 * @param {string} elementXPath - The XPath of the input element to test.
 * @param {string} submitXPath - The XPath of the submit button.
 * @param {string} [successXPath] - The XPath of the success message element (optional).
 * @param {string} errorXPath - The XPath of the error message element.
 * @param {object} page - The Playwright page object representing the browser page.
 */
async function bvaTest(minValue, maxValue, elementXPath, submitXPath, successXPath, errorXPath, page) {
  try {
    // Ensure minValue and maxValue are numbers (integers or floats)
    if (typeof minValue !== 'number' || typeof maxValue !== 'number') {
      throw new Error(`Boundary values must be numeric. Received minValue: ${minValue}, maxValue: ${maxValue}`);
    }

    // Ensure maxValue is greater than minValue
    if (maxValue <= minValue) {
      throw new Error(`Invalid boundary values: maxValue (${maxValue}) should be greater than minValue (${minValue}).`);
    }

    // Based on the difference of the minimum and maximum the boundary value is differ. 

    let delta; // Declare the variable to assign the delta value.

    const valueComparison = maxValue - minValue;

    // Use switch case for determining the delta based on valueComparison
    switch (true) {
      case (valueComparison >= 1): // If the boundary difference is above or equal to 1, then the delta value is 1. 
        delta = 1;
        break;
      case (valueComparison <= 0.01): // If the boundary difference us less then the or equal to 0.01, then the boundary value is 0.001.
        delta = 0.001;
        break;
      case (valueComparison <= 0.1): // If the boundary difference us less then the or equal to 0.1, then the boundary value is 0.01.
        delta = 0.01;
        break;
      case (valueComparison <= 0.5): // If the boundary difference us less then the or equal to 0.1, then the boundary value is 0.1.
        delta = 0.1;
        break;
      default:
        delta = 0; // Optional: define a default case if needed
    }

    const testCases = [
      { value: minValue, expected: true, description: `Lower boundary: ${minValue}` }, // Test exactly at the lower boundary
      { value: minValue - delta, expected: false, description: `Just below lower boundary: ${minValue - delta}` }, // Test just below the lower boundary
      { value: minValue + delta, expected: true, description: `Just above lower boundary: ${minValue + delta}` }, // Test just above the lower boundary
      { value: maxValue, expected: true, description: `Upper boundary: ${maxValue}` }, // Test exactly at the upper boundary
      { value: maxValue - delta, expected: true, description: `Just below upper boundary: ${maxValue - delta}` }, // Test just below the upper boundary
      { value: maxValue + delta, expected: false, description: `Just above upper boundary: ${maxValue + delta}` }  // Test just above the upper boundary
    ];

    for (const testCase of testCases) {
      console.log(`Running test case: ${testCase.description}`);

      // Check if the input element is visible
      if (!await page.isVisible(`xpath=${elementXPath}`)) {
        throw new Error(`Element not found at XPath: ${elementXPath}`);
      }

      // Fill the input field with the test case value
      await page.fill(`xpath=${elementXPath}`, testCase.value.toString());

      // Check if the submit button is visible and click it
      if (!await page.isVisible(`xpath=${submitXPath}`)) {
        throw new Error(`Submit button not found at XPath: ${submitXPath}`);
      }
      await page.click(`xpath=${submitXPath}`);

      // Check for success or error message based on expected result
      if (testCase.expected && successXPath) {
        const isSuccessVisible = await page.isVisible(`xpath=${successXPath}`);
        if (!isSuccessVisible) {
          throw new Error(`Success message not visible for test case: ${testCase.description}`);
        }
        expect(isSuccessVisible).toBeTruthy();
      } else if (!testCase.expected) {
        const isErrorVisible = await page.isVisible(`xpath=${errorXPath}`);
        if (!isErrorVisible) {
          throw new Error(`Error message not visible for test case: ${testCase.description}`);
        }
        expect(isErrorVisible).toBeTruthy();
      }
    }
  } catch (error) {
    console.error(`An error occurred during BVA testing: ${error.message}`);
    throw error;  // Rethrow error to fail the Playwright test
  }
}

module.exports = { bvaTest };
