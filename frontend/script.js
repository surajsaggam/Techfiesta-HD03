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

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("disease-form");

  // Run only on form.html
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // stop page reload

    // TEMP MOCK RESULT (will be replaced by API later)
    localStorage.setItem("diagnosisResult", JSON.stringify({
      disease: "Diabetes",
      risk: "medium",
      confidence: 86,
      explanation: "AI identified moderate risk based on provided indicators.",
      indicators: [
        "High glucose",
        "BMI > 30",
        "Family history",
        "Low physical activity"
      ]
    }));

    // Navigate to result page
    window.location.href = "result.html";
  });
});


// ================= HEART DISEASE API CONNECT =================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("disease-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect values from inputs (IDs MUST MATCH)
    const payload = {
      age: Number(document.getElementById("age").value),
      sex: document.getElementById("sex").value,
      cp: document.getElementById("cp").value,
      trestbps: Number(document.getElementById("trestbps").value),
      chol: Number(document.getElementById("chol").value),
      fbs: Number(document.getElementById("fbs").value),
      restecg: document.getElementById("restecg").value,
      thalach: Number(document.getElementById("thalach").value),
      exang: Number(document.getElementById("exang").value),
      oldpeak: Number(document.getElementById("oldpeak").value),
      slope: document.getElementById("slope").value,
      ca: Number(document.getElementById("ca").value),
      thal: document.getElementById("thal").value
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("API error");
      }

      const result = await response.json();

      // Save result for result.html
      localStorage.setItem("diagnosisResult", JSON.stringify(result));

      // Go to result page
      window.location.href = "result.html";

    } catch (error) {
      alert("Server not responding. Please try again.");
      console.error(error);
    }
  });
});

// ================= RESULT PAGE LOGIC =================

document.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(localStorage.getItem("diagnosisResult"));

  if (!data) {
    document.getElementById("diseaseName").textContent = "No result available";
    return;
  }

  // Disease name
  document.getElementById("diseaseName").textContent = data.disease || "Heart Disease";

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

// ================= BRAIN TUMOR IMAGE API CONNECT =================

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

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    // Show loading
    statusBox.classList.remove("hidden");

    try {
      const response = await fetch("http://127.0.0.1:8000/predict-image", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Prediction failed");
      }

      const result = await response.json();

      // Save result for result.html
      localStorage.setItem("diagnosisResult", JSON.stringify({
        disease: "Brain Tumor",
        risk: result.prediction,
        confidence: result.confidence,
        explanation:
          "AI analyzed the uploaded MRI image and identified tumor characteristics based on learned patterns.",
        indicators: [
          "MRI image texture",
          "Tumor shape & edges",
          "Intensity patterns",
          "Spatial features"
        ]
      }));

      // Redirect to result page
      window.location.href = "result.html";

    } catch (error) {
      console.error(error);
      alert("Server error. Please ensure backend is running.");
    } finally {
      statusBox.classList.add("hidden");
    }
  });
});
