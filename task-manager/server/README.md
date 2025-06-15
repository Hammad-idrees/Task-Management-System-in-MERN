# ✅ Task Manager API – Backend

This is the **backend server** for a full-featured **Task Manager Web Application**, developed using **Node.js**, **Express.js**, and **MongoDB**. It empowers users to manage personal or shared tasks with features like user authentication, real-time notifications, task prioritization, tagging, and data export in both CSV and PDF formats.

---

## 📌 Project Overview

The API provides:

- **User authentication** with secure JWT tokens.
- **Task CRUD operations** with support for tags, priorities, and due dates.
- **Automatic notifications** for tasks that are due soon or overdue.
- **Tag management** to categorize tasks.
- **Data export** capabilities in **CSV** and **PDF**.
- A scheduled **notification system** to alert users about critical deadlines.

---

## 🌐 Live Technologies Used

| Layer       | Technology                 |
| ----------- | -------------------------- |
| Server      | Node.js + Express.js       |
| Database    | MongoDB with Mongoose      |
| Auth        | JWT (JSON Web Token)       |
| Scheduling  | node-cron                  |
| File Export | pdfkit (PDF), csv-writer   |
| Validation  | express-validator          |
| Security    | helmet, cors, rate-limiter |
| Logging     | morgan                     |

---

## 🧾 API Features

### 🛡️ Authentication

- **Register/Login**
- Protected routes using **JWT middleware**
- Rate limiting to prevent brute-force attacks

### ✅ Task Management

- Create, update, delete, and toggle tasks
- Tasks have: `title`, `description`, `priority`, `dueDate`, `completed`, and `tags`
- Tasks can be shared (extendable)

### 🏷️ Tag System

- Users can create, update, and delete their own tags
- Tags can be attached to multiple tasks

### 📢 Notification System

- Notifications are created automatically when:
  - A task is **due within 24 hours** (`due_soon`)
  - A task is **overdue** (`overdue`)
- Notifications are scheduled to run every **5 minutes**
- Users can mark notifications as **read**

### 📤 Data Export

- Tasks can be exported to **CSV**
- Tasks can be exported to **PDF** with a formatted report

---

## 📂 Folder Structure
