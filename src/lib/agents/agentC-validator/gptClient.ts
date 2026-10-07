import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Agent C - GPT Client (Validator)
 * Role: Analyse qualitative, stratégique et validation croisée.
 */
export async function validateWithGPT(mathReport: any) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error("❌ Erreur: OPENAI_API_KEY manquante dans .env.local");
    return null;
  }

  const openai = new OpenAI({
    apiKey: apiKey,
  });

  const prompt = `
    Tu es l'Agent C (Validateur GPT) pour VictorIA BET.
    
    RAPPORT MATHÉMATIQUE DE L'AGENT B :
    ${JSON.stringify(mathReport, null, 2)}

    TA MISSION :
    1. Analyse la viabilité stratégique du pronostic.
    2. Apporte un regard critique sur les statistiques de l'Agent B.
    3. Donne ton vote : "OUI" pour valider, "NON" pour écarter.
    4. Rédige une justification détaillée pour l'utilisateur final.

    RÉPONDS AU FORMAT JSON :
    {
      "vote": "OUI" | "NON",
      "confidenceScore": number,
      "justification": "ton texte ici"
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    return content ? JSON.parse(content) : null;
  } catch (error) {
    console.error("❌ Erreur lors de l'appel à GPT:", error);
    return null;
  }
}
