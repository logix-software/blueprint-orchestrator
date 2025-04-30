import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { Orchestrator } from '../_shared/orchestrator.ts';
import type { Preference, ClassificationResult } from '../_shared/classificator-agent.ts';

serve(async (req: Request) => {
  // Gestisco la preflighted request per CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    // Leggo i dati JSON dal corpo della richiesta
    const body = await req.json();
    const { classificationResult, preferences } = body;
    
    // Verifico che siano stati forniti i dati necessari
    if (!classificationResult || !classificationResult.categorizedSkills) {
      return new Response(
        JSON.stringify({ error: "Risultato della classificazione non valido o mancante" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    if (!preferences || !Array.isArray(preferences) || preferences.length === 0) {
      return new Response(
        JSON.stringify({ error: "Preferenze non valide o mancanti" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Creo istanza dell'orchestratore
    const orchestrator = new Orchestrator();
    
    // Analizzo il profilo
    console.log("Avvio analisi del profilo...");
    const result = await orchestrator.analyzeProfile(
      classificationResult,
      preferences
    );
    
    // Restituisco il risultato dell'analisi
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Errore durante l'elaborazione:", error);
    
    return new Response(
      JSON.stringify({ error: "Errore interno del server" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
}); 