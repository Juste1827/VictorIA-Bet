import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Agent B - Claude Client (The Mathematician)
 * Role: Analyse prédictive, calculs de probabilités et détection de Value Bets.
 */
export async function analyzeWithClaude(scrapedData: any) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.error("❌ Erreur: ANTHROPIC_API_KEY manquante dans .env.local");
    return null;
  }

  const anthropic = new Anthropic({
    apiKey: apiKey,
  });

  const prompt = `
    Tu es l'Agent B de VictorIA BET, expert en mathématiques appliquées aux paris sportifs.
    
    DONNÉES FOURNIES PAR L'AGENT A :
    ${JSON.stringify(scrapedData, null, 2)}

    TA MISSION :
    1. Calcule la probabilité réelle de chaque issue (Victoire, Nul, Défaite) en utilisant une simulation basée sur la Loi de Poisson et les statistiques fournies.
    2. Identifie si une "Value Bet" existe (cote_réelle > cote_bookmaker).
    3. Calcule l'indice de confiance (0-100%).
    4. Filtre les matchs : Ne garde que ceux ayant une probabilité de succès calculée ≥ 80%.

    FORMAT DE RÉPONSE ATTENDU (JSON) :
    {
      "match": "Nom du match",
      "probabilities": { "1": 0.0, "X": 0.0, "2": 0.0 },
      "valueBet": boolean,
      "confidenceScore": number,
      "recommendedOption": "ex: Over 2.5 goals",
      "reasoning": "Explication mathématique courte"
    }
  `;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229", // Modèle le plus puissant pour les maths
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    // On suppose que Claude répond avec du JSON valide dans le texte
    const content = response.content[0];
    if (content.type === 'text') {
      return content.text;
    }
    return null;
  } catch (error) {
    console.error("❌ Erreur lors de l'appel à Claude:", error);
    return null;
  }
}
