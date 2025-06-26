# FrontendCodeChallenge
📌 Angular Technical Test – Form + CSV Upload Demo
📄 Description
This is a sample Angular application developed as part of a technical test. It showcases core Angular features and UI/UX best practices, including:

✅ Reactive Forms with live validation

📤 CSV file upload and parsing entirely in the frontend

♻️ Dynamic form behavior (reset with confirmation)

💾 Temporary persistence via sessionStorage

📱 Responsive UI using Tailwind CSS

🔐 Environment-based config (e.g., encryption key usage)

🚀 Features
🧾 Form Includes:
First Name and Last Name

Email (required, validated format)

Subscription plan dropdown (Basic, Advanced [default], Pro)

Password field (must be:

≥ 8 characters

contain at least 1 letter

contain at least 1 special character)

CSV file input (parsed and displayed)

Submit and Clear buttons

💬 User Feedback:
Real-time validation hints below each field

Cumulative error summary at top after form submission

Debounced validation (runs after user stops typing)

🧠 Behavior:
CSV is parsed entirely on the frontend using papaparse

Parsed CSV is shown in a dynamic table on another page

Clicking "Clear" prompts a confirmation modal

Form values persist in sessionStorage until submitted

Uses Angular signals, effects, and custom directives for enhanced reactivity and modularity

🛠️ Tech Stack

⚙️ Angular v20
🎨 Tailwind CSS
🔄 RxJS
⛓ TypeScript
📦 papaparse for CSV parsing



🔐 Security & Configuration
Sensitive values like the encryption key are stored in environment.ts and environment.prod.ts

Password is encrypted before saving in sessionStorage

sessionStorage is cleared on logout or saved after submission

📂 Project Structure
src/
├── app/
│   ├── core/             # Global guards
│   ├── layout/           # Header, site layout
│   ├── pages/            # Main pages (home, summary)
│   ├── shared/
│   │   ├── components/   # Reusable UI parts
│   │   ├── directives/   # Custom validators or behaviors
│   │   ├── models/       # Interfaces and types
│   │   ├── pipes/        # Custom pipes (e.g. error handling)
│   │   └── services/     # Storage
│   │   └── utils/        # Helpers
│   └── environments/
│       ├── environment.ts
│       └── environment.prod.ts

▶️ Getting Started
npm install
ng serve
Then visit http://localhost:4200 in your browser.

📱 Responsive Design
Built with Tailwind CSS:

Mobile-first approach

Responsive grid and utility classes

Smooth transitions and modern UI/UX

min-h-screen, gap-*, text-wrap, and flex-wrap to enhance accessibility and layout stability

✅ Additional Notes
All data handling (form + CSV) is done 100% client-side

CSV parsing is fast and accurate with papaparse

Form UI includes progressive enhancement, feedback states, and accessibility support

Includes unit testing for critical components (guards, service logic, and interaction behavior)

Styled with clean and consistent Tailwind tokens like text-sm, rounded, hover:bg-*, and shadow-md
