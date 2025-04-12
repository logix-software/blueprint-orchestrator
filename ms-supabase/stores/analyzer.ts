import { defineStore } from 'pinia';
import type { Skill, Preference, ClassificationResult } from '~/types';
import { samplePreferences } from '~/types';

export const useAnalyzerStore = defineStore('analyzer', {
  state: () => ({
    skills: [] as Skill[],
    preferences: samplePreferences as Preference[],
    result: null as ClassificationResult | null,
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

      try {
        const runtimeConfig = useRuntimeConfig();
        const apiUrl = `${runtimeConfig.public.apiUrl}/functions/v1/analyzeSkill`;
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ingredients: this.skills,
            preferences: this.preferences,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Errore durante l\'analisi delle skill');
        }

        this.result = await response.json();
      } catch (error: any) {
        this.error = error.message || 'Si è verificato un errore durante l\'analisi';
        console.error('Errore durante l\'analisi:', error);
      } finally {
        this.isLoading = false;
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