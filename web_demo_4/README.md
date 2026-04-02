# Computer Lab Management

A simple React application for managing computer labs. Built with Vite.

## Features

- Display a list of computer labs in a table
- Add new labs via a popup modal with validation
- Filter labs by name or code
- Sidebar with LabMap placeholder
- Navigation menu

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

- `src/App.jsx` - Main application component
- `src/data.js` - Sample lab data
- `src/components/` - Reusable components
  - `LabMap.jsx` - Sidebar map component
  - `Navigation.jsx` - Top navigation
  - `Filter.jsx` - Search filter
  - `LabTable.jsx` - Labs table
  - `AddLabModal.jsx` - Add lab modal

## Validation

When adding a new lab:
- All fields are required
- Room code must be in format "PMxxx" (PM followed by 3 digits)
- Email must be valid

Errors are displayed below each input field.
