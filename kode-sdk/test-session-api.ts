/**
 * Test script to verify session API endpoint
 */

import { generateToken } from './server/middleware/auth';

// Create a test token for user "demon"
const testUser = {
    userId: 'demon',
    username: 'demon',
    role: 'user' as const,
};

const token = generateToken(testUser);

console.log('='.repeat(60));
console.log('Generated Test Token for user "demon":');
console.log('='.repeat(60));
console.log(token);
console.log('\n');
console.log('Test the API with:');
console.log(`curl -H "Authorization: Bearer ${token}" http://127.0.0.1:3001/api/sessions/session-1766497101132`);
console.log('='.repeat(60));
