# Productivity Hub
Welcome to Productivity Hub, a comprehensive web application designed to help users break down large tasks into manageable chunks, focusing on smaller tasks to achieve bigger goals efficiently. This tool is perfect for anyone looking to optimize their productivity by staying organized and concentrated on what matters most.

## Key Features
- **Dashboard Overview**: Once authenticated, users are redirected to the dashboard, which serves as the control center. Here, users can access various components such as the Calendar, Tasks, Comments, Links Section, Tracking List, and more.
- **Task Management**: The dedicated Tasks page allows users to enter tasks, set deadlines, and prioritize them (Low, Medium, High). The dashboard automatically updates with this information, ensuring users stay on top of their to-do list.
- **Calendar**: Displays the current date and integrates with the Tasks feature, providing a visual overview of upcoming deadlines.
- **Comments Section**: A space for jotting down non-work-related thoughts or distractions. This helps users clear their minds and maintain focus on their tasks.
- **My Inventory**: A personalized links storage section where users can save and organize URLs without cluttering their browser bookmarks.
- **Tracking List & Pomodoro Integration**: The app includes a Pomodoro timer (25 minutes of work followed by a 5-minute break) to enhance concentration and productivity. Users can track their progress in the Tracking List, which syncs with the Pomodoro cycles.
- **Music for Focus**: Users can choose from various music categories—Relax, Focus, Energize, Sleep, and Meditate—to complement their work sessions.
- **Goals Page**: A dedicated section for listing and prioritizing goals. Users can classify their goals as Low, Medium, or High priority.
- **Bot Assistance**: A basic bot is available on the dashboard to assist with simple tasks and enhance user experience.

## Why Choose Productivity Hub?
Productivity Hub is more than just a task manager—it's a comprehensive productivity tool that helps users streamline their workflows, stay focused, and achieve their goals. Whether you need to manage tasks, store important links, track your work with Pomodoro, or simply jot down distracting thoughts, Productivity Hub has you covered.

## Installation Instructions
To use Productivity Hub locally, follow these steps:

### Clone the Repository
First, clone the repository from GitHub:
```bash
git clone <repository_link>
```

## Frontend Setup
1. Navigate to the frontend directory in your terminal.
```bash
cd taskaroo-dashboard
```

2. Install the required node modules:
```bash
npm install
export NODE_OPTIONS=--openssl-legacy-provider
```

3. Start the frontend application:
```bash
npm start
```

## Backend Setup
1. Install the rust and cargo from [Here](https://doc.rust-lang.org/cargo/getting-started/installation.html) on your local machine.
2. Navigate to the backend directory in another terminal.
```bash
cd taskbar-backend
```
3. Build the backend application:
```bash
cargo build
```
4. Start the backend server:
```bash
cargo run
```

### View the Application
Once both the frontend and backend are running, you can view the Productivity Hub in your browser by navigating to http://localhost:3000.

### Video Demo
To see Productivity Hub in action, check out our [video demonstration](https://www.youtube.com/watch?v=U2uQ5-py_RU&feature=youtu.be). The video provides an overview of the app's features and shows how to navigate and use the tool effectively.
