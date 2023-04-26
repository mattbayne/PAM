const express = require("express");
const cors = require("cors");
const app = express();

const wkhtmltopdf = require("wkhtmltopdf");
const fs = require("fs");
app.use(cors());
app.use(express.json());

app.post("/convert-to-pdf", (req, res) => {
  const htmlString = req.body.html; // Get the HTML string from the request body

  // Convert the HTML string to a PDF
  const pdfStream = wkhtmltopdf(htmlString, { pageSize: "letter" });

  // Set the response headers
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=output.pdf");

  // Pipe the PDF stream directly to the response
  pdfStream.pipe(res);

  // Handle errors on the PDF stream
  pdfStream.on("error", (err) => {
    console.error("Error converting HTML to PDF:", err);
    res.status(500).json({ error: "Failed to create PDF" });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
