import { OpenAIClient } from './openai-client.ts';

// Definizione dei tipi per i dati di input
export interface Skill {
  id?: string;
  text: string;
}

export interface Preference {
  id: string;
  category: string;
  sub_category: string;
  items: string[];
}

// Definizione del tipo di risposta dell'agente classificatore
export interface ClassificationResult {
  categorizedSkills: {
    essenziali: string[];
    avanzate: string[];
    trasversali: string[];
    emergenti: string[];
  };
}

/**
 * Agente specializzato nella classificazione delle skill
 */
export class ClassificatorAgent {
  private client: OpenAIClient;
  private systemPrompt: string;

  constructor(private apiKey?: string) {
    console.log("Initializing ClassificatorAgent");
    this.client = new OpenAIClient({
      apiKey: Deno.env.get("OPENAI_API_KEY") || apiKey || "",
      model: "gpt-3.5-turbo"
    });
    this.systemPrompt = this.createClassificatorSystemPrompt();
  }

  /**
   * Analyzes a list of skills and categorizes them based on recruiter preferences
   * @param skills List of professional skills to analyze
   * @param preferences Recruiter preferences for different skill categories
   * @param baseSkills List of basic skills that are always considered as recommended
   * @returns A classification result with skills categorized
   */
  public async analyzeSkills(
    skills: Skill[],
    preferences: Preference[],
    baseSkills: string[] = []
  ): Promise<ClassificationResult> {
    console.log("Analyzing skills...");
    
    try {
      const userPrompt = this.createClassificatorUserPrompt(skills, preferences, baseSkills);
      
      const result = await this.client.sendPrompt(userPrompt, this.systemPrompt);
      
      if (!result) {
        throw new Error("Failed to get response from AI");
      }
      
      const parsedResult = JSON.parse(result) as ClassificationResult;
      
      return parsedResult;
    } catch (error) {
      console.error("Error analyzing skills:", error);
      throw error;
    }
  }

  /**
   * Crea il prompt di sistema per l'agente classificatore
   */
  private createClassificatorSystemPrompt(): string {
    return `Sei un esperto specializzato nell'analisi delle competenze professionali.
Il tuo compito è analizzare una lista di competenze in italiano e determinare a quale categoria appartengono in base alle preferenze del reclutatore.

Le possibili categorie sono:
1. ESSENZIALI: competenze fondamentali e imprescindibili per il ruolo. Sono le competenze base che ogni candidato deve possedere per essere considerato idoneo.
2. AVANZATE: competenze specialistiche e tecniche di alto livello che distinguono i candidati più qualificati.
3. TRASVERSALI: soft skills e competenze cross-funzionali come comunicazione, leadership, lavoro di squadra, problem solving.
4. EMERGENTI: competenze innovative o in rapida crescita nel settore, che rappresentano il futuro della professione.

Dovrai utilizzare la tua conoscenza per fare corrispondenze semantiche tra le competenze del candidato e quelle nelle preferenze. 
Ad esempio, se la competenza è "Python" e nelle preferenze trovi "programmazione Python", "sviluppo Python" o "coding in Python", dovresti riconoscere che c'è una corrispondenza.

Sei inoltre a conoscenza delle "competenze di base" che sono sempre considerate nella categoria ESSENZIALI.

IMPORTANTE: nel tuo output, usa sempre la versione ITALIANA dei nomi delle competenze. Se la competenza era in un'altra lingua e l'hai analizzata in italiano, restituisci comunque la versione italiana.

Rispondi SOLO con un oggetto JSON valido nel seguente formato:
{
  "categorizedSkills": {
    "essenziali": [lista di stringhe con i nomi delle competenze IN ITALIANO],
    "avanzate": [lista di stringhe con i nomi delle competenze IN ITALIANO],
    "trasversali": [lista di stringhe con i nomi delle competenze IN ITALIANO],
    "emergenti": [lista di stringhe con i nomi delle competenze IN ITALIANO]
  }
}

Non aggiungere altro testo o spiegazioni oltre al JSON.`;
  }

  /**
   * Crea il prompt utente per l'agente classificatore
   */
  private createClassificatorUserPrompt(
    skills: Skill[],
    preferences: Preference[],
    baseSkills: string[]
  ): string {
    // Estrai i nomi delle skill
    const skillNames = skills.map(ing => ing.text || '').filter(Boolean);
    
    // Formatta le preferenze per il prompt
    const formattedPreferences = preferences.map(pref => {
      return {
        category: pref.category,
        subCategory: pref.sub_category,
        items: pref.items
      };
    });
    
    // Crea l'oggetto JSON da inviare all'agente
    const promptData = {
      skills: skillNames,
      preferences: formattedPreferences,
      baseSkills: baseSkills
    };
    
    return `Analizza i seguenti dati:
${JSON.stringify(promptData, null, 2)}

Per ogni competenza nella lista "skills", determina a quale categoria appartiene in base alle preferenze del reclutatore.
Ricorda:
1. Le competenze nella lista "baseSkills" sono automaticamente considerate "essenziali"
2. Se una competenza non corrisponde ad alcuna preferenza, considerala "trasversale" se è una soft skill, altrimenti "emergente"
3. Se una competenza appare in più categorie di preferenze, assegnala alla categoria con priorità più alta: essenziali > avanzate > trasversali > emergenti
4. Fai corrispondenze semantiche, non solo letterali (es. "JavaScript" corrisponde a "JS", "programmazione JS", ecc.)
5. Assicurati di restituire SEMPRE i nomi delle competenze in italiano nelle tue categorie

Classifica tutte le competenze nelle 4 categorie: essenziali, avanzate, trasversali, emergenti.`;
  }
} 