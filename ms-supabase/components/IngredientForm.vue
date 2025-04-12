<template>
  <div class="form-section">
    <h2>Inserisci le skill</h2>
    <div class="form-group">
      <label for="skills">Skill (separate da virgole)</label>
      <textarea 
        id="skills"
        v-model="store.rawSkills"
        placeholder="Inserisci le skill separate da virgole, es: acqua, zucchero, sale"
        @input="store.parseSkills()"
        rows="4"
      ></textarea>
    </div>

    <div v-if="store.error" class="error-message">
      <i class="fas fa-exclamation-circle"></i>
      {{ store.error }}
    </div>

    <div v-if="store.skills.length > 0" class="skills-preview">
      <h3>Anteprima skill ({{ store.skills.length }})</h3>
      <ul class="skills-list">
        <li v-for="(skill, index) in store.skills" :key="index">
          {{ skill.text }}
        </li>
      </ul>
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
</script>

<style scoped>
.skills-preview {
  margin: 15px 0;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: var(--border-radius);
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
  padding: 0;
  margin-top: 10px;
}

.skills-list li {
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 4px 10px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
</style> 