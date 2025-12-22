
import { GetCurrentClientProfile } from './server/tools/get_client_profile/index';

async function main() {
    console.log('🔍 Testing GetCurrentClientProfile (get_client_profile) with name="糯糯"...');

    // Simulate context
    const context = {
        sessionId: 'test-session-' + Date.now()
    };

    // Simulate args (User searching for name)
    const args = {
        name: '糯糯'
    };

    try {
        console.log('🚀 Executing tool...');
        const result = await GetCurrentClientProfile.exec(args, context);
        console.log('✅ Tool Execution Result:');
        console.log(JSON.stringify(result, null, 2));

        if (result.ok && result.client_found && result.profile.name === '糯糯') {
            console.log('🎉 SUCCESS: Correct client "糯糯" found!');
        } else {
            console.error('❌ FAILURE: Unexpected result.');
        }

    } catch (error) {
        console.error('❌ CRASH: Tool execution failed:', error);
    }
}

main();
