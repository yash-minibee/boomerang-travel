const url = "http://localhost:8000/boomerangglobaltravels-backend/api/inquiries.php";

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customer_name: "Test",
    customer_email: "test@test.com",
    type: "custom_package",
    customer_phone: "",
    customer_country: "",
    package_name: "",
    travel_date: "",
    travellers: "",
    children: "0",
    budget_range: "",
    message: ""
  })
})
.then(res => res.text())
.then(data => console.log("Response:", data))
.catch(err => console.error("Error:", err));
