// Importo Cors e serve dalla libreria std di Deno
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { Orchestrator } from "./orchestrator.ts";

// Lista di skill di base sempre considerate essenziali
const baseSkills = ["comunicazione", "problem solving", "lavoro di squadra", "pensiero critico"];

// Handler principale della Edge Function
serve(async (req: Request) => {
  // Gestisco la preflighted request per CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    // Leggo i dati JSON dal corpo della richiesta
    const body = await req.json();
    const { ingredients: skills, preferences } = body;
    
    // Verifico che siano state fornite skill e preferenze
    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return new Response(
        JSON.stringify({ error: "Skill non valide o mancanti" }),
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
    
    // Analizzo le skill
    console.log("Avvio analisi delle skill...");
    const result = await orchestrator.analyzeSkill(
      skills, 
      preferences,
      baseSkills
    );
    
    // Restituisco il risultato dell'analisi
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error: unknown) {
    console.error("Errore durante l'elaborazione:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Errore interno";
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
}); 