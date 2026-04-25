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

##### Eksperiment A: Ingen retningslinjer
Første oppgave: "lag game of life". Ingen videre regler. 
claude-code løste oppgaven på 3 minutter, og resultatet var en fungerende implementasjon av game of life i python.

Andre oppgave: utvid game-of-life med flere valgfrie utgangspunkter. 
Tok minst dobbelt så lang tid som å lage den første løsningen. 

Funn: lav detaljeringsgrad førte til at det ble lagt til ekstra features mer enn bare de vi ba om. 
Tok hensyn til eksisterende kodebase, oig utvidet den tilsynelatende korrekt
(basert på enkel manuell testing siden vi ikke har noen enhetstester bestilt eller laget.)


##### Eksperiment B: Bytte programmeringsspråk
Ba Claude om å skrive om python implementasjonen til javascript + lage tester og oppdatere claude.md selv


Funn: Tok ca. 5-7 minutter. Lagde først en ren javascript versjon. Ba den så om å lage en webside. Brukte da ca 5 minuter til.
Webside fungerte utmerket. Testene ga 100% dekning i alle aspekter.

##### Eksperiment C: Høyere detaljeringsgrad:

Valgte en større oppgave: maxiyatzy, hvor man kan spille mot maskinen. 

Utvidet claude.md med regler om å lage skikkelige kravspesifikasjoner, 
for deretter å bryte spesifikasjoner ned i mindre implementeringsoppgaver. 
Til sist skal det gjøres testdrevet utvikling.

Funn:
Arbeid med claude-reglene tok opp mot 30 min. 
Prosessenn med å skrive spesifikasjoner i dialog med AI'en var tidkrevende, 
ca 2,5 timer.
Deretter kunne Claude implementere koden på egenhånd uten spørsmål.

Vi valgte å la AI'en skrive spesifikasjonene. Virket som en god ide først, 
siden 5 ulike sett av krav raskt ble identifisert og skrevet, men det viste seg at
de var inkonsistente og fulle av feilantakelser, så det gikk mye tid på å rette dem
i mange iterasjoner. 


#### Betingelser
*(Minst to betingelser for sammenligning dersom det passer for eksperimentet)*

| Betingelse | Beskrivelse                                                                                                 |
|---|-------------------------------------------------------------------------------------------------------------|
| A - Baseline | AI uten noen retningslinjer eller regler                                                                    |
| B - Variant | AI med arbeidsprosess-regler i claude.md, fanginging av eksplisitte krav og implementasjonsoppgaver i filer |

#### Målemetoder
Vi målte først og fremst tidsbruk.  Kvaliteten ble bare vurdert ved å se om appliakasjonen
tilsynelatende fungerte. 

---

### 4. Resultater

Har laget GameOfLife implementert i python, GameOfLife implementert i javascript, 
samt maxiyatzy laget i javascript. 

Den siste fungerte ikke helt, men antakelig nesten. Hadde trengt en iterasjon for å 
få ting til å skje når man klikker. 

---

### 5. Diskusjon

#### Hva funket
Lage spesifikasjoner for krav, samt oppgavenedbryting for implementasjon funket bra.
Be claude implementere en og en task, og committe og pushe underveis funket bra.

#### Hva funket ikke
Små initielle misforståelser eskalerte ganske fort når Claude skrev spesifikasjonene. 
Ble tidkrevende å rydde opp i.

#### Begrensninger
Vi kunne egentlig jobbet dobbelt så lang tid. Vi brukte også litt tid til selv 
å fordøye hvordan kravene burde være. Claude laget dem raskere enn vi
egentlig klarte å følge med på. 

---

### 6. Konklusjon

Veldig nyttig øvelse. AI er veldig kraftig og lager ting veldig fort, 
særlig når det IKKE tar av i feil retning. Krever litt trening
å lage prosesser og regler som holder claude litt i ørene. 

---
