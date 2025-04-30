<template>
  <div class="container">
    <header class="app-header">
      <h1>Analizzatore di Skill</h1>
      <p class="app-description">
        Inserisci le skill da analizzare in base alle preferenze aziendali
      </p>
    </header>

    <main class="app-content">
      <div class="content-grid">
        <div class="main-column">
          <SkillForm />
          <AnalysisResult />
          <ProfileAnalysis />
        </div>
        <div class="side-column">
          <PreferencesList />
        </div>
      </div>
    </main>

    <footer class="app-footer">
      <p>Creato per testare le funzioni Supabase Edge Function <code>analyzeSkill</code> e <code>analyzeProfile</code></p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#app';
import SkillForm from '~/components/SkillForm.vue';
import AnalysisResult from '~/components/AnalysisResult.vue';
import PreferencesList from '~/components/PreferencesList.vue';
import ProfileAnalysis from '~/components/ProfileAnalysis.vue';

useHead({
  title: 'Analizzatore Skill',
  meta: [
    { name: 'description', content: 'Applicazione per analizzare skill in base a preferenze aziendali' }
  ]
});
</script>

<style scoped>
.app-header {
  padding: 30px 0;
  text-align: center;
}

h1 {
  color: var(--primary-color);
  margin-bottom: 10px;
}

.app-description {
  font-size: 18px;
  color: #666;
}

.app-content {
  padding: 20px 0 40px;
}

.content-grid {
  display: grid;
  grid-template-columns: 70% 30%;
  gap: 25px;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .side-column {
    order: -1;
  }
}

.app-footer {
  margin-top: 40px;
  padding: 20px 0;
  text-align: center;
  border-top: 1px solid var(--border-color);
  color: #666;
}

code {
  background-color: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}
</style> 