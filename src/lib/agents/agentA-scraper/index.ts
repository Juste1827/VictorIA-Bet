import { BookmakerScraper } from './bookmakerScraper';
import { queryPerplexityStats } from './perplexityClient';

/**
 * AGENT A - ORCHESTRATEUR DE SCRAPING
 * Point d'entrée principal pour la collecte de données.
 */
async function runAgentA() {
  console.log("🕵️ Lancement de l'Agent A (Le Scraper)...");
  
  const scraper = new BookmakerScraper();
  
  try {
    await scraper.initialize();
    await scraper.login();

    // 1. Collecte des matchs
    const footballMatches = await scraper.scrapeFootballMatches();
    
    // 2. Analyse profonde (On prend le premier match pour l'exemple de démo)
    if (footballMatches.length > 0) {
      const targetMatch = footballMatches[0];
      console.log(`🔍 Analyse approfondie de : ${targetMatch.teams}`);
      
      const deepStats = await queryPerplexityStats(targetMatch.teams || "Match inconnu");
      
      const finalReport = {
        timestamp: new Date().toISOString(),
        source: "Agent A (VictorIA)",
        match: targetMatch,
        context: deepStats
      };

      console.log("📄 Rapport brut généré avec succès pour l'Agent B.");
      // Ici, on enregistrera normalement dans Supabase pour la Phase 2
      console.log(JSON.stringify(finalReport, null, 2));
    } else {
      console.log("ℹ️ Aucun match trouvé pour l'analyse immédiate.");
    }

  } catch (error) {
    console.error("💥 Erreur fatale Agent A:", error);
  } finally {
    await scraper.close();
  }
}

// Exécution si lancé directement
if (require.main === module) {
  runAgentA();
}

export { runAgentA };
