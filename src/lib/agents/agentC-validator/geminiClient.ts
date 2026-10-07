import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

/**
 * Agent C - Gemini Client (Validator)
 * Role: Analyse qualitative et validation rationnelle des pronostics.
 */
export async function validateWithGemini(mathReport: any) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("❌ Erreur: GEMINI_API_KEY manquante dans .env.local");
    return null;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `
    Tu es l'Agent C (Validateur Gemini) pour VictorIA BET.
    
    RAPPORT MATHÉMATIQUE DE L'AGENT B :
    ${JSON.stringify(mathReport, null, 2)}

    TA MISSION :
    1. Analyse la cohérence logique du pronostic.
    2. Vérifie si le contexte qualitatif (H2H, forme) justifie le pari.
    3. Donne ton vote : "OUI" pour valider, "NON" pour écarter.
    4. Rédige une analyse détaillée en 3 points : Points Forts, Risques, Conclusion.

    RÉPONDS AU FORMAT JSON :
    {
      "vote": "OUI" | "NON",
      "confidence": number,
      "analysis": "ton texte ici"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Nettoyage du JSON si Gemini ajoute des balises markdown
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("❌ Erreur lors de l'appel à Gemini:", error);
    return null;
  }
}
