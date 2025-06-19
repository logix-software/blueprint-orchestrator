# Blueprint Orchestrator: Analizzatore di Skill

Una soluzione avanzata basata su Nuxt 3 e Supabase Edge Functions per analizzare e categorizzare skill professionali in base a preferenze aziendali. Utilizzabile come blueprint per diversi casi d'uso di categorizzazione basata su AI.

## Caratteristiche Principali

- 🧠 **Analisi AI-powered**: Utilizza OpenAI per categorizzare automaticamente le skill
- 🌐 **Traduzione automatica**: Rileva e traduce in italiano skill in lingue diverse
- 📊 **Categorizzazione intelligente**: Classifica le skill in categorie rilevanti per il business
- 🎨 **UI intuitiva**: Interfaccia moderna e reattiva per un'esperienza utente ottimale
- 🧩 **Design modulare**: Facilmente adattabile per categorizzare altri elementi (ingredienti, prodotti, ecc.)

## Categorie delle Skill

L'analizzatore classifica le skill in quattro categorie:

- **Essenziali**: Competenze fondamentali richieste per il ruolo
- **Avanzate**: Competenze specialistiche e tecniche di alto livello
- **Trasversali**: Soft skills e competenze cross-funzionali
- **Emergenti**: Competenze nuove o in crescita nel settore

## Prerequisiti

