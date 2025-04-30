import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { OpenAIClient } from './openai-client.ts';

// Definizione dell'interfaccia per le skill
export interface Skill {
  text: string;
  id?: string;
  rank?: number;
  percent_estimate?: number;
  percent_max?: number;
  percent_min?: number;
  vegan?: string;
  vegetarian?: string;
}

// Alias per retrocompatibilità
export type Ingredient = Skill;

/**
 * Agente specializzato nella traduzione delle skill in italiano
 */
export class TranslatorAgent {
  private openaiClient: OpenAIClient | null = null;

  constructor(private apiKey?: string) {
    this.initializeClient(apiKey);
  }

  /**
   * Inizializza il client OpenAI recuperando la chiave API se necessario
   */
  private initializeClient(apiKey?: string): void {
    // Se la chiave è stata fornita, usala
    if (apiKey) {
      this.openaiClient = new OpenAIClient({
        apiKey,
        model: "gpt-4",  // Utilizziamo GPT-4 per le migliori performance
        temperature: 0,   // Temperatura bassa per risposte più deterministiche
        maxTokens: 2000   // Limita i token di risposta per controllare i costi
      });
      return;
    }
    
    // Altrimenti, prova a recuperarla dalle variabili d'ambiente
    const envApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!envApiKey) {
      throw new Error("OPENAI_API_KEY non trovata nelle variabili d'ambiente");
    }
    
