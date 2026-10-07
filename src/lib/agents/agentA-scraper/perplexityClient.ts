import dotenv from 'dotenv';

dotenv.config();

/**
 * Agent A - Perplexity Client
 * Role: Effectue des recherches statistiques profondes en temps réel sur le web.
 */
export async function queryPerplexityStats(matchInfo: string) {
  const apiKey = process.env.PERPLEXITY_API_KEY;

  if (!apiKey) {
    console.error("❌ Erreur: PERPLEXITY_API_KEY manquante dans .env.local");
    return null;
  }

  const prompt = `
    Agis en tant qu'expert analyste de paris sportifs pour VictorIA BET.
    Analyse le match suivant : ${matchInfo}.
    
    Fournis les informations suivantes de manière ultra-détaillée :
    1. Les 5 dernières confrontations directes (H2H) avec scores.
    2. Dynamique de forme (victoires/défaites récentes).
    3. Joueurs clés absents (blessures, suspensions).
    4. Statistiques clés (possession moyenne, tirs cadrés, corners).
    5. Facteurs externes (météo, importance du match).

    Réponds au format JSON structuré pour être traité par l'Agent B.
  `;

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'pplx-7b-online', // Ou le modèle sonar le plus récent
        messages: [
          { role: 'system', content: 'Tu es un analyste de données sportives ultra-précis.' },
          { role: 'user', content: prompt }
        ]
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("❌ Erreur lors de l'appel à Perplexity:", error);
    return null;
  }
}
