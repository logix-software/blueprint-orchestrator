import { OpenAIClient } from './openai-client.ts';
import type { Preference, ClassificationResult } from './classificator-agent.ts';

export interface ProfileAnalysis {
  descrizione: string;
  pro: string[];
  contro: string[];
}

export class ProfileAnalyzerAgent {
  private client: OpenAIClient;
  private systemPrompt: string;

  constructor(private apiKey?: string) {
    console.log("Initializing ProfileAnalyzerAgent");
    this.client = new OpenAIClient({
      apiKey: Deno.env.get("OPENAI_API_KEY") || apiKey || "",
      model: "gpt-4"
    });
    this.systemPrompt = this.createProfileAnalyzerSystemPrompt();
  }

  private createProfileAnalyzerSystemPrompt(): string {
    return `Sei un esperto recruiter specializzato nell'analisi dei profili professionali.
Il tuo compito è analizzare le competenze di un candidato e le preferenze del recruiter per creare:
1. Una descrizione riassuntiva del profilo professionale
2. Un elenco di punti di forza (PRO) che supportano l'assunzione
3. Un elenco di potenziali criticità (CONTRO) che potrebbero sconsigliare l'assunzione

Considera attentamente:
- Il match tra competenze del candidato e preferenze del recruiter
- Il bilanciamento tra competenze tecniche e soft skill
- L'allineamento con i requisiti essenziali
- Il potenziale di crescita e adattabilità

Rispondi SOLO con un oggetto JSON nel seguente formato:
{
  "descrizione": "Descrizione dettagliata del profilo...",
  "pro": ["punto di forza 1", "punto di forza 2", ...],
  "contro": ["criticità 1", "criticità 2", ...]
}`;
  }

  public async analyzeProfile(
    classificationResult: ClassificationResult,
    preferences: Preference[]
  ): Promise<ProfileAnalysis> {
    try {
      const userPrompt = this.createProfileAnalyzerUserPrompt(classificationResult, preferences);
      const result = await this.client.sendPrompt(userPrompt, this.systemPrompt);
      
      if (!result) {
        throw new Error("Failed to get response from AI");
      }
      
      return JSON.parse(result) as ProfileAnalysis;
    } catch (error) {
      console.error("Error analyzing profile:", error);
      throw error;
    }
  }

  private createProfileAnalyzerUserPrompt(
    classificationResult: ClassificationResult,
    preferences: Preference[]
  ): string {
    const promptData = {
      classificazione: classificationResult,
      preferenze: preferences
    };

    return `Analizza il seguente profilo professionale:
${JSON.stringify(promptData, null, 2)}

Crea:
1. Una descrizione riassuntiva che evidenzi le caratteristiche principali del profilo
2. Un elenco di PRO che supportano l'assunzione
3. Un elenco di CONTRO che potrebbero sconsigliare l'assunzione

Considera in particolare:
- Quante competenze essenziali possiede rispetto a quelle richieste
- La presenza di competenze avanzate e il loro valore aggiunto
- Il bilanciamento tra competenze tecniche e trasversali
- La presenza di competenze emergenti e il loro potenziale impatto

Fornisci una valutazione obiettiva e bilanciata.`;
  }
} 