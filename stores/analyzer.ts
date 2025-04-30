import { defineStore } from 'pinia';
import { useRuntimeConfig } from '#app';
import type { Skill, Preference, ClassificationResult, ProfileAnalysis } from '~/types';
import { samplePreferences } from '~/types';

export const useAnalyzerStore = defineStore('analyzer', {
  state: () => ({
    skills: [] as Skill[],
    preferences: [
      {
        category: "Essenziali",
        sub_category: "Linguaggi di Programmazione",
        items: ["JavaScript", "TypeScript", "Python", "Java"]
      },
      {
        category: "Avanzate",
        sub_category: "DevOps e Cloud",
        items: ["Docker", "Kubernetes", "CI/CD", "AWS", "Azure", "Google Cloud"]
      },
      {
        category: "Trasversali",
        sub_category: "Soft Skills",
        items: ["Leadership", "Lavoro di squadra", "Problem Solving", "Comunicazione efficace"]
      },
      {
        category: "Emergenti",
        sub_category: "Tecnologie Innovative",
        items: ["Blockchain", "Web3", "Machine Learning", "Edge Computing", "Quantum Computing"]
      }
    ] as Preference[],
    result: null as ClassificationResult | null,
    profileAnalysis: null as ProfileAnalysis | null,
    isLoading: false,
    error: null as string | null,
    rawSkills: '',
  }),

  actions: {
    async analyzeSkill() {
      if (!this.skills.length) {
        this.error = 'Inserisci almeno una skill';
        return;
      }

      this.isLoading = true;
      this.error = null;
      this.result = null;
      this.profileAnalysis = null;

      try {
        const runtimeConfig = useRuntimeConfig();
        const apiUrl = `${runtimeConfig.public.apiUrl}/analyzeSkill`;
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            skills: this.skills,
            preferences: this.preferences,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Errore durante l\'analisi delle skill');
        }

        this.result = await response.json();
        
        // Se l'analisi delle skill è andata a buon fine, procedo con l'analisi del profilo
        if (this.result) {
          await this.analyzeProfile();
        }
      } catch (error: any) {
        this.error = error.message || 'Si è verificato un errore durante l\'analisi';
        console.error('Errore durante l\'analisi:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async analyzeProfile() {
      if (!this.result) {
        this.error = 'Nessun risultato di classificazione disponibile';
        return;
      }

      try {
        const runtimeConfig = useRuntimeConfig();
        const apiUrl = `${runtimeConfig.public.apiUrl}/analyzeProfile`;
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            classificationResult: this.result,
            preferences: this.preferences,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Errore durante l\'analisi del profilo');
        }

        this.profileAnalysis = await response.json();
      } catch (error: any) {
        this.error = error.message || 'Si è verificato un errore durante l\'analisi del profilo';
        console.error('Errore durante l\'analisi del profilo:', error);
      }
    },

    parseSkills() {
      if (!this.rawSkills.trim()) {
        this.skills = [];
        return;
      }
      
      // Dividiamo le skill per virgola
      const skillArray = this.rawSkills
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);
      
      // Creiamo oggetti Skill
      this.skills = skillArray.map(text => ({ text }));
    },

    clearResults() {
      this.result = null;
      this.error = null;
    },

    resetAll() {
      this.rawSkills = '';
      this.skills = [];
      this.result = null;
      this.error = null;
    }
  }
}); 