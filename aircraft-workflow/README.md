# Workflow Construction Avion - BPMN

Interface interactive React Flow pour visualiser le workflow de construction d'un avion basé sur les données MES, ERP et PLM.

## 🚀 Fonctionnalités

- **Vue Workflow BPMN** : Visualisation des 23 étapes de construction dans un ordre logique
- **Navigation Interactive** : 
  - Cliquez sur une étape pour voir ses postes de travail
  - Cliquez sur un poste pour voir les détails complets
- **Informations Détaillées** :
  - Employés assignés à chaque poste (depuis ERP)
  - Problèmes et retards (depuis MES)
  - Pièces utilisées avec références (liaison PLM ↔ MES)
  - Temps prévus vs temps réels
  - Aléas industriels et causes potentielles

## 🛠️ Installation

```bash
npm install
```

## 📊 Données

Les données proviennent de trois sources Excel :
- **MES_Extraction.xlsx** : Postes, étapes, temps, problèmes
- **ERP_Equipes Airplus.xlsx** : Employés et affectations
- **PLM_DataSet.xlsx** : Pièces et références

Le script Python `explore_workflow.py` génère le fichier `workflow_data.json` utilisé par l'interface.

## 🎯 Utilisation

1. Démarrer l'application :
```bash
npm run dev
```

2. Ouvrir http://localhost:3000 dans le navigateur

3. Navigation :
   - **Vue principale** : Toutes les étapes du workflow
   - **Clic sur étape** : Voir les postes de cette étape
   - **Clic sur poste** : Panneau latéral avec détails complets
   - **Bouton retour** : Revenir à la vue workflow

## 📋 Ordre des Étapes

1. Assemblage fuselage centrale
2. Montage train atterissage
3. Assemblage moteur / fuselage / train atterissage
4. Assemblage visserie
5. Assemblage queue avion
6. Assemblage cockpit
7. Assemblage réacteurs
8. Assemblage ailes (gauche et droite)
9. Fixations réacteurs
10. Assemblage trains atterrissage
11. Fixations ailes
12. Installations électriques
13. Finitions (stickers)

## 🎨 Code Couleur

- **Bleu** : Étapes du workflow
- **Vert** : Postes sans problème
- **Orange/Rouge** : Postes avec aléas ou retards
- **Icônes d'alerte** : Problèmes détectés

## 🔧 Technologies

- React 18
- React Flow 11 (diagrammes interactifs)
- Vite (build tool)
- Tailwind CSS (styling)
- Lucide React (icônes)
