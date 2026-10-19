
# 🌿 Veridian — Vendor Verification Workspace

A modern vendor onboarding and verification platform built to simplify document reviews, company verification, and compliance workflows.

## ✨ Features

- 🏢 **Vendor Management** — Create, view, and update vendor records.
- 📄 **AI Document Extraction** — Extract information from uploaded certificates using Ollama.
- 🔍 **Document Verification** — Compare extracted fields and identify mismatches or missing information.
- 🛡️ **Company Verification** — Integrate external company registry checks through OpenCorporates.
- ✅ **Task Management** — Create review tasks with priority, status, and due dates.
- 📧 **Email Notifications** — Send missing-document requests using Resend.
- 🕘 **Version History** — Review previous vendor changes and restore earlier versions.
- 📱 **Responsive Dashboard** — Clean interface for desktop and mobile.

## 🧰 Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| AI Extraction | Ollama, Qwen vision model |
| Integrations | OpenCorporates, Resend |
| UI | Lucide React, Sonner |

## 📁 Project Structure

```text
vendor-verification-workspace/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   └── .gitignore
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── lib/
│   ├── prisma/
│   └── uploads/
└── README.md
```

## 🚀 Getting Started

### 1. Prerequisites

- Node.js and npm
- PostgreSQL
- Ollama with the configured vision model
- API credentials for optional external integrations

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file using your project's environment configuration. Set the database connection and required service settings.

Example configuration keys:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/vendor_verification"
PORT=5000
RESEND_API_KEY="your_resend_api_key"
EMAIL_FROM="Your Name <your_verified_sender@example.com>"
OPENCORPORATES_API_TOKEN="your_api_token"
```

Use your actual local values. Never commit real credentials.

Run your Prisma migrations using the commands configured in your backend project, then start the backend using its development script.

### 3. Configure the frontend

```bash
cd frontend
npm install
```

Set the frontend API base URL to your backend address, according to the environment variable used by your application.

Start the frontend using its development script.

### 4. Open the application

Visit the local frontend URL shown in your terminal. The backend API runs on the configured port.

## 🔄 Verification Workflow

1. Create a vendor record.
2. Upload registration, GST, or bank documents.
3. Extract document data and review mismatches or missing fields.
4. Run external company verification when registry credentials are configured.
5. Create tasks, request missing documents by email, and review version history.

> **Note:** Document comparison and external company verification are separate checks. External verification may return `UNABLE_TO_VERIFY` if the registry service is unavailable, credentials are missing, or a result cannot be confirmed.

## 🔐 Security

- Keep `.env` files and API credentials out of version control.
- Do not commit uploaded documents or private vendor data.
- Configure production CORS, authentication, file validation, and secure storage before deployment.

## 👩‍💻 Author

**Sanjana Patel**  
Full Stack Developer
