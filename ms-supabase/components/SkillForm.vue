<template>
  <div class="form-section">
    <h2 class="section-title">Inserisci le skill</h2>
    <div class="form-group">
      <label for="skills">Inserisci le skill professionali separate da virgole</label>
      <div class="input-wrapper">
        <textarea 
          id="skills"
          v-model="store.rawSkills"
          placeholder="Esempio: JavaScript, Leadership, Docker, Python, Comunicazione efficace, Machine Learning"
          @input="store.parseSkills()"
          rows="4"
        ></textarea>
      </div>
    </div>

    <div v-if="store.error" class="error-message">
      <i class="fas fa-exclamation-circle"></i>
      {{ store.error }}
    </div>

    <div v-if="store.skills.length > 0" class="skills-preview">
      <h3>Anteprima skill ({{ store.skills.length }})</h3>
      <div class="skills-list">
        <div 
          v-for="(skill, index) in store.skills" 
          :key="index"
          class="skill-tag"
        >
          {{ skill.text }}
          <span class="remove-skill" @click="removeSkill(index)">×</span>
        </div>
      </div>
    </div>

    <div class="form-actions">
      <button 
        type="button" 
        class="btn primary-btn" 
        @click="analyze"
        :disabled="!canAnalyze"
      >
        <span v-if="!store.isLoading">Analizza</span>
        <span v-else>
          <i class="fas fa-spinner fa-spin"></i> Analisi in corso...
        </span>
      </button>
      
      <button 
        type="button" 
        class="btn secondary-btn" 
        @click="store.resetAll()"
      >
        Pulisci
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAnalyzerStore } from '~/stores/analyzer';

const store = useAnalyzerStore();

const canAnalyze = computed(() => {
  return store.skills.length > 0 && !store.isLoading;
});

function analyze() {
  store.analyzeSkill();
}

function removeSkill(index: number) {
  store.skills.splice(index, 1);
  // Aggiorna il testo raw dopo la rimozione di una skill
  store.rawSkills = store.skills.map(skill => skill.text).join(', ');
}
</script>

<style scoped>
.section-title {
  text-align: center;
  color: var(--primary-color);
  margin-bottom: 25px;
  font-size: 1.8rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  text-align: center;
}

.input-wrapper {
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
}

textarea {
  width: 100%;
  padding: 15px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s, box-shadow 0.3s;
  resize: vertical;
  min-height: 120px;
  background-color: #f9f9f9;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
}

textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.2);
}

.skills-preview {
  margin: 25px auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  max-width: 700px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.skills-preview h3 {
  text-align: center;
  margin-bottom: 15px;
  font-size: 1.2rem;
  color: #555;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.skill-tag {
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.skill-tag:hover {
  background-color: #f0f8ff;
  border-color: var(--primary-color);
}

.remove-skill {
  margin-left: 6px;
  color: #999;
  font-weight: bold;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
}

.remove-skill:hover {
  color: #ff5252;
}

.error-message {
  padding: 12px;
  background-color: #ffebee;
  color: #d32f2f;
  border-radius: 4px;
  margin: 15px auto;
  max-width: 700px;
  display: flex;
  align-items: center;
}

.error-message i {
  margin-right: 8px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 25px;
  justify-content: center;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.primary-btn {
  background-color: var(--primary-color);
  color: white;
}

.primary-btn:hover:not(:disabled) {
  background-color: var(--primary-color-dark);
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.primary-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.secondary-btn {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid var(--border-color);
}

.secondary-btn:hover {
  background-color: #e5e5e5;
}
</style> 