import { beforeAll, describe, it, expect } from 'vitest';
import fetch from 'node-fetch';
import { testData, getAPIUrl, getToken } from './setup.js';

const API_URL = getAPIUrl();
const token = await getToken(API_URL);

beforeAll(async () => {
    await createUser();
    await createCustomer();
});


///// Test for Week 1 /////

describe('Backend Handling of IoT Device Data', () => {
    // Sends a single step to the server and checks the response
    it('should save step data from an IoT device', async () => {
        const mockData = {
            customer: testData.email,
            startTime: Date.now(),
            stepPoints: [100],
            deviceId: '000',
            totalSteps: 1,
        };
        const response = await fetch(`${API_URL}/rapidsteptest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'suresteps.session.token': token },
            body: JSON.stringify(mockData),
        });
        const data = await response.text();
        expect(response.status).toBe(200);
        expect(data).toBe('Saved');
    });

    // Sends step data to the server and requests the risk score
    it('should calculate a risk score', async () => {
        // Save mock step data
        await save30Steps(200);
        await save30Steps(200);
        await save30Steps(100);
        await save30Steps(100);

        // Get the risk score
        const response = await fetch(`${API_URL}/riskscore/${testData.email}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'suresteps.session.token': token },
        });
        const data = await response.json();
        expect(response.status).toBe(200);
        expect(data.score > 0).toBe(true);
    });
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
            headers: { 'Content-Type': 'application/json', 'suresteps.session.token': token },
            body: JSON.stringify(payload),
        });
        if (response.status !== 200 && response.status !== 409)
            console.error('Failed to create a test customer. Response status: ', response.status);
    } catch (error) {
        console.error('Error creating a test customer: ', error);
    }
};

// Send a POST request with 30 steps matching the given time
const save30Steps = async (time) => {
    // create the payload for the request
    const endTime = Date.now();
    const payload = {
        customer: testData.email,
        startTime: endTime - time * 30, // backdate the start time
        stepPoints: Array(30).fill(time),
        stopTime: endTime,
        testTime: time * 30,
        deviceId: '000',
        totalSteps: 30,
    };
    // send a POST request to save step data
    return await fetch(`${API_URL}/rapidsteptest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/text', 'suresteps.session.token': token },
        body: JSON.stringify(payload),
    });
};