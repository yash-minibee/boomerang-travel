const url = "https://script.google.com/macros/s/AKfycbz7cjIKqwiMa4pfoOTRYpfUqAwiz_ZRC8VHxPPY0ekVXC7F-LggD66UstHUcsC2v-wmXQ/exec";

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: 'inquiry', inquiryFrom: 'TestScript', name: 'Node.js Test' })
})
.then(res => res.text())
.then(data => console.log("Response:", data))
.catch(err => console.error("Error:", err));
