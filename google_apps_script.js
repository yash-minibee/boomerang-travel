/**
 * Boomerang Travel - Google Sheets Web App Script
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet.
 * 2. Create 3 tabs (sheets) at the bottom and name them EXACTLY:
 *    - Inquiries
 *    - MICE Inquiries
 *    - Subscribers
 * 
 * 3. Add the following headers in Row 1 for each sheet:
 * 
 *    [Sheet 1: Inquiries]
 *    Timestamp | Inquiry From | Inquiry For | Name | Email | Phone | Country | Destination | Date | Adults | Children | Budget | Message
 * 
 *    [Sheet 2: MICE Inquiries]
 *    Timestamp | Name | Email | Phone | Company | Event Type | Group Size | Expected Date | Destination | Requirements
 * 
 *    [Sheet 3: Subscribers]
 *    Timestamp | Email
 * 
 * 4. Go to Extensions > Apps Script. Paste this entire code, replacing any default code.
 * 5. Click "Deploy" > "New deployment".
 *    - Select type: "Web app"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 6. Copy the Web App URL generated. You will use this URL in your frontend API requests.
 */

function doPost(e) {
  try {
    const sheetApp = SpreadsheetApp.getActiveSpreadsheet();
    
    // Parse the incoming POST request body
    let data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    // Determine the type of submission: "inquiry", "mice", or "subscriber"
    const formType = data.type || "inquiry"; 
    
    let sheetName = "";
    let rowData = [];
    let headers = [];
    const timestamp = new Date();

    if (formType === "inquiry") {
      sheetName = "Inquiries";
      headers = ["Timestamp", "Inquiry From", "Inquiry For", "Name", "Email", "Phone", "Country", "Destination", "Date", "Adults", "Children", "Budget", "Message"];
      // inquiryFrom should be: "Contact Form", "Package Page", or "Cruise Page"
      rowData = [
        timestamp,
        data.inquiryFrom || "",
        data.inquiryFor || "",
        data.name || "",
        data.email || "",
        data.phone || "",
        data.country || "",
        data.destination || "",
        data.date || "",
        data.travellers || "", // Adults
        data.children || "",
        data.budget || "",
        data.message || ""
      ];
    } 
    else if (formType === "mice") {
      sheetName = "MICE Inquiries";
      headers = ["Timestamp", "Name", "Email", "Phone", "Country", "Company", "Event Type", "Group Size", "Expected Date", "Destination", "Requirements"];
      rowData = [
        timestamp,
        data.name || "",
        data.email || "",
        data.phone || "",
        data.country || "",
        data.company || "",
        data.event_type || "",
        data.group_size || "",
        data.expected_date || "",
        data.destination || "",
        data.requirements || ""
      ];
    } 
    else if (formType === "subscriber") {
      sheetName = "Subscribers";
      headers = ["Timestamp", "Email"];
      rowData = [
        timestamp,
        data.email || ""
      ];
    } 
    else {
      throw new Error("Invalid form type provided.");
    }

    // Get the correct sheet
    const sheet = sheetApp.getSheetByName(sheetName);
    if (!sheet) {
      throw new Error("Sheet '" + sheetName + "' not found. Please create it.");
    }

    // Add headers if the sheet is completely empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      // Make headers bold for a nicer look
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    }

    // Append the data as a new row
    sheet.appendRow(rowData);

    // Return success response
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      message: "Data saved successfully to " + sheetName 
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: error.message 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (Useful for testing if the script is alive)
function doGet(e) {
  return ContentService.createTextOutput("Boomerang Travel Apps Script is running successfully!")
    .setMimeType(ContentService.MimeType.TEXT);
}
