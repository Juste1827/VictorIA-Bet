import { validateWithGemini } from './geminiClient';
import { validateWithGPT } from './gptClient';

/**
 * AGENT C - ORCHESTRATEUR DE VALIDATION (CONSEIL DES SAGES)
 * Coordonne la validation croisée entre Gemini et GPT.
 */
async function runAgentC(agentBReport: any) {
  console.log("⚖️ Lancement de l'Agent C (Le Validateur)...");

  if (!agentBReport) return null;

  try {
    // 1. Lancement des validations en parallèle
    const [geminiResult, gptResult] = await Promise.all([
      validateWithGemini(agentBReport),
      validateWithGPT(agentBReport)
    ]);

    // 2. Système de vote
    let votesYes = 0;
    if (geminiResult?.vote === "OUI") votesYes++;
    if (gptResult?.vote === "OUI") votesYes++;

    // Note: Dans la pipeline finale, on ajouterait Claude et Perplexity ici aussi.
    // Pour l'instant, on simule le vote à 3/4 ou 4/4 avec nos deux modèles.
    const isValidated = votesYes >= 1; // Ajustable selon la sévérité voulue

    if (!isValidated) {
      console.log("❌ Pronostic rejeté par le Conseil des Sages.");
      return null;
    }

    // 3. Détermination de la catégorie (Standard ou Elite)
    const avgConfidence = ((geminiResult?.confidence || 0) + (gptResult?.confidenceScore || 0)) / 2;
    const category = avgConfidence >= 90 ? "ELITE" : "STANDARD";

    console.log(`✅ Pronostic validé en catégorie ${category} !`);

    // 4. Rapport Final Consolidé
    const finalReport = {
      timestamp: new Date().toISOString(),
      source: "Agent C (VictorIA)",
      category,
      avgConfidence,
      justification: geminiResult?.analysis || gptResult?.justification,
      details: {
        gemini: geminiResult,
        gpt: gptResult
      }
    };

    return finalReport;

  } catch (error) {
    console.error("💥 Erreur fatale Agent C:", error);
  }
  
  return null;
}

export { runAgentC };
