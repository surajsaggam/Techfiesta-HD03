AI Based Early Disease Detection

Techfiesta-HD03/
│
├── frontend/
│   ├── index.html              # Home page
│   ├── select.html             # Disease selection page
│   ├── upload.html             # Image upload page
│   ├── form.html               # Form-based input page
│   ├── result.html             # Prediction result page
│   ├── information.html        # Disease information
│   ├── help.html               # Help & support page
│   ├── style.css               # Global styles
│   ├── script.js               # Frontend logic & API calls
│   └── images/                 # UI images/icons
│
├── backend/
│   ├── heart_disease_api/
│   │   ├── main.py
│   │   └── heart_pipeline.joblib
│   │
│   ├── brain_tumor_api/
│   │   ├── main.py
│   │   ├── brain_tumor_model.h5
│   │   └── class_indices.json
│   │
│   ├── skin_cancer_api/
│   │   ├── main.py
│   │   └── skin_cancer_model.h5
│   │
│   ├── tuberculosis_api/
│   │   ├── main.py
│   │   └── tb_model.h5
│   │
│   └── liver_disease_api/
│       ├── main.py
│       ├── liver_xgb_model.pkl
│       └── liver_scaler.pkl
│
├── ml/
│   ├── heart_disease/
│   │   ├── train.py
│   │   └── dataset/
│   │
│   ├── brain_tumor/
│   │   ├── train.py
│   │   └── dataset/
│   │
│   ├── skin_cancer/
│   │   └── dataset/
│   │
│   ├── tuberculosis/
│   │   └── dataset/
│   │
│   └── liver_disease/
│       ├── train.py
│       └── dataset/
│
├── start_all_apis.bat           # One-click backend startup (Windows)
├── requirements.txt             # Python dependencies
├── .gitignore
└── README.md
