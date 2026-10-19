# 🌿 Veridian — Vendor Verification Workspace

**An AI-powered platform for vendor onboarding, document verification, and compliance workflows.**

Veridian helps teams manage vendor records, extract information from documents using AI, identify mismatches, track review tasks, and maintain a history of vendor changes.

## ✨ Key Features

- 🏢 **Vendor Management** — Create, view, and update vendor profiles.
- 📄 **AI Document Extraction** — Extract information from uploaded registration, GST, and bank documents.
- 🔍 **Document Verification** — Compare extracted information with vendor records and identify mismatches or missing fields.
- 🛡️ **Company Verification** — Check company records through the OpenCorporates integration.
- ✅ **Task Management** — Create review tasks with priority, status, and due dates.
- 📧 **Email Notifications** — Send missing-document requests using Resend.
- 🕘 **Version History** — Review previous vendor changes and restore earlier versions.
- 📱 **Responsive UI** — Manage vendors through a modern dashboard designed for desktop and mobile.

## 🧰 Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| AI Extraction | Ollama, Qwen vision model |
| Integrations | OpenCorporates, Resend |
| UI Components | Lucide React, Sonner |

## 🗂️ Project Structure

```text
vendor-verification-workspace/
├── frontend/
│   ├── src/
│   │   ├── app/              # Pages and layouts
│   │   ├── components/       # Reusable UI components
│   │   └── lib/               # API client and utilities
│   ├── package.json
│   └── .gitignore
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handling and business flow
│   │   ├── routes/           # API endpoints
│   │   ├── services/         # AI, email and verification logic
│   │   └── lib/              # Shared utilities
│   ├── prisma/
│   │   └── schema.prisma     # Database models
│   ├── uploads/              # Uploaded documents
│   ├── .env.example
│   └── package.json
└── README.md
```

## ⚙️ Prerequisites

Install the following before running the application:

- Node.js and npm
- PostgreSQL
- Ollama
- Git

Optional integrations require their respective API credentials:

- Resend for email notifications
- OpenCorporates for external company verification

## 🚀 Installation & Setup

### Step 1 — Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd vendor-verification-workspace
```

Replace the placeholder with the actual repository URL.

### Step 2 — Set up PostgreSQL

1. Start PostgreSQL.
2. Create a database named `vendor_verification`.
3. Note your database username and password.

Example database URL:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/vendor_verification?schema=public"
```

Replace `USER` and `PASSWORD` with your local PostgreSQL credentials.

### Step 3 — Configure the backend

Open a terminal in the project root:

```bash
cd backend
npm install
```

Create your local environment file by copying the example.

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

**macOS/Linux:**

```bash
cp .env.example .env
```

Open `backend/.env` and configure the values:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/vendor_verification?schema=public"

OPENCORPORATES_API_TOKEN=
RESEND_API_KEY=
EMAIL_FROM="Your Name <onboarding@resend.dev>"

UPLOAD_DIR=uploads
```

Keep all real passwords and API keys in `.env`. Never commit this file to GitHub.

### Step 4 — Initialize the database

From the `backend` directory, run the Prisma migration command configured for the project:

```bash
npx prisma migrate dev
```

If your project has no migrations yet, create the initial migration:

```bash
npx prisma migrate dev --name init
```

Generate the Prisma client if required:

```bash
npx prisma generate
```

Use the migration workflow supported by your current Prisma configuration. Do not reset an existing database containing data.

### Step 5 — Configure Ollama

Install Ollama and ensure its local service is running.

Download the configured vision model:

```bash
ollama pull qwen2.5vl:3b
```

Check that the model is available:

```bash
ollama list
```

The model name and Ollama URL must match the configuration used by the backend AI service.

### Step 6 — Start the backend

From the `backend` directory, use the development script defined in `backend/package.json`:

```bash
npm run dev
```

The configured backend should be available at:

`http://localhost:5000`

Check the terminal for successful database connection and server startup messages.

### Step 7 — Configure and start the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Configure the frontend API base URL if required. Use the exact environment variable expected by `frontend/src/lib/api.ts` and point it to the backend running on port `5000`.

Start the frontend using the development script in `frontend/package.json`:

```bash
npm run dev
```

Open the local URL printed by Next.js, typically:

`http://localhost:3000`

Keep both the frontend and backend terminals running while testing the application.

## 🔄 How to Test the Application

### 1. Create a vendor

- Open the Vendors page.
- Add a vendor with a company name, contact details, and required information.
- Open the newly created vendor profile.

### 2. Upload and verify documents

- Choose the document type: registration certificate, GST certificate, or bank document.
- Select a supported document and click **Upload and extract**.
- Wait for AI extraction and document comparison to finish.
- Review the verification results and any missing or mismatched fields.

### 3. Verify the company

- Click **Verify company** on the vendor profile.
- Review the external registry verification result.
- Configure the required OpenCorporates credentials to enable the external lookup.

**Important:** Document comparison and external company verification are separate processes. An `UNABLE_TO_VERIFY` result means verification could not be completed; it does not automatically mean the company is fraudulent.

### 4. Manage review tasks

- Create a task for a vendor follow-up.
- Set the priority and due date.
- Review the task status and update it when the action is completed.

### 5. Send missing-document emails

- Configure a valid Resend API key and sender.
- Use the missing-documents email action on the vendor profile.
- Confirm the API response and email delivery.

### 6. Review version history

- Update vendor information to create a version entry.
- Open Version History.
- Review a previous version and use the restore action when required.

## 🔐 Security & Configuration Notes

- Never commit `.env` files, API keys, database passwords, or private vendor documents.
- Keep `.env.example` populated with placeholder values only.
- Ensure uploaded files are validated and stored securely.
- Configure production CORS, authentication, and access controls before deployment.
- External services may require credentials and may return unavailable or inconclusive results.

## 🧪 Final Verification Checklist

- [ ] Frontend starts successfully.
- [ ] Backend connects to PostgreSQL.
- [ ] Vendor creation and updates work.
- [ ] Document upload and AI extraction work.
- [ ] Verification results are displayed.
- [ ] Tasks can be created and updated.
- [ ] Email integration works when configured.
- [ ] Version history and restore work.

## 👩‍💻 Author

**Sanjana Patel**  
Full Stack Developer

Built with Next.js, Node.js, PostgreSQL, Prisma, and AI-assisted document processing.
