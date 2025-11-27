# 🛩️ Aircraft Manufacturing Workflow - BPMN Visualization

Interface web interactive pour visualiser et gérer le workflow de construction d'avion basé sur les données MES, ERP et PLM.

![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)
![React Flow](https://img.shields.io/badge/React%20Flow-11.11-ff69b4)
![Python](https://img.shields.io/badge/Python-3.13-3776ab?logo=python)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Structure du projet](#structure-du-projet)
- [Technologies](#technologies)

## 🎯 Aperçu

Cette application permet de visualiser de manière interactive le processus complet de construction d'un avion à travers :
- **23 étapes de fabrication** organisées en workflow BPMN
- **56 postes de travail** avec leurs équipes assignées
- **150 employés** avec leurs compétences et habilitations
- **Suivi des pièces** utilisées à chaque étape
- **Détection des problèmes** et retards en temps réel

## ✨ Fonctionnalités

### 🔄 Workflow BPMN Interactif
- Visualisation complète du processus de construction
- Navigation hiérarchique : Étapes → Postes → Détails
- Connexions logiques entre les étapes
- Indicateurs visuels des problèmes (aléas, retards)

### 👥 Gestion du Personnel
- **Annuaire complet** : 150 employés avec fiches détaillées
- **Filtres avancés** :
  - Qualification (Technicien, Chef d'équipe, etc.)
  - Niveau d'expérience (Junior, Expert, etc.)
  - Compétences (Assemblage, Montage mécanique, etc.)
  - Niveau de compétence (1 à 5)
  - Habilitations (CACES, Électricité, etc.)
  - Poste de travail (1 à 56)
- **Recherche textuelle** : Par nom, prénom ou matricule
- **Fiches employés détaillées** :
  - Compétences avec niveaux
  - Habilitations
  - Coût horaire
  - Parcours professionnel

### 📊 Analyse de Production
- **Temps de production** : Prévu vs Réel avec alertes
- **Aléas industriels** : Identification et causes potentielles
- **Traçabilité** : Pièces utilisées (PLM) liées aux postes (MES)
- **Code couleur** : Identification rapide des problèmes

### 🔗 Intégration Multi-Sources
- **MES** : Postes, temps, problèmes, références pièces
- **ERP** : Employés, compétences, habilitations, affectations
- **PLM** : Pièces, fournisseurs, spécifications

## 🏗️ Architecture

```
┌─────────────────┐
│  Fichiers Excel │
│  MES/ERP/PLM   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ explore_workflow│
│     .py         │ ← Script Python de transformation
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ workflow_data   │
│     .json       │ ← Données unifiées
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  React App      │
│  (React Flow)   │ ← Interface web interactive
└─────────────────┘
```

## 🚀 Installation

### Prérequis
- Python 3.13+
- Node.js 18+
- npm ou yarn

### 1. Cloner le repository

```bash
git clone https://github.com/Hugaup/PLM.git
cd PLM
```

### 2. Préparer les données

```bash
# Installer les dépendances Python
pip install pandas openpyxl

# Générer le fichier JSON à partir des Excel
python explore_workflow.py
```

### 3. Installer l'application React

```bash
cd aircraft-workflow
npm install
```

## 🎮 Utilisation

### Lancer l'application

```bash
cd aircraft-workflow
npm run dev
```

Ouvrir http://localhost:3000 dans le navigateur

### Navigation

#### Onglet "Workflow BPMN"
1. **Vue d'ensemble** : Visualiser toutes les étapes de construction
2. **Cliquer sur une étape** : Voir les postes de cette étape
3. **Cliquer sur un poste** : Panneau détaillé avec :
   - Employés assignés (cliquables)
   - Temps prévus vs réels
   - Problèmes et retards
   - Pièces utilisées
4. **Cliquer sur un employé** : Modal avec détails complets

#### Onglet "Annuaire du Personnel"
1. **Table complète** : Tous les employés
2. **Filtres** : Affiner la recherche par critères multiples
3. **Bouton "Détails"** : Fiche complète de l'employé

### Ordre logique des étapes

1. Assemblage fuselage centrale
2. Montage train atterissage
3. Assemblage moteur / fuselage / train atterissage
4. Assemblage visserie (fuselage + train)
5. Assemblage queue avion
6. Assemblage cockpit
7. Assemblage réacteurs
8. Assemblage ailes (gauche et droite)
9. Assemblage trains d'atterrissage (gauche et droit)
10. Fixation réacteurs sur ailes
11. Fixation ailes sur avion
12. Fixation bout d'ailes
13. Installation électrique
14. Fixation lumières
15. Finitions (stickers)

## 📁 Structure du projet

```
PLM/
├── data/                              # Données sources
│   ├── MES_Extraction.xlsx           # Postes, temps, problèmes
│   ├── ERP_Equipes Airplus.xlsx      # Employés, compétences
│   └── PLM_DataSet.xlsx              # Pièces, fournisseurs
│
├── explore_workflow.py                # Script de transformation
├── workflow_data.json                 # Données unifiées générées
│
└── aircraft-workflow/                 # Application React
    ├── src/
    │   ├── App.jsx                   # Composant principal
    │   └── components/
    │       ├── StageNode.jsx         # Nœuds d'étapes
    │       ├── PosteNode.jsx         # Nœuds de postes
    │       ├── DetailPanel.jsx       # Panneau latéral
    │       ├── EmployeeDirectory.jsx # Annuaire personnel
    │       └── EmployeeDetailModal.jsx # Modal détails employé
    │
    ├── package.json
    ├── vite.config.js
    └── workflow_data.json             # Copie des données
```

## 🛠️ Technologies

### Backend (Traitement de données)
- **Python 3.13** : Langage principal
- **Pandas** : Manipulation de données
- **OpenPyXL** : Lecture des fichiers Excel

### Frontend (Interface)
- **React 18.3** : Framework UI
- **React Flow 11.11** : Diagrammes interactifs et BPMN
- **Vite 5.4** : Build tool moderne
- **TailwindCSS 3.4** : Framework CSS
- **Lucide React** : Icônes

### Données
- **Format source** : Excel (MES, ERP, PLM)
- **Format unifié** : JSON
- **Liaison** : Matricule (ERP) ↔ Poste (MES) ↔ Référence (PLM)

## 🎨 Code Couleur

| Couleur | Signification |
|---------|---------------|
| 🔵 Bleu | Étapes du workflow |
| 🟢 Vert | Postes sans problème |
| 🟠 Orange/Rouge | Postes avec aléas ou retards |
| 🟢 Vert (badges) | Compétence Niveau 4-5 (Expert) |
| 🔵 Bleu (badges) | Compétence Niveau 3 (Confirmé) |
| 🟡 Jaune (badges) | Compétence Niveau 2 (Intermédiaire) |
| ⚪ Gris (badges) | Compétence Niveau 1 (Débutant) |

## 📊 Statistiques

- **23 étapes** de fabrication
- **56 postes** de travail
- **150 employés** répertoriés
- **40 types de pièces** référencées
- **~20 compétences** différentes
- **~10 habilitations** actives
- **5 niveaux** de compétence

## 🔄 Mise à jour des données

Pour mettre à jour les données après modification des fichiers Excel :

```bash
# 1. Modifier les fichiers Excel dans data/
# 2. Régénérer le JSON
python explore_workflow.py

# 3. Copier vers l'app React
cp workflow_data.json aircraft-workflow/

# 4. L'application se recharge automatiquement
```

## 📝 Licence

MIT License - Voir le fichier LICENSE pour plus de détails

## 👨‍💻 Auteur

**Hugaup** - [GitHub](https://github.com/Hugaup)

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

---

**Note** : Ce projet a été développé pour visualiser et optimiser les processus de fabrication aéronautique en intégrant les données de différents systèmes (MES, ERP, PLM).