- Node.js 16 o superiore
- Supabase CLI ([istruzioni di installazione](https://supabase.com/docs/guides/cli/getting-started))
- Account Supabase (gratuito per lo sviluppo)
- Chiave API di OpenAI

## Configurazione e Installazione

### 1. Configurazione del progetto Supabase

1. Crea un nuovo progetto su [Supabase](https://supabase.com)
2. Prendi nota dell'URL del progetto e della chiave API (anon/public)
3. Configura la variabile d'ambiente segreta per OpenAI:
   ```bash
   supabase secrets set OPENAI_API_KEY=sk-tuaChiaveOpenAI
   ```

### 2. Clonazione e installazione delle dipendenze

```bash
# Clona il repository
git clone https://github.com/logix-software/blueprint-orchestrator.git
cd blueprint-orchestrator/ms-supabase

# Installa le dipendenze
npm install
```

### 3. Configurazione delle variabili d'ambiente

Crea un file `.env` nella radice del progetto:

```
NUXT_PUBLIC_API_URL=https://tuo-progetto.supabase.co
```

### 4. Avvio in modalità sviluppo

```bash
# Esegui il frontend in modalità sviluppo
npm run dev
```

L'applicazione sarà disponibile su http://localhost:3000.

### 5. Pubblicazione della Edge Function su Supabase

Per utilizzare l'applicazione con la funzione deployata su Supabase Cloud:

```bash
# Accedi all'account Supabase (se non l'hai già fatto)
supabase login

# Collega il progetto locale al tuo progetto Supabase
supabase link --project-ref tua-project-ref

# Configura la chiave API OpenAI nel cloud
supabase secrets set OPENAI_API_KEY=sk-tuaChiaveOpenAI

# Pubblica la funzione sul cloud Supabase
supabase functions deploy analyzeSkill --no-verify-jwt
```

Una volta deployata, la funzione sarà disponibile all'URL: 
`https://tuo-progetto.supabase.co/functions/v1/analyzeSkill`

> **Nota**: Modifica il file `.env` per utilizzare l'URL della funzione deployata:
> ```
> NUXT_PUBLIC_API_URL=https://tuo-progetto.supabase.co
> ```

## Personalizzazione delle Preferenze Aziendali

Le preferenze aziendali definiscono quali skill vengono classificate nelle diverse categorie. Puoi personalizzarle modificando il file `/types/index.ts`:

```typescript
// Modifica queste preferenze in base alle tue esigenze aziendali
export const samplePreferences: Preference[] = [
  {
    category: "Essenziali",
    sub_category: "Linguaggi di Programmazione",
    items: ["JavaScript", "TypeScript", "Python", "Java"]
  },
  {
    category: "Avanzate", 
    sub_category: "DevOps e Cloud",
    items: ["Docker", "Kubernetes", "CI/CD", "AWS", "Azure"]
  },
  // Aggiungi o modifica altre categorie e competenze...
];
```

### Aggiungere Nuove Skill di Base

Le skill di base sono competenze che vengono sempre considerate essenziali. Puoi modificarle nel file `/supabase/functions/analyzeSkill/index.ts`:

```typescript
// Modifica questa lista per cambiare le skill di base
const baseSkills = ["comunicazione", "problem solving", "lavoro di squadra", "pensiero critico"];
```

## Deployment in Produzione

### 1. Preparazione del progetto Supabase

Prima di procedere con il deployment in produzione, assicurati di:

1. Avere un progetto Supabase attivo
2. Aver configurato la chiave API OpenAI nelle variabili d'ambiente
3. Avere i permessi necessari per il deployment delle functions

### 2. Pubblicazione della Edge Function

```bash
# Accedi a Supabase CLI (se non l'hai già fatto)
supabase login

# Collega il progetto locale al tuo progetto Supabase
supabase link --project-ref tua-project-ref

# Pubblica la Edge Function
supabase functions deploy analyzeSkill --no-verify-jwt
```

> **Nota**: Usa il flag `--no-verify-jwt` per permettere alle funzioni di essere chiamate senza autenticazione. In un ambiente di produzione, valuta se richiedere l'autenticazione per maggiore sicurezza.

### 3. Verifica del deployment

Puoi verificare che la function sia stata correttamente deployata usando:

```bash
supabase functions list

# Testa la funzione con un payload di esempio
curl -X POST https://tuo-progetto.supabase.co/functions/v1/analyzeSkill \
  -H "Content-Type: application/json" \
  -d '{"ingredients":["JavaScript", "Python"], "preferences":[...]}'
```

### 4. Compilazione e pubblicazione del frontend

```bash
# Configura l'URL corretto nel file .env
echo "NUXT_PUBLIC_API_URL=https://tuo-progetto.supabase.co" > .env

# Compila l'applicazione
npm run build

# Pubblica la cartella generata
# La cartella .output/public può essere pubblicata su servizi come Vercel, Netlify, ecc.
```

## Estensione per Altri Casi d'Uso

Questo blueprint può essere facilmente adattato per altri casi d'uso di categorizzazione:

1. Modifica le interfacce in `/types/index.ts` per il tuo dominio
2. Aggiorna i prompt degli agenti in `/supabase/functions/analyzeSkill/classificator-agent.ts`
3. Personalizza i componenti UI in `/components/`

Esempi di possibili adattamenti:
- Analizzatore di ingredienti alimentari per diete specifiche
- Classificatore di prodotti per e-commerce
- Valutatore di testi per diverse fasce di pubblico

## Risoluzione dei Problemi

### Errori API OpenAI

Assicurati che la chiave API OpenAI sia configurata correttamente nelle variabili d'ambiente di Supabase. 

### CORS e Errori di Connessione

Per problemi di CORS durante lo sviluppo locale, verifica che i domini siano configurati correttamente nelle impostazioni di Supabase.

## Nota Importante

Questo progetto utilizza l'API di OpenAI, che comporta costi in base all'utilizzo. Monitora l'utilizzo per evitare spese impreviste.

## Licenza

[MIT](LICENSE)

## Utilizzo dell'API

La Edge Function `analyzeSkill` accetta richieste POST con un payload JSON nel seguente formato:

```json
{
  "skills": [
    {"text": "JavaScript"},
    {"text": "Leadership"},
    {"text": "Docker"}
  ],
  "preferences": [
    {
      "category": "Essenziali",
      "sub_category": "Linguaggi di Programmazione",
      "items": ["JavaScript", "TypeScript"]
    },
    {
      "category": "Avanzate",
      "sub_category": "DevOps",
      "items": ["Docker", "Kubernetes"]
    }
  ]
}
```

I parametri accettati sono:
- `skills`: Array di oggetti con proprietà `text` contenente le competenze da analizzare
- `preferences`: Array di oggetti di preferenza che definiscono le categorie per classificare le skill

La risposta sarà un oggetto JSON con le skill categorizzate:

```json
{
  "categorizedSkills": {
    "essenziali": ["JavaScript"],
    "avanzate": ["Docker"],
    "trasversali": ["Leadership"],
    "emergenti": []
  }
}
```

## Architettura del Sistema

Il sistema è composto da diversi agenti specializzati coordinati da un orchestratore centrale:

### 1. Orchestratore (`Orchestrator`)
L'orchestratore è il componente centrale che coordina tutti gli agenti specializzati. Gestisce il flusso di lavoro completo dall'input alla generazione del risultato finale.

```typescript
class Orchestrator {
  private translatorAgent: TranslatorAgent;
  private classificatorAgent: ClassificatorAgent;
  private profileAnalyzerAgent: ProfileAnalyzerAgent;
  private aggregatorAgent: AggregatorAgent;
}
```

### 2. Pipeline di Analisi delle Skill

#### 2.1 Traduzione (`TranslatorAgent`)
- Converte le skill in italiano se necessario
- Mantiene un mapping delle traduzioni per riferimento
- Garantisce consistenza linguistica

#### 2.2 Classificazione (`ClassificatorAgent`)
- Categorizza le skill in:
  - Essenziali
  - Avanzate
  - Trasversali
  - Emergenti
- Utilizza le preferenze del recruiter come riferimento
- Considera le skill di base sempre come essenziali

### 3. Pipeline di Analisi del Profilo

#### 3.1 Analisi Parallela
L'orchestratore implementa un approccio di analisi parallela per ottenere una valutazione più robusta e obiettiva:

```typescript
async analyzeProfile(
  classificationResult: ClassificationResult,
  preferences: Preference[]
): Promise<ProfileAnalysis> {
  // Crea 3 istanze parallele di analisi
  const analysisPromises = Array(3).fill(null).map(() => 
    this.profileAnalyzerAgent.analyzeProfile(classificationResult, preferences)
  );
  
  // Attende il completamento di tutte le analisi
  const analyses = await Promise.all(analysisPromises);
  
  // Aggrega i risultati
  return await this.aggregatorAgent.aggregateAnalyses(analyses);
}
```

#### 3.2 Agenti di Analisi del Profilo (`ProfileAnalyzerAgent`)
Ogni agente di analisi del profilo:
- Valuta il match tra competenze e preferenze
- Analizza il bilanciamento tra competenze tecniche e soft skill
- Identifica punti di forza e criticità
- Genera una descrizione riassuntiva

#### 3.3 Aggregazione dei Risultati (`AggregatorAgent`)
L'aggregatore:
- Combina le analisi parallele
- Risolve eventuali discrepanze
- Produce un'analisi finale consolidata
- Garantisce consistenza e completezza

### 4. Struttura dei Risultati

#### 4.1 Risultato della Classificazione
```typescript
interface ClassificationResult {
  categorizedSkills: {
    essenziali: string[];
    avanzate: string[];
    trasversali: string[];
    emergenti: string[];
  };
}
```

#### 4.2 Analisi del Profilo
```typescript
interface ProfileAnalysis {
  descrizione: string;    // Descrizione riassuntiva del profilo
  pro: string[];         // Punti di forza identificati
  contro: string[];      // Criticità o aree di miglioramento
}
```

## Utilizzo del Sistema

### 1. Analisi delle Skill
```typescript
const orchestrator = new Orchestrator();
const result = await orchestrator.analyzeSkill(
  skills,           // Array di skill da analizzare
  preferences,      // Preferenze del recruiter
  baseSkills        // Skill considerate sempre essenziali
);
```

### 2. Analisi del Profilo
```typescript
const profileAnalysis = await orchestrator.analyzeProfile(
  classificationResult,  // Risultato della classificazione
  preferences           // Preferenze del recruiter
);
```

## Edge Functions Supabase

Il sistema è implementato come Edge Functions su Supabase:

### analyzeSkill
```typescript
serve(async (req: Request) => {
  const { skills, preferences, baseSkills } = await req.json();
  const orchestrator = new Orchestrator();
  const result = await orchestrator.analyzeSkill(
    skills,
    preferences,
    baseSkills
  );
  return new Response(JSON.stringify(result));
});
```

### analyzeProfile
```typescript
serve(async (req: Request) => {
  const { classificationResult, preferences } = await req.json();
  const orchestrator = new Orchestrator();
  const result = await orchestrator.analyzeProfile(
    classificationResult,
    preferences
  );
  return new Response(JSON.stringify(result));
});
```

## Deployment

### 1. Deploy delle Edge Functions
```bash
# Deploy senza autenticazione JWT
supabase functions deploy analyzeSkill --no-verify-jwt
supabase functions deploy analyzeProfile --no-verify-jwt
```

### 2. Configurazione Frontend
```env
NUXT_PUBLIC_API_URL=https://[PROJECT_ID].functions.supabase.co
```

## Best Practices

1. **Robustezza**
   - Analisi parallela per ridurre bias
   - Aggregazione intelligente dei risultati
   - Gestione degli errori a ogni livello

2. **Scalabilità**
   - Architettura modulare
   - Agenti indipendenti e specializzati
   - Facile aggiunta di nuovi agenti

3. **Manutenibilità**
   - Separazione delle responsabilità
   - Interfacce ben definite
   - Logging completo

## Estensibilità

Il sistema può essere esteso in vari modi:

1. **Nuovi Agenti**
   - Agenti per analisi specifiche di settore
   - Agenti per valutazioni comparative
   - Agenti per previsioni di crescita

2. **Nuove Funzionalità**
   - Analisi temporale dell'evoluzione delle skill
   - Suggerimenti per percorsi di crescita
   - Matching con posizioni aperte

3. **Integrazioni**
   - Sistemi di HR
   - Piattaforme di e-learning
   - Job boards

## Monitoraggio e Manutenzione

### Logging
Il sistema implementa un logging dettagliato a ogni livello:
```typescript
console.log("Orchestrator: Inizializzando il processo di analisi");
console.log("Orchestrator: Richiedendo la traduzione delle skill");
console.log("Orchestrator: Richiedendo l'analisi delle skill");
console.log("Orchestrator: Attendendo i risultati delle analisi parallele");
console.log("Orchestrator: Aggregando i risultati delle analisi");
```

### Gestione degli Errori
Ogni componente implementa una gestione degli errori robusta:
```typescript
try {
  // Logica del componente
} catch (error) {
  console.error("Errore durante l'elaborazione:", error);
  throw new Error("Descrizione dettagliata dell'errore");
}
``` 