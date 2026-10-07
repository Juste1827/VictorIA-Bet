import { CouponService } from './couponService';
import { publishCoupon } from './publisherService';

/**
 * AGENT D - ORCHESTRATEUR DE CONSTRUCTION & PUBLICATION
 * Transforme l'analyse validée en un produit fini sur le site.
 */
async function runAgentD(agentCReport: any) {
  console.log("🎫 Lancement de l'Agent D (Le Constructeur)...");

  if (!agentCReport) return null;

  const couponService = new CouponService();
  
  try {
    await couponService.initialize();

    // 1. Génération du code réel
    const realCode = await couponService.createCouponCode(agentCReport.details?.matches || []);

    // 2. Préparation des données de publication
    const now = new Date();
    const validUntil = new Date(now.getTime() + 6 * 60 * 60 * 1000); // Valide 6h par défaut

    const finalCoupon = {
      code: realCode,
      category: agentCReport.category,
      odds: agentCReport.avgConfidence > 90 ? 8.5 : 3.5, // Exemple de cote
      matches: agentCReport.details?.matches || [],
      analysis_report: agentCReport.justification,
      valid_until: validUntil.toISOString(),
      is_special: agentCReport.is_special || false
    };

    // 3. Publication
    const success = await publishCoupon(finalCoupon);

    if (success) {
      console.log(`✨ Processus terminé. Coupon [${realCode}] disponible pour les utilisateurs.`);
    }

    return finalCoupon;

  } catch (error) {
    console.error("💥 Erreur fatale Agent D:", error);
  } finally {
    await couponService.close();
  }
  
  return null;
}

export { runAgentD };
