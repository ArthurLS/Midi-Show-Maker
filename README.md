# To Use

```bash
# Clone this repository
git clone https://github.com/ArthurLS/opren_electron
# Go into the repository
cd opren_electron
# Install dependencies
npm install
### might have to solve dependencies install issues for 'easymidi'
# Run the app
npm start
```

# Fonctionnalitées:

## Projet:
- Creer
- Sauvegarder
- Ajouter evenement
- Définir les périphériques I/O
- Données:
{
    Nom: String
    ListeEvents: Liste<Evenement>
    Peripherique IN
    Peripherique OUT
}

## Evenement (Cue 0.. * ):
- CRUD
- Ajouter des cues
- Modifier une cue
- Supprimer une cue
- Données d'un event:

```
{
  ID: int
  Nom: String
  Liste de cue: Liste<Cue>
  Options: Object
}

```


## Loop:
- Ajouter des cue

## Cue:
- Modifier

```
{
    "ID": Int
    "type": Note_On,
    "channel": 5
    "Temps": Time
    "options"{
        "note": 64,
        "velocity": 127
    }
}
```
