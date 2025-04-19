window.addEventListener("checkFakeReviewSelection", async (e) => {
  const text = e.detail;

  try {
    const response = await fetch("http://127.0.0.1:5000/predict_review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text })
    });

    const result = await response.json();
    showFloatingPopup(result.prediction);
  } catch (error) {
    console.error("Error predicting:", error);
    showFloatingPopup("Error");
  }
});

function showFloatingPopup(prediction) {
  const existingPopup = document.getElementById("fake-review-popup");
  if (existingPopup) existingPopup.remove();

  const popup = document.createElement("div");
  popup.id = "fake-review-popup";
  popup.innerText =
    prediction === "FAKE"
      ? "⚠️ Possibly Fake Review"
      : prediction === "REAL"
      ? "✅ Looks Real"
      : "❌ Error checking review";
  popup.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${prediction === "FAKE" ? "#ffcccc" : "#ccffcc"};
    color: #333;
    padding: 12px 20px;
    font-weight: bold;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    z-index: 9999;
    font-family: Arial, sans-serif;
  `;

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 4000);
}
