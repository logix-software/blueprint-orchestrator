import { TranslatorAgent, Ingredient as Skill } from './translator-agent.ts';
import { ClassificatorAgent, Preference, ClassificationResult } from './classificator-agent.ts';
import { ProfileAnalyzerAgent, ProfileAnalysis } from './profile-analyzer-agent.ts';
import { AggregatorAgent } from './aggregator-agent.ts';

/**
 * Classe Orchestrator che coordina gli agenti specializzati
 */
export class Orchestrator {
  private translatorAgent: TranslatorAgent;
  private classificatorAgent: ClassificatorAgent;
  private profileAnalyzerAgent: ProfileAnalyzerAgent;
  private aggregatorAgent: AggregatorAgent;
  
  constructor(private apiKey?: string) {
    // Inizializza gli agenti specializzati
    this.translatorAgent = new TranslatorAgent(apiKey);
    this.classificatorAgent = new ClassificatorAgent(apiKey);
    this.profileAnalyzerAgent = new ProfileAnalyzerAgent(apiKey);
    this.aggregatorAgent = new AggregatorAgent(apiKey);
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

  /**
   * Analizza un profilo professionale utilizzando più agenti in parallelo
   */
  async analyzeProfile(
    classificationResult: ClassificationResult,
    preferences: Preference[]
  ): Promise<ProfileAnalysis> {
    console.log("Orchestrator: Inizializzando l'analisi del profilo");
    
    try {
      // Creo 3 istanze parallele di analisi
      const analysisPromises = Array(3).fill(null).map(() => 
        this.profileAnalyzerAgent.analyzeProfile(classificationResult, preferences)
      );
      
      // Attendo il completamento di tutte le analisi
      console.log("Orchestrator: Attendendo i risultati delle analisi parallele");
      const analyses = await Promise.all(analysisPromises);
      
      // Aggrego i risultati
      console.log("Orchestrator: Aggregando i risultati delle analisi");
      const finalAnalysis = await this.aggregatorAgent.aggregateAnalyses(analyses);
      
      console.log("Orchestrator: Analisi del profilo completata con successo");
      return finalAnalysis;
    } catch (error) {
      console.error("Orchestrator: Errore durante l'analisi del profilo:", error);
      throw error;
    }
  }
} 