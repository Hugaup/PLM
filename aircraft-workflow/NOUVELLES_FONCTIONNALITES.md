# Nouvelles Fonctionnalités - Main d'œuvre

## 🆕 Fonctionnalités ajoutées

### 1. 👥 Onglet "Annuaire du Personnel"
Nouvelle page dédiée à la gestion et visualisation des employés avec :

#### **Table complète des employés**
- Vue tabulaire de tous les employés (150 personnes)
- Colonnes : Matricule, Nom, Qualification, Poste, Expérience, Compétences

#### **Filtres avancés**
- 🔍 **Recherche textuelle** : Par nom, prénom ou matricule
- 📋 **Filtre par qualification** : Technicien, Opérateur, Chef d'équipe, etc.
- 📊 **Filtre par niveau d'expérience** : Junior, Confirmé, Senior, Expert
- 🏢 **Filtre par poste** : Poste 1 à 56
- 🎯 **Filtre par compétence** : Assemblage, Montage mécanique, Lecture plan, etc.
- ✅ **Filtre par habilitation** : Électricité, CACES, Travail en hauteur, etc.

### 2. 📊 Détails enrichis des employés

Cliquez sur un employé pour voir :

#### **Informations générales**
- Âge
- Niveau d'expérience
- Coût horaire (€)
- Poste de montage actuel

#### **Compétences détaillées**
Format parsé : `Compétence Niveau X`
- Affichage de toutes les compétences avec leurs niveaux
- Code couleur par niveau :
  - 🟢 **Niveau 4+** : Expert (vert)
  - 🔵 **Niveau 3** : Confirmé (bleu)
  - 🟡 **Niveau 2** : Intermédiaire (jaune)
  - ⚪ **Niveau 1** : Débutant (gris)

#### **Habilitations**
Liste de toutes les habilitations (parsées depuis CSV) :
- CACES R489
- Électricité BT/HT
- Travail en hauteur
- Pont roulant
- Habilitation chimique
- Etc.

#### **Parcours professionnel**
Commentaire de carrière complet de l'employé

### 3. 🔗 Intégration workflow ↔ employés

#### **Dans le panneau de détails des postes**
- Cliquez sur un employé pour ouvrir sa fiche détaillée
- Navigation fluide entre workflow et détails employé

## 📝 Colonnes supprimées

Les colonnes suivantes ne sont plus affichées car non pertinentes :
- ❌ **Rotation** : Information non utilisée
- ❌ **Description du poste** : Redondant avec qualification

## 🎨 Interface

### Navigation
- **Onglet 1** : 🛩️ Workflow BPMN (vue existante)
- **Onglet 2** : 👥 Annuaire du Personnel (nouveau)

### Modal de détails employé
- Design moderne avec gradient
- Sections bien séparées
- Icônes pour chaque section
- Badges colorés pour niveaux et habilitations

## 🚀 Utilisation

1. **Consulter tous les employés** : Onglet "Annuaire du Personnel"
2. **Filtrer** : Utilisez les 5 filtres en haut de la table
3. **Rechercher** : Tapez un nom/prénom/matricule
4. **Voir détails** : Cliquez sur "Détails" ou sur un employé dans un poste
5. **Navigation** : Retournez au workflow via l'onglet

## 📊 Statistiques

- **150 employés** au total
- **56 postes** de montage
- **~20 compétences** différentes
- **~10 habilitations** différentes
- **Niveaux de compétence** : 1 à 5
