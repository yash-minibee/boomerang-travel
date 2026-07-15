const url = "https://script.google.com/macros/s/AKfycbz7cjIKqwiMa4pfoOTRYpfUqAwiz_ZRC8VHxPPY0ekVXC7F-LggD66UstHUcsC2v-wmXQ/exec";

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain' }, // Simulate no-cors
  body: JSON.stringify({ type: 'inquiry', inquiryFrom: 'TestScript', name: 'Cors Test' })
})
.then(res => res.text())
.then(data => console.log("Response:", data))
.catch(err => console.error("Error:", err));
