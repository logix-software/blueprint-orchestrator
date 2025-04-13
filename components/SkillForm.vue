<template>
  <div class="form-container">
    <div class="form-header">
      <h2 class="form-title">Analisi Competenze</h2>
      <p class="form-subtitle">Inserisci le competenze professionali da analizzare</p>
    </div>

    <div class="input-container">
      <label for="skills">Competenze (separate da virgole)</label>
      <div class="textarea-wrapper">
        <textarea 
          id="skills"
          v-model="store.rawSkills"
          placeholder="Es: JavaScript, Leadership, Cloud Computing, Machine Learning, Comunicazione efficace..."
          @input="store.parseSkills()"
          rows="4"
        ></textarea>
      </div>
    </div>

    <div v-if="store.error" class="error-message">
      <i class="fas fa-exclamation-circle"></i>
      {{ store.error }}
    </div>

    <div v-if="store.skills.length > 0" class="preview-container">
      <div class="preview-header">
        <h3>
          <i class="fas fa-tags"></i>
          Competenze rilevate ({{ store.skills.length }})
        </h3>
      </div>
      <div class="skills-preview">
        <div 
          v-for="(skill, index) in store.skills" 
          :key="index"
          class="skill-tag"
        >
          {{ skill.text }}
          <span class="remove-tag" @click="removeSkill(index)">×</span>
        </div>
      </div>
    </div>

    <div class="actions-container">
      <button 
        type="button" 
        class="btn primary-btn" 
        @click="analyze"
        :disabled="!canAnalyze"
      >
        <i class="fas fa-chart-pie" v-if="!store.isLoading"></i>
        <i class="fas fa-spinner fa-spin" v-else></i>
        <span v-if="!store.isLoading">Analizza competenze</span>
        <span v-else>Analisi in corso...</span>
      </button>
      
      <button 
        type="button" 
        class="btn secondary-btn" 
        @click="store.resetAll()"
      >
        <i class="fas fa-trash-alt"></i>
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
.form-container {
  background-color: var(--background-color);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-color);
  padding: var(--spacing-xl);
  box-shadow: var(--box-shadow);
  max-width: 800px;
  margin: 0 auto;
}

.form-header {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.form-title {
  margin: 0 0 var(--spacing-xs);
  color: var(--primary-color);
  font-size: 24px;
}

.form-subtitle {
  margin: 0;
  color: var(--text-color-light);
  font-size: 16px;
}

.input-container {
  margin-bottom: var(--spacing-lg);
}

.input-container label {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: 500;
  color: var(--text-color);
}

.textarea-wrapper {
  position: relative;
}

textarea {
  width: 100%;
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: var(--secondary-background);
  font-size: 16px;
  resize: vertical;
  min-height: 120px;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.1);
}

.preview-container {
  background-color: var(--secondary-background);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-lg);
  overflow: hidden;
}

.preview-header {
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
}

.preview-header h3 {
  margin: 0;
  font-size: 16px;
  display: flex;
  align-items: center;
  color: var(--text-color);
}

.preview-header h3 i {
  margin-right: var(--spacing-sm);
  color: var(--primary-color);
}

.skills-preview {
  padding: var(--spacing-md);
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.skill-tag {
  display: inline-flex;
  align-items: center;
  background-color: var(--background-color);
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  border: 1px solid var(--border-color);
  transition: all var(--transition-fast);
}

.skill-tag:hover {
  background-color: var(--primary-color-light);
  border-color: var(--primary-color);
}

.remove-tag {
  margin-left: 8px;
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity var(--transition-fast);
}

.remove-tag:hover {
  opacity: 1;
  color: var(--error-color);
}

.actions-container {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 10px 18px;
  border-radius: var(--border-radius);
  font-size: 15px;
  cursor: pointer;
  transition: all var(--transition-fast);
  border: none;
}

.btn i {
  margin-right: 8px;
  font-size: 16px;
}

.primary-btn {
  background-color: var(--primary-color);
  color: white;
}

.primary-btn:hover:not(:disabled) {
  background-color: var(--primary-color-dark);
  transform: translateY(-1px);
}

.primary-btn:disabled {
  background-color: #bdbdbd;
  cursor: not-allowed;
}

.secondary-btn {
  background-color: var(--secondary-background);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.secondary-btn:hover {
  background-color: #f0f0f0;
}

@media (max-width: 768px) {
  .form-container {
    padding: var(--spacing-md);
  }
  
  .actions-container {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style> 