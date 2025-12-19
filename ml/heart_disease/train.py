import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

# Load dataset
df = pd.read_csv("heart_disease_uci.csv")

# Target: disease present or not
df["num"] = df["num"].apply(lambda x: 1 if x > 0 else 0)

# Drop ID & dataset column
df = df.drop(columns=["id", "dataset"])

X = df.drop("num", axis=1)
y = df["num"]

# Identify columns
categorical_cols = [
    "sex", "cp", "restecg", "slope", "thal"
]

numerical_cols = [
    col for col in X.columns if col not in categorical_cols
]

# Preprocessing
numeric_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="median"))
])

categorical_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("encoder", OneHotEncoder(handle_unknown="ignore"))
])

preprocessor = ColumnTransformer([
    ("num", numeric_pipeline, numerical_cols),
    ("cat", categorical_pipeline, categorical_cols)
])

# Full pipeline
model_pipeline = Pipeline([
    ("preprocess", preprocessor),
    ("classifier", LogisticRegression(max_iter=2000))
])

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train
model_pipeline.fit(X_train, y_train)

# Evaluate
y_pred = model_pipeline.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))

# Save full pipeline
joblib.dump(model_pipeline, "heart_pipeline.joblib")

print("✅ Pipeline saved successfully")
