# train_liver_model_safe_simple.py

import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from xgboost import XGBClassifier

df = pd.read_csv("liver_disease_cleaned.csv") 

imputer = SimpleImputer(strategy='mean')
df[df.columns] = imputer.fit_transform(df)

X = df.drop(columns=['Dataset'])
y = df['Dataset']

y = y.astype(int).map({1: 0, 2: 1})

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

xgb = XGBClassifier(
    n_estimators=200,
    max_depth=4,
    learning_rate=0.1,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42,
    use_label_encoder=False,
    eval_metric='logloss'
)

xgb.fit(X_train_scaled, y_train)

y_pred = xgb.predict(X_test_scaled)

print("Accuracy Score:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))
print("\nConfusion Matrix:\n", confusion_matrix(y_test, y_pred))

joblib.dump(xgb, "liver_xgb_model.pkl")
joblib.dump(scaler, "liver_scaler.pkl")

print("\nModel and scaler saved as 'liver_xgb_model.pkl' and 'liver_scaler.pkl'")
