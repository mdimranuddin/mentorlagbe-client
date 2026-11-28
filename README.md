# MentorLagbe – Smart Tuition & Mentorship Platform

Students find approved tutors by subject, class and mode. Tutors post tuitions and manage applicants.
Admins approve posts, manage roles and track Stripe revenue.

- **Live site:** https://mentorlagbe-client-nu.vercel.app
- **API (server):** https://mentorlagbe-server-nine-ivory.vercel.app
- **Client repo:** https://github.com/mdimranuddin/mentorlagbe-client  |  **Server repo:** https://github.com/mdimranuddin/mentorlagbe-server
- **Admin:** admin@test.com / Test1234  |  **Tutor:** tutor@test.com / Test1234  |  **Student:** student@test.com / Test1234

## Features
- Role-based auth (Student, Tutor, Admin) with Better Auth + JWT, role checks on the Express API too
- Tutors post tuitions with an ImgBB banner. Admin approves or rejects before they go public
- Browse tuitions: server-side search, filters (subject, class, mode), sorting and pagination
- Students apply once per tuition and track status. Tutors accept or reject applicants
- Pro plans with Stripe Checkout (Tutor $15: unlimited posts and verified badge, Student $10: priority booking)
- Dark and light theme, responsive layout, loading, empty and error states

## Tech
Next.js (App Router, TypeScript), Tailwind CSS, Better Auth, Express, MongoDB, Stripe, ImgBB, Sonner, Lucide

## Collections
users, tuitions, applications, payments

## Run locally
Server: cd server && npm install && cp .env.example .env && npm run seed && npm run dev
Client: cd client && npm install && cp .env.example .env.local && npm run dev
Make an admin: sign up, then `cd server && npm run make-admin -- your@email.com`

## Server API
| Who | Endpoint |
|---|---|
| Public | GET /api/tuitions, GET /api/tuitions/:id, GET /api/stats/public |
| Any user | GET/PATCH /api/users/me |
| Student | POST /api/applications, GET /api/applications/my, DELETE /api/applications/:id, GET /api/stats/student |
| Tutor | POST/PATCH/DELETE /api/tuitions, PATCH /api/tuitions/:id/toggle, GET /api/tuitions/mine/list, GET /api/applications/tutor, PATCH /api/applications/:id/status, GET /api/stats/tutor |
| Admin | GET /api/users, PATCH /api/users/:id/role, GET /api/tuitions/admin/all, PATCH /api/tuitions/:id/status, GET /api/subscription/payments, GET /api/stats/admin |
| Tutor + Student | POST /api/subscription/activate (verifies the payment with Stripe) |

## Environment variables
See `.env.example` in both folders. Never commit real keys.
