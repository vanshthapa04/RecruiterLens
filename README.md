# RecruiterLens 🚀

An AI-powered ATS Resume Analyzer that helps job seekers evaluate how well their resume matches a job description and identify improvements to increase interview chances.

---

## 📌 Overview

RecruiterLens analyzes uploaded resumes against a job description to provide:

* ATS Compatibility Score
* Matched Skills
* Missing Skills
* AI-Powered Resume Recommendations

The application leverages AI and keyword analysis to help candidates optimize their resumes for Applicant Tracking Systems (ATS).

---

## ✨ Features

### 📄 Resume Upload

* Upload resumes in PDF format
* Automatic text extraction from uploaded resumes

### 🎯 ATS Score Analysis

* Calculates resume compatibility with a job description
* Provides a percentage-based ATS score

### ✅ Skill Matching

* Detects skills present in both resume and job description
* Highlights strengths relevant to the role

### ❌ Missing Skills Detection

* Identifies important skills missing from the resume
* Helps candidates understand skill gaps

### 🤖 AI Recommendations

* Generates personalized recommendations using Google Gemini AI
* Suggests improvements based on the job description

### 🎨 Modern UI

* Built with Next.js and Tailwind CSS
* Responsive design
* Interactive ATS score visualization

---

## 🛠️ Tech Stack

### Frontend

* Next.js
* TypeScript
* Tailwind CSS
* Framer Motion
* React Circular Progressbar

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL

### AI

* Google Gemini API

### Additional Libraries

* Multer
* PDF Parse

---

## 📂 Project Structure

```text
RecruiterLens
│
├── frontend
│   ├── app
│   │   ├── components
│   │   ├── services
│   │   └── page.tsx
│   │
│   ├── public
│   └── package.json
│
├── backend
│   ├── config
│   ├── src
│   │   ├── constants
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── routes
│   │   └── services
│   │
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/RecruiterLens.git

cd RecruiterLens
```

---

## Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file:

```env
PORT=5001

DATABASE_URL=your_postgresql_connection_string

GEMINI_API_KEY=your_gemini_api_key
```

Start Backend Server:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5001
```

---

## Frontend Setup

```bash
cd frontend

npm install
```

Start Frontend:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

---

## 🚀 How It Works

1. Upload a PDF resume.
2. Paste a job description.
3. Resume text is extracted from the PDF.
4. ATS score is calculated.
5. Matched and missing skills are identified.
6. Gemini AI generates personalized recommendations.
7. Results are displayed through an interactive dashboard.


---

## 🔮 Future Improvements

* Drag & Drop Resume Upload
* Downloadable PDF Reports
* Resume Analysis History
* Authentication & User Profiles
* Multiple Resume Comparisons
* Advanced ATS Scoring Algorithm
* Resume Version Tracking
* Dark Mode

---

## 🎓 Learning Outcomes

This project helped strengthen skills in:

* Full Stack Development
* REST API Development
* PostgreSQL Integration
* File Upload Handling
* PDF Parsing
* AI API Integration
* Frontend UI/UX Design
* State Management
* Deployment Workflows

---

## 👨‍💻 Author

**Vansh Thapa**

Computer Science Student | Aspiring Software Engineer

GitHub: https://github.com/vanshthapa04


---

⭐ If you found this project interesting, consider giving it a star.
