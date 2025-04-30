<template>
  <div v-if="store.profileAnalysis" class="profile-analysis-container fade-in">
    <div class="analysis-card">
      <div class="analysis-header">
        <i class="fas fa-user-check"></i>
        <h3>Analisi del Profilo</h3>
      </div>
      
      <div class="analysis-content">
        <div class="description-section">
          <h4>Descrizione Riassuntiva</h4>
          <p>{{ store.profileAnalysis.descrizione }}</p>
        </div>

        <div class="evaluation-grid">
          <div class="pro-section">
            <h4>
              <i class="fas fa-plus-circle"></i>
              Punti di Forza
            </h4>
            <ul>
              <li v-for="(pro, idx) in store.profileAnalysis.pro" :key="idx">
                {{ pro }}
              </li>
            </ul>
          </div>

          <div class="contro-section">
            <h4>
              <i class="fas fa-minus-circle"></i>
              Criticità
            </h4>
            <ul>
              <li v-for="(contro, idx) in store.profileAnalysis.contro" :key="idx">
                {{ contro }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAnalyzerStore } from '~/stores/analyzer';

const store = useAnalyzerStore();
</script>

<style scoped>
.profile-analysis-container {
  margin-top: var(--spacing-xl);
}

.analysis-card {
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--box-shadow);
}

.analysis-header {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  background-color: var(--secondary-background);
}

.analysis-header i {
  font-size: 20px;
  margin-right: var(--spacing-md);
  color: var(--primary-color);
}

.analysis-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.analysis-content {
  padding: var(--spacing-lg);
}

.description-section {
  margin-bottom: var(--spacing-lg);
}

.description-section h4 {
  margin: 0 0 var(--spacing-md);
  color: var(--text-color);
  font-size: 16px;
  font-weight: 600;
}

.description-section p {
  margin: 0;
  line-height: 1.6;
  color: var(--text-color);
}

.evaluation-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
}

@media (max-width: 768px) {
  .evaluation-grid {
    grid-template-columns: 1fr;
  }
}

.pro-section h4,
.contro-section h4 {
  display: flex;
  align-items: center;
  margin: 0 0 var(--spacing-md);
  font-size: 16px;
  font-weight: 600;
}

.pro-section h4 i,
.contro-section h4 i {
  margin-right: var(--spacing-sm);
}

.pro-section h4 {
  color: #2ecc71;
}

.contro-section h4 {
  color: #e74c3c;
}

.pro-section h4 i {
  color: #2ecc71;
}

.contro-section h4 i {
  color: #e74c3c;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  padding: var(--spacing-sm) var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  border-radius: var(--border-radius);
  font-size: 14px;
  line-height: 1.4;
}

.pro-section li {
  background-color: rgba(46, 204, 113, 0.1);
  border: 1px solid rgba(46, 204, 113, 0.2);
}

.contro-section li {
  background-color: rgba(231, 76, 60, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.2);
}

.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 