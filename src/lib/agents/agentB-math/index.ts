import { analyzeWithClaude } from './claudeClient';

/**
 * AGENT B - ORCHESTRATEUR MATHÉMATIQUE
 * Reçoit le rapport de l'Agent A et génère un rapport probabiliste.
 */
async function runAgentB(agentAReport: any) {
  console.log("🧮 Lancement de l'Agent B (Le Mathématicien)...");
  
  if (!agentAReport) {
    console.error("❌ Erreur: Aucun rapport de l'Agent A fourni.");
    return null;
  }

  try {
    console.log(`📊 Analyse mathématique du match : ${agentAReport.match?.teams}`);
    
    const probabilisticAnalysis = await analyzeWithClaude(agentAReport);
    
    if (probabilisticAnalysis) {
      console.log("✅ Analyse probabiliste terminée.");
      
      const reportB = {
        timestamp: new Date().toISOString(),
        source: "Agent B (VictorIA)",
        analysis: JSON.parse(probabilisticAnalysis)
      };

      return reportB;
    }

  } catch (error) {
    console.error("💥 Erreur fatale Agent B:", error);
  }
  
  return null;
}

// Pour test indépendant
if (require.main === module) {
  const mockData = { match: { teams: "PSG vs Marseille" }, context: "Stats fictives" };
  runAgentB(mockData).then(console.log);
}

export { runAgentB };
