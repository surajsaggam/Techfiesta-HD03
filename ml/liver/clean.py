import pandas as pd
import numpy as np

df = pd.read_csv("indian_liver_patient.csv")
print("Original Dataset Shape:", df.shape)
print(df.head())

print("\nMissing Values:\n", df.isnull().sum())

cols_with_invalid_zero = ['Age', 'Total_Bilirubin', 'Direct_Bilirubin', 
                          'Alkaline_Phosphotase', 'Alamine_Aminotransferase', 
                          'Aspartate_Aminotransferase', 'Total_Protiens', 
                          'Albumin', 'Albumin_and_Globulin_Ratio']

for col in cols_with_invalid_zero:
    df[col] = df[col].replace(0, np.nan)

for col in cols_with_invalid_zero:
    df[col].fillna(df[col].median(), inplace=True)

categorical_cols = df.select_dtypes(include=['object']).columns
for col in categorical_cols:
    df[col].fillna(df[col].mode()[0], inplace=True)

if 'Gender' in df.columns:
    df['Gender'] = df['Gender'].map({'Male': 1, 'Female': 0})

print("\nDataset after cleaning:")
print(df.head())
print("\nMissing Values:\n", df.isnull().sum())

df.to_csv("liver_disease_cleaned.csv", index=False)
print("\nCleaned dataset saved as 'liver_disease_cleaned.csv'")
