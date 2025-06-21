export default defineEventHandler(async (event) => {
  try {
    console.log('=== Quiz IA Stream Endpoint Called ===');
    
    const { messages } = await readBody(event);
    console.log('Received messages:', messages);

    const config = useRuntimeConfig();
    console.log('Runtime config loaded, openrouterApiKey exists:', !!config.openrouterApiKey);

    if (!config.openrouterApiKey) {
      console.error('OpenRouter API key is missing!');
      throw createError({
        statusCode: 500,
        statusMessage: 'OpenRouter API key not configured. Please add NUXT_OPENROUTER_API_KEY to your .env file.',
      });
    }
    
    console.log('Calling OpenRouter API with messages:', messages);
    
    // Appel à l'API OpenRouter
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.openrouterApiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "AppMeteo Quiz",
      },
      body: JSON.stringify({
        "model": "mistralai/mistral-7b-instruct:free",
        "messages": messages,
        "stream": true
      })
    });

    console.log('OpenRouter response status:', response.status);
    console.log('OpenRouter response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      throw createError({
        statusCode: response.status,
        statusMessage: `OpenRouter API error: ${response.status} - ${errorText}`,
      });
    }

    console.log('OpenRouter API response successful, returning stream');
    
    // Transfère directement le flux de réponse
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('=== Error in quiz-ia-stream endpoint ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Si c'est déjà une erreur Nuxt, on la relance
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `Server error: ${error.message}`,
    });
  }
}); 