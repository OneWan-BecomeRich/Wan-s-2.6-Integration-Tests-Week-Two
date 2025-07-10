# API Migration Assignment

## What You Will Build

Hello future developers! In this assignment, you will extend your API to include **user consent management** features while continuing to work with the older system.

This week, your new API will not only pass information between the user and the old API — it will also help manage **data sharing consent** and **clinician access** preferences.

## New Features for Week 2

You're adding **customer consent management** endpoints:

### 1. Update Consent to Share Data
This endpoint will be used when a user wants to update their consent to share data.
- **Endpoint**: `/consent/:customer`
- **Method**: `PATCH`
- **Headers**: `suresteps.session.token: <token>`
- **Body**: `true` or `false` (as plain text)
- **Response**: `"Consent updated successfully."` with `200 OK`

### 2. Get Consent to Share Data
This endpoint is used to check user consent status.
- **Endpoint**: `/consent/:customer`
- **Method**: `GET`
- **Headers**: `suresteps.session.token: <token>`
- **Response**: `"true"` or `"false"` as plain text

### 3. Add a Consented Clinician
Each user will have a list of clinicians they consent to share their data with. This endpoint is used when a user wants 
to share their data with a new clinician. Clinician access should be time-limited. Store the clinician username along 
with the expiration date of their access, which in this case, will be one year from when access was granted.
- **Endpoint**: `/consentedClinicians/:customer`
- **Method**: `PATCH`
- **Headers**: `suresteps.session.token: <token>`
- **Body**: `clinician@domain.com` (as plain text)
- **Response**: `"Clinician consent updated successfully."` with `200 OK`

### 4. Get All Consented Clinicians
This endpoint is used to retrieve the list of clinicians a user has consented to share their data with.
- **Endpoint**: `/consentedClinicians/:customer`
- **Method**: `GET`
- **Headers**: `suresteps.session.token: <token>`
- **Response**:
  - JSON array of clinician usernames and access expiration dates: 
  ```json
  [["clinician1@domain.com", experationDate], ["clinician2@domain.com", experationDate]]
  ```

## How to Run the Week 2 Tests

Make sure your `.env` file is correctly set:

```
API_URL=https://your-vercel-domain.vercel.app
```

Then, run the tests:

```bash
  npm test
```

If you only want to run Week 2 tests:

```bash
  vitest run __test__/week2.test.js
```

---

## Reminder of Week 1 Endpoints

You still need to support:

1. **Create User** – `POST /user`
2. **Login** – `POST /login`
3. **Create Customer** – `POST /customer`
4. **Save Step Data** – `POST /rapidsteptest`
5. **Get Risk Score** – `GET /riskscore/{email}`

---

## Tips for Week 2

- Return proper status codes (`401`, `403`, `500`) for error handling.
- Use `try/catch` blocks to gracefully handle backend or logic failures.
- Store clinician consents as a list under the user’s record (see test expectations).
- Use tools like Postman to test your API before running the tests.

You're building secure, user-focused data-sharing features — keep it clean and robust.

Good luck, and happy coding!
