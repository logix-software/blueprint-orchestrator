export interface Skill {
  text?: string;
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

export interface Preference {
  category: string;
  sub_category: string;
  items: string[];
  food_type?: string;
}

export interface ClassificationResult {
  categorizedSkills: {
    essenziali: string[];    // Competenze fondamentali richieste per il ruolo
    avanzate: string[];      // Competenze specialistiche e tecniche di alto livello
    trasversali: string[];   // Soft skills e competenze cross-funzionali
    emergenti: string[];     // Competenze nuove o in crescita nel settore
  };
}

// Per retrocompatibilità
export interface NutritionAnalysisResult {
  categorizedIngredients: {
    sensibili: string[];
    consigliati: string[];
    sconsigliati: string[];
    tollerati: string[];
  };
}

// Preferenze di esempio per il testing
export const samplePreferences: Preference[] = [
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
]; 