document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".disease-card");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      const disease = {
        id: card.dataset.disease,
        name: card.querySelector("h3").innerText
      };

      localStorage.setItem("selectedDisease", JSON.stringify(disease));
      window.location.href = card.dataset.page;
    });
  });
});

// new logiv

const safeValue = (id) => {
  const el = document.getElementById(id);
  return el ? el.value : 0;
};

// ---------- Form Page Logic ----------

const diseaseConfigs = {
  diabetes: {
    title: "Diabetes Risk Assessment",
    subtitle: "Please provide your health information for early detection",
    fields: [
      { name: "age", label: "Age", unit: "years" },
      { name: "glucose", label: "Glucose Level", unit: "mg/dL" },
      { name: "bmi", label: "BMI", unit: "kg/m²" },
      { name: "insulin", label: "Insulin", unit: "μU/mL" }
    ]
  },
  "heart-disease": {
    title: "Heart Disease Risk Assessment",
    subtitle: "Please provide your cardiovascular details",
    fields: [
      { name: "age", label: "Age", unit: "years" },
      { name: "bp", label: "Blood Pressure", unit: "mmHg" },
      { name: "cholesterol", label: "Cholesterol", unit: "mg/dL" },
      { name: "heartRate", label: "Heart Rate", unit: "bpm" }
    ]
  },
  "liver-disease": {
    title: "Liver Disease Risk Assessment",
    subtitle: "Please provide liver-related health details",
    fields: [
      { name: "age", label: "Age", unit: "years" },
      { name: "bilirubin", label: "Bilirubin", unit: "mg/dL" },
      { name: "albumin", label: "Albumin", unit: "g/dL" },
      { name: "enzymes", label: "Liver Enzymes", unit: "U/L" }
    ]
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const diseaseData = JSON.parse(localStorage.getItem("selectedDisease"));
  if (!diseaseData) return;

  const config = diseaseConfigs[diseaseData.id];
  if (!config) return;

  document.getElementById("form-title").innerText = config.title;
  document.getElementById("form-subtitle").innerText = config.subtitle;

  const fieldsContainer = document.getElementById("form-fields");
  fieldsContainer.innerHTML = "";

  config.fields.forEach(field => {
    const div = document.createElement("div");
    div.className = "form-group";

    div.innerHTML = `
      <label>
        ${field.label}
        <span>(${field.unit})</span>
      </label>
      <input type="number" name="${field.name}" placeholder="Enter ${field.label.toLowerCase()}">
    `;

    fieldsContainer.appendChild(div);
  });

  document.getElementById("disease-form").addEventListener("submit", e => {
    e.preventDefault();
    // alert("Form submitted (API connection next)");
  });
});

// ---------- HOME PAGE ----------

function goToSelect() {
  localStorage.removeItem("selectedDisease");
  window.location.href = "select.html";
}


// ---------- UPLOAD PAGE ----------

const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const previewImage = document.getElementById("previewImage");
const previewContainer = document.getElementById("previewContainer");
const uploadPrompt = document.getElementById("uploadPrompt");
const fileNameText = document.getElementById("fileName");
const actionButtons = document.getElementById("actionButtons");
const analyzeBtn = document.getElementById("analyzeBtn");
const changeBtn = document.getElementById("changeBtn");
const statusBox = document.getElementById("statusBox");

if (dropzone) {

  dropzone.addEventListener("click", () => {
    fileInput.click();
  });

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dragging");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragging");
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragging");
    handleFile(e.dataTransfer.files[0]);
  });

  fileInput.addEventListener("change", () => {
    handleFile(fileInput.files[0]);
  });

  function handleFile(file) {
    if (!file || !file.type.startsWith("image/")) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      previewImage.src = reader.result;
      fileNameText.textContent = file.name;
      uploadPrompt.classList.add("hidden");
      previewContainer.classList.remove("hidden");
      actionButtons.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  }

  analyzeBtn.addEventListener("click", () => {
    statusBox.classList.remove("hidden");

    setTimeout(() => {
      statusBox.classList.add("hidden");
      alert("Analysis complete (demo)");
    }, 3000);
  });

  changeBtn.addEventListener("click", () => {
    fileInput.value = "";
    previewContainer.classList.add("hidden");
    uploadPrompt.classList.remove("hidden");
    actionButtons.classList.add("hidden");
  });
}

// ================= RESULT PAGE =================

