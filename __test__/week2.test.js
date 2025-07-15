import { describe, it, expect } from 'vitest';
import fetch from 'node-fetch';
import { testData, getAPIUrl, getToken } from './setup.js';

const API_URL = getAPIUrl();
const token = await getToken(API_URL);

describe('/consent/:customer endpoints', () => {
    it('should allow users to update their consent', async () => {
        const res = await fetch(`${API_URL}/consent/${testData.email}`, {
            method: 'PATCH',
            headers: { 'suresteps.session.token': token },
            body: 'true'
        });
        expect(res.status).toBe(200);
    })

    it('should allow user to get their consent status', async () => {
        const res = await fetch(`${API_URL}/consent/${testData.email}`, {
            headers: { 'suresteps.session.token': token }
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
            headers: { 'suresteps.session.token': token },
            body: 'physician@stedi.com'
        });
        expect(res.status).toBe(200);
    })

    it('should return an array of clinicians for the user', async () => {
        const res = await fetch(`${API_URL}/consentedClinicians/${testData.email}`, {
            headers: { 'suresteps.session.token': token }
        });
        expect(res.status).toBe(200);
        const data = await res.json();

        expect(JSON.stringify(data)).toContain('physician@stedi.com');
    })
});

