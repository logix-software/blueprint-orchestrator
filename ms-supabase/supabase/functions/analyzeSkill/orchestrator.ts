import { TranslatorAgent, Ingredient as Skill } from './translator-agent.ts';
import { ClassificatorAgent, Preference, ClassificationResult } from './classificator-agent.ts';

/**
 * Classe Orchestrator che coordina gli agenti specializzati
 */
export class Orchestrator {
  private translatorAgent: TranslatorAgent;
  private classificatorAgent: ClassificatorAgent;
  
  constructor(private apiKey?: string) {
    // Inizializza gli agenti specializzati
    this.translatorAgent = new TranslatorAgent(apiKey);
    this.classificatorAgent = new ClassificatorAgent(apiKey);
  }

  /**
   * Analizza le skill rispetto alle preferenze dell'utente
   */
  async analyzeSkill(
    skills: Skill[],
    preferences: Preference[],
    baseSkills: string[]
  ): Promise<ClassificationResult> {
    console.log("Orchestrator: Inizializzando il processo di analisi");
    
    try {
      // Step 1: Traduci le skill in italiano se necessario
      console.log("Orchestrator: Richiedendo la traduzione delle skill");
      const translatedSkills = await this.translatorAgent.translateToItalian(skills);
      
      // Salva un mapping delle skill originali con la loro traduzione per logging
      const skillTranslations: Record<string, string> = {};
      skills.forEach((skill, index) => {
        if (index < translatedSkills.length) {
          const originalText = skill.text?.toLowerCase() || '';
          const translatedText = translatedSkills[index].text?.toLowerCase() || '';
          
          if (originalText && translatedText && originalText !== translatedText) {
            skillTranslations[originalText] = translatedText;
            console.log(`Traduzione: "${originalText}" -> "${translatedText}"`);
          }
        }
      });
      
      // Step 2: Analizza le skill tradotte
      console.log("Orchestrator: Richiedendo l'analisi delle skill");
      const analysisResult = await this.classificatorAgent.analyzeSkills(
        translatedSkills,
        preferences,
        baseSkills
      );
      
      console.log("Orchestrator: Analisi completata con successo");
      return analysisResult;
    } catch (error) {
      console.error("Orchestrator: Errore durante il processo di orchestrazione:", error);
      throw error;
    }
  }
} 