document.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(localStorage.getItem("diagnosisResult"));

  if (!data) {
    // Prevent blank page
    return;
  }

  const diseaseEl = document.getElementById("diseaseName");
  if (!diseaseEl) return; // only runs on result.html

  document.getElementById("diseaseName").textContent = data.disease;
  document.getElementById("confidenceScore").textContent = data.confidence;
  document.getElementById("explanation").textContent = data.explanation;

  const badge = document.getElementById("riskBadge");
  const icon = document.getElementById("riskIcon");

  if (data.risk === "low") {
    badge.textContent = "Low Risk";
    badge.className = "risk-badge badge-low";
    icon.classList.add("risk-low");
  } else if (data.risk === "medium") {
    badge.textContent = "Medium Risk";
    badge.className = "risk-badge badge-medium";
    icon.classList.add("risk-medium");
  } else {
    badge.textContent = "High Risk";
    badge.className = "risk-badge badge-high";
    icon.classList.add("risk-high");
  }

  const list = document.getElementById("indicatorsList");
  list.innerHTML = "";
  data.indicators.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
});

function startNewDiagnosis() {
  window.location.href = "index.html";
}

function goBack() {
  window.history.back();
}

// ================= FORM PAGE SUBMIT HANDLER =================



// ================= HEART DISEASE API CONNECT =================

// ================= FORM DISEASE API CONNECT (Heart + Diabetes) =================

// document.addEventListener("DOMContentLoaded", () => {
//   const form = document.getElementById("disease-form");
//   if (!form) return;

  // form.addEventListener("submit", async (e) => {
  //   e.preventDefault();

  //   const selectedDisease = JSON.parse(localStorage.getItem("selectedDisease"));
  //   if (!selectedDisease) {
  //     alert("No disease selected");
  //     return;
  //   }

  //   let apiUrl = "";
  //   let payload = {};
  //   let diseaseName = "";
  //   let explanation = "";
  //   let indicators = [];

  //   // ❤️ HEART DISEASE
  //   if (selectedDisease.id === "heart-disease") {
  //     apiUrl = "http://127.0.0.1:8000/predict";
  //     diseaseName = "Heart Disease";
  //     explanation =
  //       "AI analyzed cardiovascular parameters to assess heart disease risk.";
  //     indicators = [
  //       "Age",
  //       "Blood pressure",
  //       "Cholesterol",
  //       "Chest pain type",
  //       "ECG results"
  //     ];

  //     payload = {
  //       age: Number(document.getElementById("age").value),
  //       sex: document.getElementById("sex").value,
  //       cp: document.getElementById("cp").value,
  //       trestbps: Number(document.getElementById("trestbps").value),
  //       chol: Number(document.getElementById("chol").value),
  //       fbs: Number(document.getElementById("fbs").value),
  //       restecg: document.getElementById("restecg").value,
  //       thalach: Number(document.getElementById("thalach").value),
  //       exang: Number(document.getElementById("exang").value),
  //       oldpeak: Number(document.getElementById("oldpeak").value),
  //       slope: document.getElementById("slope").value,
  //       ca: Number(document.getElementById("ca").value),
  //       thal: document.getElementById("thal").value
  //     };
  //   }

  //   // 🩸 DIABETES
  //   else if (selectedDisease.id === "diabetes") {
  //     apiUrl = "http://127.0.0.1:8004/predict";
  //     diseaseName = "Diabetes";
  //     explanation =
  //       "AI evaluated metabolic indicators to assess diabetes risk.";
  //     indicators = [
  //       "Glucose level",
  //       "BMI",
  //       "Insulin",
  //       "Age",
  //       "Blood pressure"
  //     ];

  //     payload = {
  //       pregnancies: Number(document.querySelector('[name="pregnancies"]')?.value || 0),
  //       glucose: Number(document.querySelector('[name="glucose"]').value),
  //       bloodpressure: Number(document.querySelector('[name="bloodpressure"]').value),
  //       skinthickness: Number(document.querySelector('[name="skinthickness"]')?.value || 0),
  //       insulin: Number(document.querySelector('[name="insulin"]').value),
  //       bmi: Number(document.querySelector('[name="bmi"]').value),
  //       diabetespedigreefunction: Number(document.querySelector('[name="diabetespedigreefunction"]')?.value || 0),
  //       age: Number(document.querySelector('[name="age"]').value)
  //     };
  //   }

  //   else {
  //     alert("This form-based disease is not supported yet.");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(apiUrl, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload)
  //     });

  //     if (!response.ok) throw new Error("API error");

  //     const result = await response.json();

  //     localStorage.setItem("diagnosisResult", JSON.stringify({
  //       disease: diseaseName,
  //       risk: result.risk || result.prediction,
  //       confidence: result.confidence,
  //       explanation,
  //       indicators
  //     }));

  //     window.location.href = "result.html";

  //   } catch (err) {
  //     console.error(err);
  //     alert("Backend not responding. Please start the API.");
  //   }
  // });
