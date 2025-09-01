📄 Tabs-to-PDF Project

A simple Angular application that demonstrates how to render tab-based content, including Chart.js visualizations, and export them to PDF using jsPDF and html2canvas.
The project also includes SCSS-based styling for a clean, modular UI.

🚀 Features

Tabbed Layout

3 tabs:

Tab 1 → Contains a Pie Chart (Chart.js).

Tab 2 → Contains text and images.

Tab 3 → Contains additional custom content.

PDF Export

Download content of each tab as PDF.

Supports charts, text, and images.

Proper page-wise rendering with titles.

Styling

Written in SCSS instead of inline styles.

Scoped class-based design for tabs and content.

🛠️ Tech Stack

Angular

Chart.js

jsPDF

html2canvas

SCSS (modular styling)

📂 Project Structure
src/
 ├── app/
 │   ├── components/
 │   │   ├── tabs/          # Tab navigation & content
 │   │   ├── pdf.service.ts # PDF export logic
 │   │   └── chart/         # Chart.js Pie Chart
 │   ├── styles/            # Global SCSS styles
 │   └── app.component.ts
 ├── assets/                # Static images
 └── index.html

⚙️ Installation

Clone the repository:

git clone https://github.com/your-username/tabs-to-pdf.git
cd tabs-to-pdf


Install dependencies:

npm install


Run the development server:

ng serve


Open your browser:
👉 http://localhost:4200

📸 Screenshots
Tab Layout

(screenshot of tabs UI)

Pie Chart in Tab 1

(screenshot of pie chart)

Exported PDF

(screenshot of downloaded PDF)

🧑‍💻 Usage

Navigate between tabs.

Click "Download PDF" to export the content of the currently active tab.

Works with charts, text, and images.

🐛 Troubleshooting

If PDF fails to download from Tab 2 or Tab 3, ensure:

Images are base64 encoded or properly referenced from assets/.

The content is fully rendered in the DOM before calling PDF export.