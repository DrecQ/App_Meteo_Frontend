export default defineEventHandler(async (event) => {
  // 1. Vérifier que l'utilisateur est authentifié
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentification requise pour accéder à cette ressource.'
    })
  }

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
        "response_format": { "type": "json_object" }
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

    const data = await response.json();
    
    // Extraire le contenu JSON de la réponse de l'IA
    let jsonText = data.choices[0].message.content.trim();

    // Nettoyage robuste pour garantir un JSON valide
    const firstBrace = jsonText.indexOf('{');
    const lastBrace = jsonText.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
      throw new Error("Could not find a valid JSON object in the AI response.");
    }

    jsonText = jsonText.substring(firstBrace, lastBrace + 1);
    
    // Tentative de correction des erreurs JSON courantes (ex: virgules finales)
    jsonText = jsonText.replace(/,\\s*([}\]])/g, '$1');

    const jsonContent = JSON.parse(jsonText);

    return jsonContent;

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