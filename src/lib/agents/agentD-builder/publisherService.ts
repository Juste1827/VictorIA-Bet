import { supabase } from '@/lib/supabase';

/**
 * Agent D - Publisher Service
 * Role: Publication officielle du coupon et de son analyse sur la plateforme.
 */
export async function publishCoupon(couponData: any) {
  console.log(`📤 Publication du coupon ${couponData.category} sur VictorIA BET...`);

  try {
    const { data, error } = await supabase
      .from('coupons') // Assure-toi que cette table existe en Phase 2
      .insert([
        {
          code: couponData.code,
          category: couponData.category,
          odds: couponData.odds,
          matches: couponData.matches,
          analysis_report: couponData.analysis_report,
          is_special: couponData.is_special || false,
          valid_until: couponData.valid_until,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) throw error;
    
    console.log("🚀 Coupon publié avec succès sur la plateforme !");
    return true;
  } catch (error) {
    console.error("❌ Erreur lors de la publication:", error);
    return false;
  }
}