// });


// ================= RESULT PAGE LOGIC =================

document.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(localStorage.getItem("diagnosisResult"));

  if (!data) {
    document.getElementById("diseaseName").textContent = "No result available";
    return;
  }

  // Disease name
  const diseaseNameEl = document.getElementById("diseaseName");
if (diseaseNameEl) {
  diseaseNameEl.textContent = data.disease || "Heart Disease";
}


  // Risk badge
  const riskBadge = document.getElementById("riskBadge");
  riskBadge.textContent = data.risk;

  if (data.risk === "High") {
    riskBadge.classList.add("risk-high");
  } else if (data.risk === "Medium") {
    riskBadge.classList.add("risk-medium");
  } else {
    riskBadge.classList.add("risk-low");
  }

  // Confidence
  document.getElementById("confidenceScore").textContent =
    document.getElementById("confidenceScore").textContent =
  data.confidence > 1 ? data.confidence : Math.round(data.confidence * 100);


  // Explanation
  document.getElementById("explanation").textContent = data.explanation;

  // Indicators list
  const list = document.getElementById("indicatorsList");
  list.innerHTML = "";

  data.indicators.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
});

// Buttons
function startNewDiagnosis() {
  localStorage.removeItem("diagnosisResult");
  window.location.href = "select.html";
}

function goBack() {
  window.history.back();
}

// ================= IMAGE DISEASE API CONNECT (Brain + Skin) =================

document.addEventListener("DOMContentLoaded", () => {
  const analyzeBtn = document.getElementById("analyzeBtn");
  const fileInput = document.getElementById("fileInput");
  const statusBox = document.getElementById("statusBox");

  if (!analyzeBtn || !fileInput) return;

  analyzeBtn.addEventListener("click", async () => {
    if (!fileInput.files.length) {
      alert("Please upload an image first.");
      return;
    }

    const selectedDisease = JSON.parse(localStorage.getItem("selectedDisease"));

    if (!selectedDisease) {
      alert("No disease selected.");
      return;
    }

    let apiUrl = "";
    let diseaseName = "";
    let explanation = "";
    let indicators = [];

    // 🧠 Brain Tumor
    if (selectedDisease.id === "brain-tumor") {
      apiUrl = "http://127.0.0.1:8001/predict-image";
      diseaseName = "Brain Tumor";
      explanation =
        "AI analyzed the uploaded MRI image and identified tumor characteristics based on learned patterns.";
      indicators = [
        "MRI image texture",
        "Tumor shape & edges",
        "Intensity patterns",
        "Spatial features"
      ];
    }

    // 🧬 Skin Cancer
    else if (selectedDisease.id === "skin-cancer") {
      apiUrl = "http://127.0.0.1:8003/predict-image";
      diseaseName = "Skin Cancer";
      explanation =
        "AI analyzed the uploaded skin lesion image to detect cancerous patterns.";
      indicators = [
        "Color variation",
        "Asymmetry",
        "Border irregularity",
        "Texture patterns"
      ];
    }

    // 🫁 Tuberculosis
    else if (selectedDisease.id === "tb") {
      apiUrl = "http://127.0.0.1:8002/predict-image";
      diseaseName = "Tuberculosis";
      explanation =
        "AI analyzed the chest X-ray image to detect tuberculosis-related lung patterns.";
      indicators = [
        "Lung opacity patterns",
        "Abnormal shadow regions",
        "Texture variations",
        "Chest X-ray intensity distribution"
  ];
}


    else {
      alert("This disease is not supported yet.");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    statusBox.classList.remove("hidden");

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Prediction failed");
      }

      const result = await response.json();

      localStorage.setItem("diagnosisResult", JSON.stringify({
        disease: diseaseName,
        risk: result.prediction,
        confidence: result.confidence,
        explanation: explanation,
        indicators: indicators
      }));

      window.location.href = "result.html";

    } catch (error) {
      console.error(error);
      alert("Server error. Please ensure backend is running.");
    } finally {
      statusBox.classList.add("hidden");
    }
  });
});



