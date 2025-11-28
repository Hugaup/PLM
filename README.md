# 🎼 MAESTRO

**M**anufacturing **A**nalytics & **E**xecution **S**ystem for **T**racking, **R**eporting and **O**ptimization

Dashboard de gestion de production aéronautique avec visualisation BPMN, analytics et analyse des causes racines.

![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)
![React Flow](https://img.shields.io/badge/React%20Flow-11.11-ff69b4)
![Recharts](https://img.shields.io/badge/Recharts-2.x-8884d8)

## 📋 Vue d'ensemble

MAESTRO est un système complet de gestion et d'analyse de la production aéronautique qui intègre :
- Visualisation de workflow BPMN avec 23 étapes et 56 postes
- Gestion de 150 employés avec compétences et habilitations
- Suivi de 40 pièces avec stock et criticité
- Analytics avancés avec 6 graphiques interactifs
- Analyse Ishikawa (6M) pour les causes racines
- Système de recommandation d'affectation intelligent

## ✨ Fonctionnalités principales

### 🔄 Workflow BPMN
- Visualisation interactive du processus de fabrication
- Navigation hiérarchique entre étapes et postes
- Indicateurs de problèmes et retards en temps réel

### 👥 Annuaire du Personnel
- 150 employés avec fiches complètes
- Filtres par qualification, expérience, compétences
- Recherche par nom, prénom ou matricule

### 📦 Catalogue des Pièces
- 40 pièces avec stock, fournisseur et criticité
- Filtrage par fournisseur et niveau de criticité
- Recherche par référence ou désignation

### 📊 Planification Production
- Vue d'ensemble des stocks par criticité
- Détails des pièces manquantes
- Estimation temps CAO, délais et coûts

### 📈 Analytics & Indicateurs
- Taux de retard par poste
- Distribution des problèmes par catégorie
- Stock critique par niveau
- Répartition des employés
- Coûts par fournisseur
- KPIs de performance avec coûts calculés dynamiquement

### 🐟 Analyse Ishikawa (6M)
- Classification de 56 problèmes selon les 6M
- Diagramme en arêtes de poisson interactif
- Filtrage par catégorie (Matériel, Méthode, Milieu, Matière, Main d'œuvre, Mesure)
- Analyse des causes dominantes

### 🎯 Recommandations d'Affectation
- Algorithme de scoring multi-critères (100% local, sans API)
- Top 5 candidats recommandés par poste
- Score basé sur : compétences (40%), expérience (25%), niveau (20%), équipe (15%)
- Priorisation des postes avec aléas
- Détails du scoring pour transparence

## 🚀 Installation

```bash
# Cloner le repository
git clone https://github.com/Hugaup/PLM.git
cd PLM/aircraft-workflow

# Installer les dépendances
npm install

# Lancer l'application
npm run dev
```

L'application sera accessible sur http://localhost:5173

## 📊 Données

L'application utilise un fichier `workflow_data.json` qui contient :
- 23 étapes de fabrication avec 56 postes
- 150 employés avec compétences et habilitations
- 40 pièces avec stock et fournisseurs
- 56 problèmes identifiés avec causes

## 🎨 Navigation

L'application comporte **7 onglets** organisés en 3 catégories :

**🏭 Production**
- **Workflow** : Visualisation BPMN du processus de fabrication
- **Pièces (40)** : Catalogue avec stock et criticité
- **Planning** : Vue d'ensemble et pièces manquantes

**👥 Personnel**
- **Annuaire (150)** : Personnel avec filtres et recherche
- **Recommandations** : Suggestions d'affectation par poste

**📊 Analyse**
- **Indicateurs** : Graphiques et KPIs de performance
- **Ishikawa (6M)** : Diagramme causes racines

## 🛠️ Technologies

- **React 18.3** - Framework UI
- **React Flow 11.11** - Visualisation BPMN et diagrammes
- **Recharts 2.x** - Graphiques interactifs
- **Vite 5.4** - Build tool
- **TailwindCSS 3.4** - Styling
- **Lucide React** - Icônes

## 👥 Équipe

Développé par l'**Équipe 49** dans le cadre d'un projet de gestion de production aéronautique.

---

*MAESTRO - Manufacturing Analytics & Execution System for Tracking, Reporting and Optimization*
