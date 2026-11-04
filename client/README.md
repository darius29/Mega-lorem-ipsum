# Mega Lorem Ipsum — Frontend

A responsive records management application built with **React, Vite, JavaScript, and SCSS**.

This frontend communicates with a REST API to display and manage records through an interactive table and accessible modal dialogs.

## Tech Stack

- React
- Vite
- JavaScript (ES6+)
- SCSS / Sass
- Lucide React

## Features

### Records Table

- Seven columns: ID, Title, Category, Description, Status, Created At, and Actions
- Live search across record fields
- Ascending and descending column sorting
- Pagination with 20 records per page
- Category and status badges
- Formatted creation dates
- Edit and Delete action buttons

### CRUD Operations

- **Create:** Add new records using a modal form
- **Read:** Fetch and display records from the API
- **Update:** Edit existing records using prefilled form fields
- **Delete:** Remove records after explicit confirmation

### Modal Functionality

- Animated opening and closing
- Close using ESC, X, Cancel, or clicking outside
- Required-field validation with inline error messages
- Keyboard navigation and focus management
- Background scroll locking
- Shareable URLs for Create, Edit, and Delete
- Browser Back/Forward support

### User Interface

- Responsive layout with horizontally scrollable tables on smaller screens
- Reusable SCSS variables, mixins, and breakpoints
- Hover and keyboard focus states
- Custom SVG favicon
- No jQuery

## Getting Started

### Prerequisites

- Node.js and npm
- Backend API running on port `3001`

### Installation

From the project root:

```bash
cd client
npm install
```

### Development

```bash
npm run dev
```

Open:

**http://localhost:5173**

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## API Integration

The frontend communicates with the Express backend at:

`http://localhost:3001/api/records`

| Method | Endpoint           | Operation       |
| ------ | ------------------ | --------------- |
| GET    | `/api/records`     | Fetch records   |
| POST   | `/api/records`     | Create a record |
| PUT    | `/api/records/:id` | Update a record |
| DELETE | `/api/records/:id` | Delete a record |

The backend must be running for API operations to work.

## Shareable Modal URLs

| Modal  | Example                |
| ------ | ---------------------- |
| Create | `/?modal=create`       |
| Edit   | `/?modal=edit&id=15`   |
| Delete | `/?modal=delete&id=15` |

Edit and Delete require an existing record ID.

## Project Structure

```text
src/
├── components/
│   ├── Header/
│   ├── RecordsToolbar/
│   ├── RecordsTable/
│   ├── Pagination/
│   ├── RecordModal/
│   └── DeleteConfirmModal/
├── services/
│   └── records.api.js
├── styles/
│   ├── abstracts/
│   └── global.scss
├── App.jsx
└── main.jsx
```

## Accessibility

The application uses native HTML dialog elements, semantic table markup, accessible button labels, keyboard navigation, inline validation feedback, and focus restoration when modal dialogs are closed.

## Notes

The frontend is part of the Mega Lorem Ipsum full-stack technical assessment. Backend setup, database initialization, and automated backend testing are documented separately.
