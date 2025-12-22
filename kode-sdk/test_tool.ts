
import { GetCurrentClientProfile } from './server/tools/get_current_client_profile/index';
import { API_CONFIG } from './server/tools/config';

async function main() {
    console.log('Testing GetCurrentClientProfile tool...');
    console.log('Base URL:', API_CONFIG.BASE_URL);

    const context = {
        sessionId: 'session-1766386283313'
    };

    try {
        const result = await GetCurrentClientProfile.exec({}, context);
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Error executing tool:', error);
    }
}

main();
