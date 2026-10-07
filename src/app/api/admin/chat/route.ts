import { NextResponse } from 'next/server';
import { AdminChatService } from '@/lib/agents/agentE-adminChat/adminChatService';

/**
 * API Route pour le Chat Admin (Agent E)
 */
export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    
    if (!message) {
      return NextResponse.json({ error: "Message vide" }, { status: 400 });
    }

    const agentE = new AdminChatService();
    const response = await agentE.processAdminMessage(message);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("❌ Erreur API Chat Admin:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
