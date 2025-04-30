import { OpenAIClient } from './openai-client.ts';
import type { ProfileAnalysis } from './profile-analyzer-agent.ts';

export class AggregatorAgent {
  private client: OpenAIClient;
  private systemPrompt: string;

  constructor(private apiKey?: string) {
    console.log("Initializing AggregatorAgent");
    this.client = new OpenAIClient({
      apiKey: Deno.env.get("OPENAI_API_KEY") || apiKey || "",
      model: "gpt-4"
    });
    this.systemPrompt = this.createAggregatorSystemPrompt();
  }

  private createAggregatorSystemPrompt(): string {
    return `Sei un esperto analista specializzato nella sintesi di valutazioni multiple.
Il tuo compito è analizzare diverse valutazioni di un profilo professionale e creare una sintesi finale che:
1. Integri le osservazioni più rilevanti e ricorrenti
2. Identifichi i punti di forza (PRO) più significativi
3. Evidenzi le criticità (CONTRO) più importanti

Nel processo di aggregazione:
- Dai maggior peso alle osservazioni che compaiono in più valutazioni
- Mantieni solo i punti più significativi e ben argomentati
- Risolvi eventuali contraddizioni tra le valutazioni
- Crea una descrizione che sintetizzi efficacemente tutte le prospettive

Rispondi SOLO con un oggetto JSON nel seguente formato:
{
  "descrizione": "Sintesi dettagliata delle valutazioni...",
  "pro": ["punto di forza 1", "punto di forza 2", ...],
  "contro": ["criticità 1", "criticità 2", ...]
}`;
  }

  public async aggregateAnalyses(analyses: ProfileAnalysis[]): Promise<ProfileAnalysis> {
    try {
      const userPrompt = this.createAggregatorUserPrompt(analyses);
      const result = await this.client.sendPrompt(userPrompt, this.systemPrompt);
      
      if (!result) {
        throw new Error("Failed to get response from AI");
      }
      
      return JSON.parse(result) as ProfileAnalysis;
    } catch (error) {
      console.error("Error aggregating analyses:", error);
      throw error;
    }
  }

  private createAggregatorUserPrompt(analyses: ProfileAnalysis[]): string {
    return `Analizza e sintetizza le seguenti valutazioni di un profilo professionale:
${JSON.stringify(analyses, null, 2)}

Crea:
1. Una descrizione riassuntiva che integri le osservazioni più significative
2. Un elenco di PRO consolidato dai punti di forza più rilevanti
3. Un elenco di CONTRO consolidato dalle criticità più importanti

Considera in particolare:
- Le osservazioni che compaiono in più valutazioni
- I punti di forza e le criticità più convincenti e ben argomentati
- La coerenza tra le diverse valutazioni
- L'oggettività e il bilanciamento della sintesi finale

Fornisci una valutazione finale equilibrata e ben ponderata.`;
  }
} 