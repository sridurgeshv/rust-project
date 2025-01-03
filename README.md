# Productivity Hub
Welcome to Productivity Hub, a comprehensive web application designed to help users break down large tasks into manageable chunks, focusing on smaller tasks to achieve bigger goals efficiently. This tool is perfect for anyone looking to optimize their productivity by staying organized and concentrated on what matters most.

## Key Features
- **Dashboard Overview**: After authentication, users are directed to the dashboard, the central hub for accessing components like Calendar, Tasks, Comments, Links, and Tracking List.
- **Task Management**: The Tasks page enables users to input tasks, set deadlines, and prioritize them (Low, Medium, High), automatically updating the dashboard to keep users organized.
- **Calendar**: Shows the current date and integrates with Tasks for a visual overview of upcoming deadlines.
- **Comments Section**: A space for non-work-related thoughts or distractions, helping users maintain focus.
- **My Inventory**: A personalized section for saving and organizing URLs, reducing browser bookmark clutter.
- **Tracking List & Pomodoro Integration**: Features a Pomodoro timer (25 minutes work, 5-minute break) to boost productivity, with progress tracked in the Tracking List.
- **Music for Focus**: Offers various music categories—Relax, Focus, Energize, Sleep, and Meditate—to enhance work sessions.
- **Goals Page**: A section for listing and prioritizing goals, classified as Low, Medium, or High priority.
- **Bot Assistance**: A basic bot on the dashboard assists with simple tasks to improve user experience.

## Why Choose Productivity Hub?
Productivity Hub is more than just a task manager—it's a comprehensive productivity tool that helps users streamline their workflows, stay focused, and achieve their goals. Whether you need to manage tasks, store important links, track your work with Pomodoro, or simply jot down distracting thoughts, Productivity Hub has you covered.

## Installation Instructions
To use Productivity Hub locally, follow these steps:

### Clone the Repository
First, clone the repository from GitHub:
```bash
git clone https://github.com/sridurgeshv/rust-project.git
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
