import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

export const testData = {
    email: 'test_user@example.com',
    region: 'US',
    phone: '8014567890',
    birthDate: '2000-01-01',
    password: 'P@ssword123',
};

//// API URL Configuration ////

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../');
dotenv.config({ path: path.resolve(rootDir, '.env') });

export function getAPIUrl() {
    // Check if API_URL environment variable exists
    if (!process.env.API_URL) {
        console.error('\x1b[31m%s\x1b[0m', `
    ❌ ERROR: API_URL environment variable not set!
    Update the week1-integration-test.yaml file's API_URL environment variable to match your Vercel domain
    For local development, you can set it via:
    - .env file
    - export API_URL=https://your-api-url.com (bash/zsh)
    - set API_URL=https://your-api-url.com (Windows CMD)

    IMPORTANT: You need to deploy your own API to Vercel first, then use your
    own Vercel domain for these tests. Do not use the production domains.
    `);
        process.exit(1); // Exit with error code
    }

    // Verify that the API_URL is not pointing to the production domains
    const API_URL = process.env.API_URL;
    if (API_URL.includes('dev.stedi.me') || API_URL.includes('stedi.me')) {
        console.error('\x1b[31m%s\x1b[0m', `
    ❌ ERROR: Invalid API_URL detected: ${API_URL}

    You are attempting to run tests against the example domain.
    This is not allowed for this assignment.

    Please follow these steps:
    1. Deploy your own API to Vercel first
    2. Get your Vercel domain (should look like: https://your-project-name.vercel.app)
    3. Update the week1-integration-test.yaml file's API_URL environment variable
        to match your Vercel domain
    4. Push your changes to GitHub

    IMPORTANT: These tests are meant to run against YOUR OWN deployed API, not the example API.
    `);
        process.exit(1); // Exit with error code
    }

    return API_URL; // Return the API_URL for use in tests
}

//// Session Token Configuration ////

// Get the session token for the test user
export const getToken = async (API_URL) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/text' },
            body: JSON.stringify({ userName: testData.email, password: testData.password }),
        });
        if (response.status === 200)
            return await response.text(); // Get the session token
        else console.error('Unable to get session token: ', response.statusText);
    } catch (error) {
        console.error('Login Error: ', error);
    }
};