    this.openaiClient = new OpenAIClient({
      apiKey: envApiKey,
      model: "gpt-4",
      temperature: 0,
      maxTokens: 2000
    });
  }

  /**
   * Traduce le skill in italiano se necessario
   */
  async translateToItalian(skills: Skill[]): Promise<Skill[]> {
    console.log("TranslatorAgent: Verificando se è necessario tradurre le skill");
    
    // Se non ci sono skill, ritorna l'array vuoto
    if (!skills || skills.length === 0) {
      return [];
    }
    
    // Verifica se le skill sono già in italiano
    const hasItalianId = skills.some(skill => skill.id && skill.id.includes("it:"));
    const hasAnyId = skills.some(skill => skill.id);
    
    // Se non ci sono ID, assumiamo che le skill siano già in italiano
    // Se c'è almeno un ID italiano, le skill sono già in italiano
    if (!hasAnyId || hasItalianId) {
      console.log("TranslatorAgent: Le skill sono già in italiano prima verifica sull'ID");
      return skills;
    }
    
    // Se arriviamo qui, le skill non sono in italiano e vanno tradotte
    console.log("TranslatorAgent: Traducendo le skill in italiano");
    
    // Prendi i testi delle skill
    const skillTexts = skills.map(skill => skill.text || '').filter(Boolean);
    
    // Verifica se sembrano già in italiano (semplice euristica)
    const possiblyNonItalian = skillTexts.some(text => {
      // Parole che indicano testo non italiano (inglese, francese, tedesco, spagnolo)
      const nonItalianWords = ['water', 'milk', 'sugar', 'salt', 'oil', 'wheat', 'flour', 'egg', 
                              'eau', 'lait', 'sucre', 'sel', 'huile', 'blé', 'farine', 'oeuf',
                              'wasser', 'milch', 'zucker', 'salz', 'öl', 'weizen', 'mehl', 'ei',
                              'agua', 'leche', 'azúcar', 'sal', 'aceite', 'trigo', 'harina', 'huevo'];
      
      return nonItalianWords.some(word => 
        text.toLowerCase().includes(word.toLowerCase()) && 
        !/acqua|latte|zucchero|sale|olio|grano|farina|uovo/i.test(text)
      );
    });
    
    // Se tutte sembrano già in italiano, ritorna le skill originali
    if (!possiblyNonItalian) {
      console.log("TranslatorAgent: Le skill sembrano già in italiano");
      return skills;
    }
    
    // Assicurati che il client OpenAI sia inizializzato
    if (!this.openaiClient) {
      this.initializeClient();
    }
    
    // Verifica che il client sia stato inizializzato correttamente
    if (!this.openaiClient) {
      console.error("Impossibile inizializzare il client OpenAI per la traduzione. Uso le skill originali.");
      return skills;
    }
    
    console.log("TranslatorAgent: Traducendo le skill in italiano");
    
    try {
      // Crea il prompt per la traduzione
      const systemPrompt = `Sei un esperto linguistico specializzato nella traduzione di skill in italiano.
Il tuo compito è tradurre una lista di skill in italiano corretto.
Assicurati che i termini tecnici e specifici siano tradotti con precisione.
Rispondi SOLO con un oggetto JSON contenente la lista delle skill tradotte, senza aggiungere altri testi o spiegazioni.`;
      
      const userPrompt = `Traduci le seguenti skill in italiano, mantenendo lo stesso ordine:
${JSON.stringify(skillTexts, null, 2)}

Esempi di traduzione:
- "water" → "acqua"
- "milk" → "latte"
- "sugar" → "zucchero"
- "salt" → "sale"
- "wheat flour" → "farina di frumento"
- "eggs" → "uova"
- "emulsifier" → "emulsionante"
- "preservative" → "conservante"
- "flavouring" → "aromi"
- "stabiliser" → "stabilizzante"

Rispondi SOLO con un oggetto JSON nel seguente formato:
{
  "skills": [
    "skill 1 tradotta in italiano",
    "skill 2 tradotta in italiano",
    ...
  ]
}`;
      
      // Invia la richiesta al modello
      const response = await this.openaiClient.createChatCompletion([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ], {
        response_format: { type: "json_object" }
      });
      
      const content = response.choices[0]?.message?.content || "{}";
      console.log("TranslatorAgent: Risposta di traduzione ricevuta");
      
      try {
        // Parsing della risposta JSON
        const result = JSON.parse(content);
        
        // Verifica che la risposta contenga un array di skill tradotte
        if (!result.skills && !result.ingredients) {
          console.error("Risposta di traduzione non valida: formato non corretto");
          console.error("Contenuto della risposta:", content);
          
          // Prova a estrarre skill dal risultato se possibile
          const extractedSkills = this.extractSkillsFromResponse(result, skillTexts.length);
          if (extractedSkills.length > 0) {
            console.log("TranslatorAgent: Skill estratte dal risultato in formato non standard");
            
            // Crea nuovi oggetti skill con i testi tradotti
            const translatedSkills = skills.map((skill, index) => {
              if (index < extractedSkills.length) {
                return { ...skill, text: extractedSkills[index] };
              }
              return skill; // Se manca la traduzione, mantieni l'originale
            });
            
            console.log("TranslatorAgent: Traduzione completata:", translatedSkills.map(i => i.text).join(", "));
            return translatedSkills;
          }
          
          // In caso di errore, ritorna le skill originali
          return skills;
        }
        
        // Supporto sia per "skills" che per "ingredients" per retrocompatibilità
        const translatedItems = result.skills || result.ingredients || [];
        
        // Crea nuovi oggetti skill con i testi tradotti
        const translatedSkills = skills.map((skill, index) => {
          if (index < translatedItems.length) {
            return { ...skill, text: translatedItems[index] };
          }
          return skill; // Se manca la traduzione, mantieni l'originale
        });
        
        console.log("TranslatorAgent: Traduzione completata:", translatedSkills.map(i => i.text).join(", "));
        return translatedSkills;
        
      } catch (parseError) {
        console.error("Errore nel parsing della risposta di traduzione:", parseError);
        console.error("Contenuto della risposta:", content);
        
        // In caso di errore, ritorna le skill originali
        return skills;
      }
    } catch (error) {
      console.error("Errore durante la traduzione delle skill:", error);
      // In caso di errore, ritorna le skill originali
      return skills;
    }
  }
  
  /**
   * Metodo di supporto per estrarre skill da una risposta non standard
   */
  private extractSkillsFromResponse(result: any, expectedCount: number): string[] {
    const extractedSkills: string[] = [];
    
    // Cerca in tutte le proprietà del risultato
    for (const key in result) {
      if (Array.isArray(result[key])) {
        // Se il contenuto è un array, controlla se potrebbe essere la lista delle skill
        if (result[key].length > 0 && result[key].length <= expectedCount * 1.5) {
          // Verifica che tutti gli elementi siano stringhe
          const allStrings = result[key].every((item: any) => typeof item === 'string');
          if (allStrings) {
            extractedSkills.push(...result[key]);
            if (extractedSkills.length >= expectedCount) {
              return extractedSkills.slice(0, expectedCount);
            }
          }
        }
      } else if (typeof result[key] === 'object' && result[key] !== null) {
        // Se è un oggetto, cerca ricorsivamente
        const nestedSkills = this.extractSkillsFromResponse(result[key], expectedCount);
        if (nestedSkills.length > 0) {
          extractedSkills.push(...nestedSkills);
          if (extractedSkills.length >= expectedCount) {
            return extractedSkills.slice(0, expectedCount);
          }
        }
      }
    }
    
    return extractedSkills;
  }
  
  // Manteniamo il vecchio metodo per retrocompatibilità
  private extractIngredientsFromResponse(result: any, expectedCount: number): string[] {
    return this.extractSkillsFromResponse(result, expectedCount);
  }
} 