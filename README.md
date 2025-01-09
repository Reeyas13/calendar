# React Calendar Task Manager

A modern, responsive calendar application built with React that allows users to manage and track their tasks effectively. The application features a clean, intuitive interface with comprehensive task management capabilities.

## Features

- **Interactive Calendar Interface**
  - Monthly view with intuitive navigation
  - Visual indicators for days with tasks
  - Highlight for current day
  - Responsive design for all screen sizes

- **Task Management**
  - Add, view, and delete tasks for any date
  - Set task title, description, start time, and end time
  - Time conflict detection prevents overlapping tasks
  - Tasks are stored locally in the browser

- **Search & Export**
  - Search functionality to quickly find specific tasks
  - Export all tasks to CSV format for backup or analysis
  - Real-time search filtering across all tasks

- **User-Friendly Interface**
  - Modal dialog for task management
  - Clean and intuitive design
  - Responsive layout adapts to different screen sizes
  - Visual feedback for user interactions

## Technologies Used

- React
- Tailwind CSS
- shadcn/ui components
- Local Storage for data persistence
- Lucide React for icons

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Reeyas13/calendar.git
cd calendar
```

2. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or your configured port).

## Building for Production

To create a production build:

```bash
npm run build
```

## Deployment

The application is deployed and accessible at: `https://calendar-beta-ashen-88.vercel.app`

## Usage

1. **Navigate the Calendar**
   - Use the "Previous" and "Next" buttons to change months
   - Click on any date to manage tasks for that day

2. **Managing Tasks**
   - Click on any date to open the task management modal
   - Fill in the task details (title, description, start time, end time)
   - Click "Add Task" to save
   - Delete tasks using the X icon

3. **Search and Export**
   - Use the search bar to filter tasks across all dates
   - Click the "Export CSV" button to download all tasks in CSV format



