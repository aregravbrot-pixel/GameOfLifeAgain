---
tema: ""
---

# Felles rapportmal

> **Til gruppen:** Velg tema og eksperiment fra filene i `/eksperimenter`. Fyll ut alle seksjoner. 

---

## Rapportmal

### 1. Gruppeinformasjon

| Felt | Verdi                                 |
|---|---------------------------------------|
| Gruppenummer | *1_4*                                 |
| Deltakere | *Are, Andre, Eirik, Roy*              |
| Tema | *Tema 1 – Utvikler + agent i praksis* |
| Dato(er) for eksperiment | *2026-4-24*                           |
| Verktøy/modeller brukt | Claude code                           |
| Repo / kodebase / case brukt |  https://github.com/aregravbrot-pixel/GameOfLifeAgain.git         |

---

### 2. Valgt problemstilling

**Forskningsspørsmål:**
Vi vil bare leke. I førsteomgang ser vi hvor godt AI'en gjør oppgaver praktisk talt uten noen 
instruksjoner eller begrenssninger. Deretter legger vi inn flere føringer for å se hvordan dette
påvirker arbeidet. 

**Hypotese:**
Vi tror at AI'en vil kunne løse oppgaver på en tilfredsstillende måte selv uten instruksjoner.
Vi tror at innføring av stadig flere regler og begrensninger gjør at oppgaver går saktere og mer omstendelig, 
men at vi som utviklere får mer kontroll over hva som lages og hvordan. 

---

### 3. Eksperimentoppsett

#### Hva ble testet

##### Eksperiment 1: Lav detaljeringsgrad
Første oppgave: "lag game of life". Ingen videre regler. 
claude-code løste oppgaven på 3 minutter, og resultatet var en fungerende implementasjon av game of life i python.

Andre oppgave: utvid game-of-life med flere valgfrie utgangspunkter. 
Tok minst dobbelt så lang tid som å lage den første løsningen. 

Funn: lav detaljeringsgrad førte til at det ble lagt til ekstra features mer enn bare de vi ba om. 
Tok hensyn til eksisterende kodebase, oig utvidet den tilsynelatende korrekt,
(basert på enkel manuell testing siden vi ikke har noen enhetstester bestilt eller laget.)




*(Beskriv oppgaven, featuren, arbeidsflyten eller caset som ble undersøkt)*

#### Betingelser
*(Minst to betingelser for sammenligning dersom det passer for eksperimentet)*

| Betingelse | Beskrivelse |
|---|---|
| A - Baseline | *(beskriv)* |
| B - Variant | *(beskriv)* |

#### Målemetoder
*(Hvordan vurderte dere resultater? Tidsbruk, kvalitet, antall feil, brukbarhet, læring, o.l.)*

---

### 4. Resultater

*(Presenter funn med tabeller, eksempler eller sitater der det er nyttig)*

---

### 5. Diskusjon

#### Hva funket

#### Hva funket ikke

#### Begrensninger

---

### 6. Konklusjon

*(1-3 setninger: hva er det viktigste dere lærte?)*

---
