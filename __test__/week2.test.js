import { beforeAll, describe, it, expect } from 'vitest';
import fetch from 'node-fetch';
import { testData, getAPIUrl, getToken } from './setup.js';

const API_URL = getAPIUrl();
let token = null;

beforeAll(async () => {
    await createUser();
    token = await getToken(API_URL);
    console.info('Session token: ', token);
    await createCustomer();
});

describe('/consent/:customer endpoints', () => {
    it('should allow users to update their consent', async () => {
        const res = await fetch(`${API_URL}/consent/${testData.email}`, {
            method: 'PATCH',
            headers: { 'suresteps-session-token': token },
            body: 'true'
        });
        expect(res.status).toBe(200);
    })

    it('should allow user to get their consent status', async () => {
        const res = await fetch(`${API_URL}/consent/${testData.email}`, {
            headers: { 'suresteps-session-token': token }
        });
        expect(res.status).toBe(200);
        const data = await res.text();
        expect(data).toMatch(/true/i);
    })
});

describe('Consented Clinicians Endpoints', () => {
    it('should allow users to add a clinician', async () => {
        const res = await fetch(`${API_URL}/consentedClinicians/${testData.email}`, {
            method: 'PATCH',
            headers: { 'suresteps-session-token': token },
            body: 'physician@stedi.com'
        });
        expect(res.status).toBe(200);
    })

    it('should return an array of clinicians for the user', async () => {
        const res = await fetch(`${API_URL}/consentedClinicians/${testData.email}`, {
            headers: { 'suresteps-session-token': token }
        });
        expect(res.status).toBe(200);
        const data = await res.json();

        expect(JSON.stringify(data)).toContain('physician@stedi.com');
    })
});

///// Helper functions /////

// Create a test user
const createUser = async () => {
    // create the payload for the request
    const timestamp = Date.now();
    const payload = {
        userName: testData.email,
        email: testData.email,
        phone: testData.phone,
        region: testData.region,
        birthDate: testData.birthDate,
        password: testData.password,
        verifyPassword: testData.password,
        agreedToTermsOfUseDate: timestamp,
        agreedToCookiePolicyDate: timestamp,
        agreedToPrivacyPolicyDate: timestamp,
        agreedToTextMessageDate: timestamp,
    };
    // send a POST request to create a new user
    try {
        const response = await fetch(`${API_URL}/user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (response.status !== 200 && response.status !== 409)
            console.error('Failed to create a test user. Response status: ', response.status);
    } catch (error) {
        console.error('Error creating a test user: ', error);
    }
};

// Create a customer for the test user
const createCustomer = async () => {
    // create the payload for the request
    const payload = {
        customerName: 'Test User',
        email: testData.email,
        region: testData.region,
        phone: testData.phone,
        whatsAppPhone: testData.phone,
        birthDay: testData.birthDate,
    };
    // send a POST request to create a new customer
    try {
        const response = await fetch(`${API_URL}/customer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'suresteps-session-token': token },
            body: JSON.stringify(payload),
        });
        if (response.status !== 200 && response.status !== 409)
            console.error('Failed to create a test customer. Response status: ', response.status);
    } catch (error) {
        console.error('Error creating a test customer: ', error);
    }
};

