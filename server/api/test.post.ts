export default defineEventHandler(async (event) => {
  console.log('=== Test endpoint called ===');
  
  try {
    const config = useRuntimeConfig();
    console.log('Runtime config loaded');
    console.log('openrouterApiKey exists:', !!config.openrouterApiKey);
    console.log('openrouterApiKey length:', config.openrouterApiKey ? config.openrouterApiKey.length : 0);
    console.log('openrouterApiKey start:', config.openrouterApiKey ? config.openrouterApiKey.substring(0, 10) + '...' : 'N/A');
    
    return {
      success: true,
      message: 'Test endpoint working',
      hasApiKey: !!config.openrouterApiKey,
      apiKeyLength: config.openrouterApiKey ? config.openrouterApiKey.length : 0,
      apiKeyStart: config.openrouterApiKey ? config.openrouterApiKey.substring(0, 10) + '...' : null,
      configKeys: Object.keys(config).filter(key => key.includes('api') || key.includes('key'))
    };
  } catch (error) {
    console.error('Test endpoint error:', error);
    return {
      success: false,
      error: error.message,
      stack: error.stack
    };
  }
}); 