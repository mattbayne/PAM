import React, { useState } from "react";
import axios from "axios";

const ConvertHtmlToPdf = () => {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    console.log("Submitting form...");
    event.preventDefault();

    if (!html) return;

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3001/convert-to-pdf", { html: html }, { responseType: "blob" });

      // Create a download link and click it to download the PDF file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "output.pdf");
      document.body.appendChild(link);
      link.click();

      setLoading(false);
    } catch (error) {
      console.error("Error converting HTML to PDF:", error);
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="h2">Enter HTML to be Converted into a PDF:</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="html">HTML:</label>
          <textarea
            id="html"
            value={html}
            onChange={(event) => setHtml(event.target.value)}
            rows="10"
            cols="50"
            style={{ width: "100%" }}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Converting..." : "Convert to PDF"}
        </button>
      </form>
    </div>
  );
};

export default ConvertHtmlToPdf;
