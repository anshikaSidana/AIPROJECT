document.getElementById("checkBtn").addEventListener("click", async () => {
    const text = document.getElementById("reviewText").value;
    console.log(text);
    const response = await fetch("http://127.0.0.1:5000/predict_review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: text })
    });
  
    const result = await response.json();
    document.getElementById("result").innerText = `Prediction: ${result.prediction}`;
  });
  