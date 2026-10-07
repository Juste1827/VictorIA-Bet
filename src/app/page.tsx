"use client"

import { ArrowRight, ShieldCheck, Zap, Star, Trophy, Users, BadgeCheck, CheckCircle2, TrendingUp, Sparkles, BrainCircuit, Wallet, Network, ChevronRight, HelpCircle, Info, Lock, Smartphone, MousePointer2, AlertTriangle, Scale, CreditCard, Mail, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useMemo } from "react";

// --- Composants Réutilisables ---

const SectionTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-16">
    <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter font-outfit mb-4 leading-tight">{title}</h2>
    {subtitle && <p className="text-primary font-bold uppercase tracking-[0.3em] text-xs">{subtitle}</p>}
  </div>
);

const InfiniteMarquee = ({ children, speed = 40, direction = "left" }: { children: React.ReactNode, speed?: number, direction?: "left" | "right" }) => {
  return (
    <div className="flex overflow-hidden group select-none py-12 border-y border-white/5 bg-white/[0.01]">
      <motion.div 
        animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
        className="flex flex-nowrap shrink-0 gap-12"
      >
        <div className="flex gap-12 items-center">
          {children}
        </div>
        <div className="flex gap-12 items-center">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/5 py-6">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left group">
        <span className="text-lg font-black text-white/80 group-hover:text-primary transition-colors font-outfit uppercase tracking-tight">{question}</span>
        <ChevronRight className={`w-5 h-5 text-primary transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="mt-4 text-muted text-base leading-relaxed pb-4">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AICard = ({ title, company, specialty, desc, image, delay }: { title: string, company: string, specialty: string, desc: string, image: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="glass-card p-10 relative group overflow-hidden h-full"
  >
    <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-[50px] group-hover:bg-primary/10 transition-all duration-700" />
    
    <div className="flex flex-col lg:flex-row gap-8 items-start relative z-10">
       <motion.div 
         animate={{ y: [0, -10, 0] }}
         transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: delay * 2 }}
         className="relative w-28 h-28 shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black"
       >
          <Image src={image} fill alt={title} className="object-contain mix-blend-screen brightness-125 p-2" />
       </motion.div>
       <div className="flex-grow">
          <div className="flex flex-wrap items-center gap-3 mb-2">
             <h3 className="text-2xl font-black text-white font-outfit uppercase tracking-tighter">{title}</h3>
             <span className="text-[10px] text-primary/60 font-black uppercase tracking-[0.2em] border border-primary/20 px-2 py-0.5 rounded-md">— {company}</span>
          </div>
          <div className="text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-6">Spécialité : {specialty}</div>
          <p className="text-muted text-base leading-relaxed font-medium">{desc}</p>
       </div>
    </div>
  </motion.div>
);

const HistoryBadge = ({ odds, status, type, date }: { odds: string, status: string, type: string, date: string }) => (
  <div className="flex items-center gap-6 px-8 py-5 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-primary/30 transition-all whitespace-nowrap min-w-[300px]">
    <div className="flex flex-col">
       <div className="text-[9px] font-black text-muted uppercase tracking-[0.3em] font-outfit">{date}</div>
       <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] font-outfit mt-1">{type}</div>
    </div>
    <div className="h-8 w-[1px] bg-white/10" />
    <div className="text-2xl font-black text-white font-outfit tracking-tight">{odds}</div>
    <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-lg text-[9px] font-black text-primary uppercase tracking-widest">
      <BadgeCheck className="w-3 h-3" />
      {status}
    </div>
  </div>
);

const TestimonialCard = ({ name, role, text }: { name: string, role: string, text: string }) => (
  <div className="w-[450px] glass-card p-10 border-white/5 hover:border-primary/20 transition-all duration-500 shrink-0">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center text-black font-black text-xl font-outfit">
        {name[0]}
      </div>
      <div>
        <div className="text-lg font-black text-white font-outfit uppercase tracking-tight leading-none">{name}</div>
        <div className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mt-1">{role}</div>
      </div>
      <div className="ml-auto flex gap-1">
        {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-primary fill-current" />)}
      </div>
    </div>
    <p className="text-muted text-base leading-relaxed font-medium italic">"{text}"</p>
  </div>
);

// --- Données ---

const PAST_RESULTS = [
  { date: "25 AVR 2026", odds: "COTE 4.82", status: "GAGNÉ", type: "Standard" },
  { date: "24 AVR 2026", odds: "COTE 8.50", status: "GAGNÉ", type: "Élite" },
  { date: "24 AVR 2026", odds: "COTE 3.50", status: "GAGNÉ", type: "Standard" },
  { date: "23 AVR 2026", odds: "COTE 9.12", status: "GAGNÉ", type: "Élite" },
  { date: "22 AVR 2026", odds: "COTE 4.40", status: "GAGNÉ", type: "Standard" },
  { date: "21 AVR 2026", odds: "COTE 7.20", status: "GAGNÉ", type: "Élite" },
  { date: "20 AVR 2026", odds: "COTE 3.25", status: "GAGNÉ", type: "Standard" },
];

const TESTIMONIALS = [
  { name: "Marc K.", role: "Parieur Professionnel", text: "Depuis que j'utilise VictorIA, ma gestion de bankroll est devenue chirurgicale. Les 80% de proba changent tout." },
  { name: "Sonia B.", role: "Inscrite depuis 3 mois", text: "Le ticket Élite à 150f est incroyable. J'ai validé une cote de 9.5 hier soir sur le basket. Merci !" },
  { name: "Ibrahim D.", role: "Utilisateur Standard", text: "Simple, rapide et surtout honnête. On sent que c'est de la science derrière et pas du hasard." },
  { name: "Yasmine L.", role: "Affiliée Élite", text: "Le système de parrainage me permet de payer mes tickets simplement en invitant mes amis. Génial." },
];

// --- Composant Principal ---

export default function Home() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const [selectedDate, setSelectedDate] = useState("Toutes les dates");
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 150]);

  const dates = useMemo(() => ["Toutes les dates", ...new Set(PAST_RESULTS.map(r => r.date))], []);
  const filteredResults = useMemo(() => {
    if (selectedDate === "Toutes les dates") return PAST_RESULTS;
    return PAST_RESULTS.filter(r => r.date === selectedDate);
  }, [selectedDate]);

  return (
    <div ref={targetRef} className="flex flex-col min-h-screen bg-[#020408] text-[#F8FAFC] font-inter overflow-x-hidden selection:bg-primary/30">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* 1. EN-TÊTE */}
      <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#020408]/60 backdrop-blur-2xl">
        <div className="container mx-auto px-6 lg:px-10 h-24 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative w-16 h-16">
               <Image 
                src="/images/logo.png" 
                fill 
                alt="VictorIA Logo" 
                className="object-contain mix-blend-screen brightness-125 contrast-[1.6] saturate-[1.1]" 
                priority 
               />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter text-white font-outfit leading-none uppercase">VictorIA BET</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[10px] font-black hover:text-primary transition-colors hidden sm:block uppercase tracking-[0.2em] font-outfit text-white">Se Connecter</Link>
            <Link href="/register" className="bg-primary text-black px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] font-outfit shadow-xl shadow-primary/20">S'Inscrire</Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="relative pt-48 pb-32 lg:pt-64 lg:pb-56 overflow-hidden">
          <div className="container mx-auto px-6 text-center max-w-5xl mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary/5 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-12 font-outfit">
              ⚠️ Paris sportifs réservés aux personnes majeures (18+). Jouez de manière responsable.
            </motion.div>
            
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl lg:text-[7rem] font-black tracking-tighter mb-12 leading-[0.9] uppercase font-outfit">
              VictorIA BET – La puissance de l’IA au service de vos <span className="premium-gradient-text italic">paris sportifs</span>
            </motion.h1>
            
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-muted text-lg md:text-xl max-w-4xl mb-16 leading-relaxed font-medium">
              Optimisez vos décisions grâce à l’analyse combinée de 4 intelligences artificielles avancées et des modèles statistiques rigoureux.
            </motion.p>

            <div className="flex flex-col items-center gap-8 mb-20">
              <div className="flex flex-wrap justify-center gap-4">
                 <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Matin : 10h00</span>
                 </div>
                 <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Soir : 17h00</span>
                 </div>
                 <div className="px-6 py-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-3">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Alertes Flash 24/7</span>
                 </div>
              </div>
              <p className="text-primary font-black uppercase tracking-[0.3em] text-sm animate-pulse">
                Des prédictions basées sur les données, validées uniquement à partir de 80% de probabilité minimale.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                 <Link href="#résultats" className="px-12 py-6 rounded-2xl bg-white text-black text-lg font-black uppercase tracking-tighter hover:bg-primary transition-all shadow-2xl font-outfit">
                   👉 Voir les pronostics
                 </Link>
                 <Link href="#tarifs" className="px-12 py-6 rounded-2xl bg-primary/10 border border-primary/20 text-primary text-lg font-black uppercase tracking-tighter hover:bg-primary/20 transition-all font-outfit">
                   👉 Acheter un ticket
                 </Link>
              </div>
            </div>
          </div>

          <motion.div style={{ y: y1 }} className="absolute top-[15%] -left-20 w-[500px] h-[500px] opacity-40 blur-sm pointer-events-none hidden xl:block">
            <div className="relative w-full h-full [mask-image:radial-gradient(circle,white_0%,transparent_80%)]">
              <Image src="/images/cubes.png" fill alt="Cubes" className="rotate-45 mix-blend-screen brightness-125" />
            </div>
          </motion.div>
          <motion.div style={{ y: y2 }} className="absolute bottom-[15%] -right-20 w-[500px] h-[500px] opacity-40 blur-sm pointer-events-none hidden xl:block">
            <div className="relative w-full h-full [mask-image:radial-gradient(circle,white_0%,transparent_80%)]">
              <Image src="/images/orb.png" fill alt="Orbe" className="-rotate-12 mix-blend-screen brightness-125" />
            </div>
          </motion.div>
        </section>

        {/* 2. SECTION – LES 4 IA QUI TRAVAILLENT POUR VOUS */}
        <section id="fonctionnement" className="py-40 border-t border-white/5 bg-white/[0.01]">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mb-24">
               <SectionTitle title="Les 4 IA qui travaillent pour vous" subtitle="Une expertise technologique sans précédent" />
               <p className="text-muted text-lg leading-relaxed font-medium">
                  VictorIA BET repose sur une approche innovante combinant la puissance de quatre intelligences artificielles complémentaires. Chaque IA intervient sur un domaine spécifique afin de garantir une analyse complète et fiable.
               </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
               <AICard 
                 title="Claude Opus 4.6" 
                 company="Anthropic" 
                 specialty="Analyse prédictive et raisonnement profond" 
                 desc="Claude Opus 4.6 est chargé de valider ou d'infirmer les statistiques historiques et d'évaluer les conditions particulières du match (terrain neutre, enjeux psychologiques, rivalités). Son analyse contextuelle permet de détecter les pièges que les statistiques brutes ne révèlent pas."
                 image="/images/claude.png"
                 delay={0.1}
               />
               <AICard 
                 title="Perplexity AI" 
                 company="Real-time Engine" 
                 specialty="Recherche web en temps réel" 
                 desc="Perplexity scrute en temps réel les actualités sportives mondiales : blessures de dernière minute, déclarations en conférence de presse, compositions d'équipe officielles, suspensions non encore médiatisées. Aucune information récente n'échappe à son radar."
                 image="/images/perplexity.png"
                 delay={0.2}
               />
               <AICard 
                 title="Gemini Flash 3.1" 
                 company="Google" 
                 specialty="Analyse des dynamiques de forme et momentum" 
                 desc="Gemini évalue la forme récente des équipes en profondeur : séries de résultats, momentum psychologique, impact des victoires ou défaites consécutives. Il traduit la dynamique d'une équipe en signal probabiliste fiable."
                 image="/images/gemini.png"
                 delay={0.3}
               />
               <AICard 
                 title="GPT-5.4" 
                 company="OpenAI" 
                 specialty="Calcul de probabilités et modélisation statistique" 
                 desc="GPT-5.4 applique des modèles mathématiques avancés — loi de Poisson, calculs bayésiens, probabilités conditionnelles — pour convertir toutes les données collectées en une probabilité de gain précise et vérifiable."
                 image="/images/openai.png"
                 delay={0.4}
               />
            </div>
          </div>
        </section>

        {/* HISTORIQUE DYNAMIQUE */}
        <section id="résultats" className="py-40 bg-[#020408]">
           <div className="container mx-auto px-6 lg:px-12">
              <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
                 <SectionTitle title="Historique des pronostics" subtitle="La preuve par les résultats" />
                 <div className="flex items-center gap-4 p-2 bg-white/5 rounded-2xl border border-white/10">
                    <Calendar className="w-5 h-5 text-primary ml-4" />
                    <select 
                      value={selectedDate} 
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="bg-transparent text-white font-black uppercase tracking-widest text-[10px] outline-none pr-8 py-3 cursor-pointer"
                    >
                       {dates.map(d => <option key={d} value={d} className="bg-[#020408]">{d}</option>)}
                    </select>
                 </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
                 <AnimatePresence mode="popLayout">
                    {filteredResults.map((r, i) => (
                       <motion.div key={`${r.date}-${i}`} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
                          <HistoryBadge {...r} />
                       </motion.div>
                    ))}
                 </AnimatePresence>
              </div>
           </div>
           
           <div className="mt-20">
              <InfiniteMarquee speed={30} direction="right">
                 {PAST_RESULTS.map((r, i) => <HistoryBadge key={`marquee-${i}`} {...r} />)}
              </InfiniteMarquee>
           </div>
        </section>

        {/* TÉMOIGNAGES DÉFILANTS */}
        <section className="py-40 border-t border-white/5">
           <div className="container mx-auto px-6 mb-20">
              <SectionTitle title="Ils ont fait confiance à l'IA" subtitle="Témoignages de la communauté" />
           </div>
           <InfiniteMarquee speed={50} direction="left">
              {TESTIMONIALS.map((t, i) => <TestimonialCard key={`testi-${i}`} {...t} />)}
           </InfiniteMarquee>
        </section>

        {/* OFFRES & TARIFS */}
        <section id="tarifs" className="py-40 bg-white/[0.01] border-y border-white/5">
          <div className="container mx-auto px-6">
            <div className="text-center mb-24">
               <SectionTitle title="Choisissez votre niveau de gain" />
            </div>
            <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
               {[
                 { name: "Ticket Standard", price: "100", cote: "Côtes : 3 à 5", popular: true, icon: Star },
                 { name: "Ticket Élite", price: "150", cote: "Côtes : 6 à 10", icon: Trophy }
               ].map((tier, i) => (
                 <div key={i} className={`glass-card p-12 flex flex-col items-center text-center transition-all duration-500 hover:translate-y-[-10px] ${tier.popular ? 'border-primary border-2 shadow-2xl shadow-primary/10' : ''}`}>
                    <tier.icon className="w-16 h-16 text-primary mb-8" />
                    <h3 className="text-3xl font-black mb-4 uppercase font-outfit">{tier.name}</h3>
                    <div className="text-2xl font-black text-primary uppercase tracking-tighter mb-8 font-outfit bg-primary/10 px-6 py-2 rounded-xl">{tier.cote}</div>
                    <div className="flex items-baseline gap-3 mb-12">
                       <span className="text-7xl font-black text-white font-outfit">{tier.price}</span>
                       <span className="text-muted font-black text-lg uppercase tracking-widest font-outfit">FCFA</span>
                    </div>
                    <Link href="/register" className="w-full py-6 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-primary transition-all shadow-xl">Acheter un ticket</Link>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* FAQ & RESPONSABILITÉ */}
        <section id="faq" className="py-40">
           <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-24">
              <div>
                 <SectionTitle title="Questions fréquentes" />
                 <div className="space-y-4">
                    <FAQItem question="Les gains sont-ils garantis ?" answer="Une prédiction reste une probabilité. Elle ne garantit pas implacablement une victoire, car elle peut échouer par des facteurs naturels. C'est un outil qui aide à gagner à 90% du temps." />
                    <FAQItem question="Quels sports sont analysés ?" answer="Nous analysons en profondeur le Football, le Tennis et le Basket-ball mondial pour maximiser la fiabilité de nos modèles." />
                    <FAQItem question="Comment recevoir mon ticket ?" answer="Après validation de votre paiement, le coupon apparaît instantanément dans votre espace utilisateur. Les nouveaux coupons sont publiés chaque jour à 10h00 et 17h00, avec des alertes flash en cas d'opportunités urgentes." />
                 </div>
              </div>
              <div className="p-16 border border-red-500/20 bg-red-500/[0.02] rounded-[3rem]">
                 <SectionTitle title="Jouez Responsable" />
                 <p className="text-white font-bold mb-8">Les paris sportifs comportent des risques. VictorIA BET est un outil d’aide à la décision.</p>
                 <ul className="space-y-4 text-muted font-medium mb-12">
                    <li>✔ Ne pariez que l'argent que vous pouvez perdre.</li>
                    <li>✔ Fixez-vous des limites de temps et d'argent.</li>
                    <li>✔ Interdit aux mineurs de moins de 18 ans.</li>
                 </ul>
                 <div className="inline-flex items-center gap-3 px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 font-black uppercase tracking-widest text-[10px]">
                    🔞 INTERDIT AUX MOINS DE 18 ANS
                 </div>
              </div>
           </div>
        </section>
      </main>

      {/* PIED DE PAGE SANS NUMÉROS ET SANS COPYRIGHT FINAL */}
      <footer className="bg-[#010204] pt-40 pb-20 relative border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-4 gap-20">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-6 mb-10">
                <Image src="/images/logo.png" width={64} height={64} alt="Logo" className="object-contain mix-blend-screen brightness-110" />
                <span className="text-3xl font-black tracking-tighter text-white font-outfit uppercase">VictorIA BET</span>
              </div>
              <p className="text-muted text-sm max-w-md leading-relaxed mb-12 italic">"La puissance de l’IA au service de vos paris sportifs. Optimisez vos décisions."</p>
              <div className="flex gap-10 text-[11px] font-black uppercase tracking-widest text-muted/60">
                 <div className="flex items-center gap-2 cursor-pointer hover:text-primary"><Mail className="w-4 h-4" /> contact@victoria-bet.com</div>
                 <div className="flex items-center gap-2"><Smartphone className="w-4 h-4" /> Paiements Mobile Money</div>
              </div>
            </div>
            
            <div className="space-y-12">
              <div>
                <h4 className="text-[12px] font-black text-white uppercase tracking-[0.4em] mb-8 font-outfit">MENTIONS LÉGALES</h4>
                <p className="text-[11px] text-muted leading-relaxed">VictorIA BET est une plateforme d’analyse de données sportives. Nous ne sommes pas un bookmaker et ne prenons pas de paris.</p>
              </div>
              <div>
                <h4 className="text-[12px] font-black text-white uppercase tracking-[0.4em] mb-8 font-outfit">CGU</h4>
                <ul className="text-[10px] text-muted/60 space-y-3 font-bold uppercase tracking-widest">
                   <li>Accès 18+ strictement appliqué</li>
                   <li>Usage personnel uniquement</li>
                   <li>Risques liés au jeu reconnus</li>
                </ul>
              </div>
            </div>

            <div className="space-y-12">
              <div>
                <h4 className="text-[12px] font-black text-white uppercase tracking-[0.4em] mb-8 font-outfit">CONFIDENTIALITÉ</h4>
                <p className="text-[11px] text-muted leading-relaxed">Protection totale de vos données de transaction et d'identité.</p>
              </div>
              <div>
                <h4 className="text-[12px] font-black text-white uppercase tracking-[0.4em] mb-8 font-outfit">AFFILIATION</h4>
                <p className="text-[11px] text-muted leading-relaxed">Partenariat transparent avec les bookmakers officiels.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
