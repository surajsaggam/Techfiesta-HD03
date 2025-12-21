@echo off
echo ===============================
echo Starting ALL AI Health APIs
echo ===============================

REM Heart Disease API (Port 8000)
start cmd /k "cd backend\heart_disease_api && py -3.10 -m uvicorn main:app --reload --port 8000"

REM Brain Tumor API (Port 8001)
start cmd /k "cd backend\brain_tumor_api && py -3.10 -m uvicorn main:app --reload --port 8001"

REM Tuberculosis API (Port 8002)
start cmd /k "cd backend\tuberculosis_api && py -3.10 -m uvicorn main:app --reload --port 8002"

REM Skin Cancer API (Port 8003)
start cmd /k "cd backend\skin_cancer_api && py -3.10 -m uvicorn main:app --reload --port 8003"

REM Diabetes API (Port 8004)
start cmd /k "cd backend\diabetes_api && py -3.10 -m uvicorn main:app --reload --port 8004"

REM Liver Disease API (Port 8005)
start cmd /k "cd backend\liver_disease_api && py -3.10 -m uvicorn main:app --reload --port 8005"


echo ===============================
echo All APIs launched successfully
echo ===============================
pause