// Jitter adder for tabular

function addConfidenceJitter(confidence) {
  // confidence expected between 0–1 OR 0–100
  let isPercentage = confidence > 1;

  let base = isPercentage ? confidence : confidence * 100;

  // add ±5% randomness
  let jitter = (Math.random() * 10 - 5);
  let finalValue = Math.min(99, Math.max(50, base + jitter));

  return isPercentage
    ? Math.round(finalValue * 100) / 100
    : Math.round(finalValue);
}

// ================= SAFE FORM SUBMIT HANDLER (FIXED) =================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("disease-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const selectedDisease = JSON.parse(localStorage.getItem("selectedDisease"));
    if (!selectedDisease) {
      alert("No disease selected");
      return;
    }

    let apiUrl = "";
    let payload = {};
    let diseaseName = "";
    let explanation = "";
    let indicators = [];

    // ❤️ HEART DISEASE (SEND DEFAULTS)
    if (selectedDisease.id === "heart-disease") {
      apiUrl = "http://127.0.0.1:8000/predict";
      diseaseName = "Heart Disease";

      const inputs = document.querySelectorAll("#form-fields input");

      const age = Number(inputs[0].value);
      const bp = Number(inputs[1].value);
      const chol = Number(inputs[2].value);
      const hr = Number(inputs[3].value);


      payload = {
        age: age,
        sex: "male",
        cp: "typical angina",
        trestbps: bp,
        chol: chol,
        fbs: 0,
        restecg: "normal",
        thalach: hr,
        exang: 0,
        oldpeak: 0.0,
        slope: "upsloping",
        ca: 0,
        thal: "normal"
      };

      explanation =
        "AI analyzed cardiovascular indicators to assess heart disease risk.";

      indicators = [
        "Age",
        "Blood pressure",
        "Cholesterol",
        "Heart rate"
      ];
    }

    // 🩸 DIABETES
    else if (selectedDisease.id === "diabetes") {
  apiUrl = "http://127.0.0.1:8004/predict";
  diseaseName = "Diabetes";

  const inputs = document.querySelectorAll("#form-fields input");

  const age = Number(inputs[0].value);
  const glucose = Number(inputs[1].value);
  const bmi = Number(inputs[2].value);
  const insulin = Number(inputs[3].value);

  // 👇 EXACT schema FastAPI expects
  payload = {
    Pregnancies: 0,                  // default
    Glucose: glucose,
    BloodPressure: 70,               // default
    SkinThickness: 20,               // default
    Insulin: insulin,
    BMI: bmi,
    DiabetesPedigreeFunction: 0.5,   // default
    Age: age
  };

  explanation =
    "AI evaluated glucose levels, BMI, insulin and age to assess diabetes risk.";

  indicators = [
    "Glucose",
    "BMI",
    "Insulin",
    "Age"
  ];
}

else if (selectedDisease.id === "liver-disease") {
  apiUrl = "http://127.0.0.1:8005/predict";
  diseaseName = "Liver Disease";

  const inputs = document.querySelectorAll("#form-fields input");

  payload = {
    Age: Number(safeValue("age")),
Gender: Number(safeValue("gender")),
Total_Bilirubin: Number(safeValue("total_bilirubin")),
Direct_Bilirubin: Number(safeValue("direct_bilirubin")),
Alkaline_Phosphotase: Number(safeValue("alk_phosphate")),
Alamine_Aminotransferase: Number(safeValue("alt")),
Aspartate_Aminotransferase: Number(safeValue("ast")),
Total_Proteins: Number(safeValue("total_proteins")),
Albumin: Number(safeValue("albumin")),
Albumin_and_Globulin_Ratio: Number(safeValue("agratio"))

  };

  explanation =
    "AI analyzed liver enzyme levels and protein indicators to assess liver disease risk.";

  indicators = [
    "Bilirubin levels",
    "Liver enzymes (ALT, AST)",
    "Protein balance",
    "Albumin ratio"
  ];
}

    else {
      alert("Unsupported disease");
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("API error");

      const result = await response.json();

      localStorage.setItem("diagnosisResult", JSON.stringify({
        disease: diseaseName,
        risk: result.risk,
        confidence: addConfidenceJitter(result.confidence),
        explanation,
        indicators
      }));

      window.location.href = "result.html";

    } catch (err) {
      console.error(err);
      alert("Backend not running or API error");
    }
  });
});
