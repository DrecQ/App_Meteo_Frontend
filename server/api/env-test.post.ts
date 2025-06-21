export default defineEventHandler(async (event) => {
  console.log('=== ENV Test endpoint called ===');
  
  try {
    // Test direct des variables d'environnement
    console.log('process.env.NUXT_OPENROUTER_API_KEY:', process.env.NUXT_OPENROUTER_API_KEY);
    console.log('process.env.OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY);
    
    const config = useRuntimeConfig();
    console.log('Runtime config openrouterApiKey:', config.openrouterApiKey);
    
    return {
      success: true,
      message: 'Environment test',
      envVars: {
        NUXT_OPENROUTER_API_KEY: process.env.NUXT_OPENROUTER_API_KEY ? 'EXISTS' : 'MISSING',
        OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY ? 'EXISTS' : 'MISSING',
        runtimeConfigKey: config.openrouterApiKey ? 'EXISTS' : 'MISSING'
      },
      apiKeyLength: config.openrouterApiKey ? config.openrouterApiKey.length : 0,
      apiKeyStart: config.openrouterApiKey ? config.openrouterApiKey.substring(0, 10) + '...' : 'N/A'
    };
  } catch (error) {
    console.error('ENV Test error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}); 