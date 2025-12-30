📘 Smart Issue Board
📝 Project Description

Smart Issue Board is a simple issue-tracking web application that allows authenticated users to create, view, and manage issues in a structured way.

The goal of this project is to demonstrate practical problem-solving, basic workflow rules, and Firestore data modeling, rather than building a complex system.

Users can report issues with a title, description, priority, and assignee.
The app also includes lightweight safeguards such as duplicate issue detection and controlled status transitions.

🚀 What This App Does

Users can sign up and log in using email and password

Logged-in users can create issues

Each issue includes:

Title

Description

Priority (Low / Medium / High)

Status (Open / In Progress / Done)

Assigned To

Created By and Created Time

The app checks for similar issues before saving a new one to reduce duplicates

Issues can be filtered by status and priority

Issues follow a real-world workflow rule:

An issue cannot move directly from Open → Done

All data is stored securely in Firebase Firestore

The app is deployed and usable in production

🛠️ Tech Stack

Frontend: Next.js (React)

Styling: Tailwind CSS

Authentication: Firebase Authentication (Email/Password)

Database: Firebase Firestore

Hosting: Vercel

Code Hosting: Public GitHub Repository

📊 Firestore Data Structure

Issues are stored in a single issues collection with fields such as:

title

description

priority

status

assignedTo

createdBy

createdAt

This structure keeps the data model simple and easy to query.

🧠 Similar Issue Handling

Before creating a new issue, the app checks existing issues for similar titles or descriptions.
If a similar issue is found, the user is warned before proceeding.
This helps avoid duplicate issues while still allowing flexibility.

⚠️ Status Rules

To reflect real development workflows:

Issues must move from Open → In Progress → Done

Direct transitions from Open → Done are not allowed

A friendly message is shown if an invalid transition is attempted

🔍 Challenges & Learnings

Designing a simple but practical Firestore schema

Handling ambiguous requirements for “similar issues”

Enforcing business rules without over-engineering

🔮 Future Improvements

Better similarity detection using NLP

Role-based access (admin / user)

Comments on issues

Pagination for large issue lists