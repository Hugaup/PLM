import pandas as pd
import json

# Charger les fichiers Excel
mes_df = pd.read_excel('data/MES_Extraction.xlsx')
erp_df = pd.read_excel('data/ERP_Equipes Airplus.xlsx')
plm_df = pd.read_excel('data/PLM_DataSet.xlsx')

print("=== Étapes uniques dans MES (colonne Nom) ===")
etapes_uniques = mes_df['Nom'].unique()
print(f"Nombre d'étapes: {len(etapes_uniques)}")
for etape in etapes_uniques:
    count = len(mes_df[mes_df['Nom'] == etape])
    print(f"  - {etape} ({count} postes)")

print("\n=== Postes par étape ===")
for etape in etapes_uniques:
    postes = mes_df[mes_df['Nom'] == etape]['Poste'].unique()
    print(f"\n{etape}:")
    print(f"  Postes: {sorted(postes)}")

print("\n=== Exemple de données MES pour une étape ===")
exemple_etape = etapes_uniques[0]
print(f"\nÉtape: {exemple_etape}")
exemple_data = mes_df[mes_df['Nom'] == exemple_etape][['Poste', 'Nom', 'Référence', 'Temps Prévu', 'Temps Réel', 'Aléas Industriels', 'Cause Potentielle']]
print(exemple_data)

print("\n=== Données ERP (Équipes) ===")
print(f"Postes de montage uniques: {sorted(erp_df['Poste de montage'].unique())}")
print(f"\nExemple d'employés au Poste 1:")
print(erp_df[erp_df['Poste de montage'] == 1][['Matricule', 'Prénom', 'Nom', 'Qualification', 'Poste de montage']].head())

print("\n=== Données PLM (Pièces) ===")
print(plm_df[['Code / Référence', 'Désignation', 'Quantité', 'Fournisseur']].head(10))

print("\n=== Création du mapping pour React Flow ===")
# Créer une structure de données pour React Flow
workflow_data = {
    'stages': [],
    'relationships': {},
    'employees': erp_df.to_dict('records'),  # Tous les employés
    'parts': plm_df.to_dict('records')  # Toutes les pièces
}

for idx, etape in enumerate(etapes_uniques):
    stage_data = {
        'id': f'stage_{idx}',
        'name': etape,
        'postes': []
    }
    
    postes_etape = mes_df[mes_df['Nom'] == etape]
    for _, poste_row in postes_etape.iterrows():
        poste_num = poste_row['Poste']
        
        # Trouver les employés pour ce poste (ERP utilise "Poste 1", "Poste 2", etc.)
        poste_str = f"Poste {poste_num}"
        employees = erp_df[erp_df['Poste de montage'] == poste_str]
        
        poste_info = {
            'poste_id': int(poste_num),
            'reference': str(poste_row['Référence']) if pd.notna(poste_row['Référence']) else None,
            'temps_prevu': str(poste_row['Temps Prévu']) if pd.notna(poste_row['Temps Prévu']) else None,
            'temps_reel': str(poste_row['Temps Réel']) if pd.notna(poste_row['Temps Réel']) else None,
            'aleas': str(poste_row['Aléas Industriels']) if pd.notna(poste_row['Aléas Industriels']) else None,
            'cause': str(poste_row['Cause Potentielle']) if pd.notna(poste_row['Cause Potentielle']) else None,
            'employees': employees[['Matricule', 'Prénom', 'Nom', 'Qualification']].to_dict('records') if not employees.empty else []
        }
        
        # Trouver les pièces utilisées
        if pd.notna(poste_row['Référence']):
            pieces = plm_df[plm_df['Code / Référence'] == poste_row['Référence']]
            if not pieces.empty:
                poste_info['pieces'] = pieces[['Code / Référence', 'Désignation', 'Quantité', 'Fournisseur']].to_dict('records')
        
        stage_data['postes'].append(poste_info)
    
    workflow_data['stages'].append(stage_data)

# Sauvegarder dans un fichier JSON
with open('workflow_data.json', 'w', encoding='utf-8') as f:
    json.dump(workflow_data, f, indent=2, ensure_ascii=False)

print("\nDonnées exportées dans workflow_data.json")
print(f"Nombre total d'étapes: {len(workflow_data['stages'])}")
