
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const API_URL = 'http://localhost:3001/api/chat';
// Use the demo token or a dummy one if valid JWT is required and not enforced strictly, 
// but looking at `chat.ts` middleware `authenticateToken`, it seems required.
// We can borrow the USER_JWT_TOKEN from .env
const TOKEN = process.env.USER_JWT_TOKEN;

async function testChat() {
    console.log(`Testing Chat API at ${API_URL}`);

    const payload = {
        message: "你好，你是谁？",
        agentId: "insure-recommand-v3",
        sessionId: "test-session-" + Date.now(),
        userId: "2" // Matching the token user
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error(`HTTP Error: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error(text);
            return;
        }

        // It's an SSE stream
        const body = response.body;
        body.setEncoding('utf8');

        body.on('data', (chunk) => {
            console.log('Received chunk:', chunk);
            // We are looking for 'text' events which contain the response content
            // Format: event: text\ndata: {"content":"..."}\n\n
        });

        body.on('end', () => {
            console.log('Stream ended');
        });

    } catch (error) {
        console.error("Fetch error:", error);
    }
}

testChat();
