import OpenAI from 'openai';
import dotenv from 'dotenv';
import { runAgentA } from '../agentA-scraper';
import { runAgentB } from '../agentB-math';
import { runAgentC } from '../agentC-validator';
import { runAgentD } from '../agentD-builder';

dotenv.config();

/**
 * Agent E - Admin Chat Service
 * Role: Ton assistant personnel capable de piloter toute la machine.
 */
export class AdminChatService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async processAdminMessage(message: string) {
    console.log("💬 Agent E analyse ta demande...");

    // 1. Analyse de l'intention avec GPT
    const analysis = await this.openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { 
          role: "system", 
          content: `Tu es l'Agent E, l'interface de contrôle de VictorIA BET. 
          Tu peux déclencher la pipeline de génération de coupons.
          Si l'admin demande de générer un coupon ou de chercher des matchs, réponds avec le mot-clé ACTION_TRIGGER_PIPELINE.` 
        },
        { role: "user", content: message }
      ]
    });

    const responseText = analysis.choices[0].message.content || "";

    // 2. Déclenchement de la Pipeline si nécessaire
    if (responseText.includes("ACTION_TRIGGER_PIPELINE")) {
      return await this.triggerPrivatePipeline();
    }

    return responseText;
  }

  private async triggerPrivatePipeline() {
    console.log("⚡ Déclenchement de la pipeline privée (A->D)...");

    // Exécution séquentielle des agents
    const reportA = await runAgentA();
    const reportB = await runAgentB(reportA);
    const reportC = await runAgentC(reportB);
    
    // Pour l'Agent D, on lui passe un flag 'private' pour qu'il ne publie pas sur le site
    const finalCoupon = await runAgentD({ ...reportC, is_special: true, private: true });

    return `✅ Pipeline terminée avec succès !\n\nVoici ton coupon privé :\nCode : **${finalCoupon?.code}**\nCote : ${finalCoupon?.odds}\nAnalyse : ${finalCoupon?.analysis_report}`;
  }
}
