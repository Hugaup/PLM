import pandas as pd

# Charger les fichiers Excel
mes_df = pd.read_excel('data/MES_Extraction.xlsx')
erp_df = pd.read_excel('data/ERP_Equipes Airplus.xlsx')
plm_df = pd.read_excel('data/PLM_DataSet.xlsx')

print("=== MES_Extraction.xlsx ===")
print(f"Colonnes: {mes_df.columns.tolist()}")
print(f"Shape: {mes_df.shape}")
print("\nPremières lignes:")
print(mes_df.head())
print("\n" + "="*80 + "\n")

print("=== ERP_Equipes Airplus.xlsx ===")
print(f"Colonnes: {erp_df.columns.tolist()}")
print(f"Shape: {erp_df.shape}")
print("\nPremières lignes:")
print(erp_df.head())
print("\n" + "="*80 + "\n")

print("=== PLM_DataSet.xlsx ===")
print(f"Colonnes: {plm_df.columns.tolist()}")
print(f"Shape: {plm_df.shape}")
print("\nPremières lignes:")
print(plm_df.head())
