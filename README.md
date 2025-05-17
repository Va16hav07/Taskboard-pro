
```markdown
# Taskboard Pro

A modern project management and collaboration platform designed to help teams organize, track, and manage their tasks efficiently with real-time updates and workflow automation.

![Taskboard Pro Dashboard](https://example.com/dashboard-screenshot.png)

## Introduction

Taskboard Pro is a full-stack task management application built with React, Node.js, Express, and MongoDB. It enables teams to collaborate on projects, manage tasks using a Kanban-style board, communicate via comments, and automate workflows for improved productivity.

The application offers a responsive UI that works across all devices, real-time updates via WebSockets, customizable workflows with automation rules, and detailed analytics to track project progress.

## Features

### Project Management
- **Project Creation & Organization**: Create new projects, add descriptions, and organize work.
- **Customizable Statuses**: Define your own workflow stages (To Do, In Progress, Review, Done, etc.).
- **Team Collaboration**: Invite team members to projects and assign different roles (owner, member).

### Task Management
- **Kanban Board View**: Drag-and-drop interface for managing tasks across different statuses.
- **Task Details**: Title, description, assignee, due date, priority levels, and urgency flags.
- **Comments & Discussions**: Threaded comments on tasks to facilitate team communication.
- **Task Assignments**: Assign tasks to team members with email notifications.

### User Experience
- **Real-time Updates**: See changes to tasks and comments instantly via WebSocket integration.
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices.
- **Notifications**: In-app notifications for task assignments, mentions, and status changes.
- **Dark Mode Support**: Interface adapts to system preferences for better visibility.

### Workflow Automation
- **Custom Automation Rules**: Create "if this, then that" style automations.
- **Trigger Types**: Status change, assignment change, and due date passed triggers.
- **Action Types**: Move tasks, assign badges, and send notifications automatically.
- **Achievement Badges**: Gamification elements to reward productivity.

### Security & Access Control
- **Authentication**: Secure user authentication with Firebase.
- **Role-Based Access**: Different permissions for project owners vs. members.
- **Data Protection**: Encrypted data storage and secure API endpoints.

## API Documentation

### Authentication

All API endpoints (except registration/login) require authentication via a Bearer token in the Authorization header.

```
Authorization: Bearer <your-jwt-token>
```

### Projects API

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/api/projects` | GET | Get all projects for current user | - | Array of project objects |
| `/api/projects` | POST | Create a new project | `{title, description}` | Created project object |
| `/api/projects/:projectId` | GET | Get a specific project | - | Project object |
| `/api/projects/:projectId` | PUT | Update a project | `{title, description}` | Updated project object |
| `/api/projects/:projectId` | DELETE | Delete a project | - | Success message |
| `/api/projects/:projectId/invite` | POST | Invite user to project | `{email}` | Success message |
| `/api/projects/:projectId/members/:userId` | DELETE | Remove user from project | - | Success message |

### Tasks API

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/api/tasks` | POST | Create a new task | `{title, description, projectId, status, assignee, dueDate, priority, isUrgent}` | Created task object |
| `/api/tasks/project/:projectId` | GET | Get all tasks for a project | - | Array of task objects |
| `/api/tasks/user/assigned` | GET | Get tasks assigned to current user | - | Array of task objects |
| `/api/tasks/:taskId` | GET | Get a specific task | - | Task object |
| `/api/tasks/:taskId` | PUT | Update a task | Task fields to update | Updated task object |
| `/api/tasks/:taskId/status` | PATCH | Update task status | `{status}` | Updated task object |
| `/api/tasks/:taskId` | DELETE | Delete a task | - | Success message |
| `/api/tasks/project/:projectId/statuses` | PUT | Update project statuses | `{statuses: []}` | Updated project object |

### Comments API

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/api/comments` | POST | Create a comment | `{taskId, content}` | Created comment object |
| `/api/comments/task/:taskId` | GET | Get comments for a task | - | Array of comment objects |
| `/api/comments/:commentId` | DELETE | Delete a comment | - | Success message |

### Automations API

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/api/automations` | POST | Create automation rule | Automation object | Created automation object |
| `/api/automations/project/:projectId` | GET | Get automations for project | - | Array of automation objects |
| `/api/automations/:automationId` | PUT | Update automation | Automation fields | Updated automation object |
| `/api/automations/:automationId` | DELETE | Delete automation | - | Success message |
| `/api/automations/badges` | GET | Get user badges | - | Array of badge objects |
| `/api/automations/notifications` | GET | Get user notifications | - | Array of notification objects |

## Database Schema

### Project Collection

```
Project {
  _id: ObjectId,
  title: String,
  description: String,
  createdBy: String (Firebase UID),
  members: [
    {
      userId: String (Firebase UID),
      email: String,
      role: String (enum: ['owner', 'member']),
      name: String,
      joinedAt: Date
    }
  ],
  statuses: [String] (default: ['To Do', 'In Progress', 'Done']),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Collection

```
Task {
  _id: ObjectId,
  title: String,
  description: String,
  projectId: ObjectId (ref: Project),
  status: String,
  assignee: {
    userId: String (Firebase UID),
    email: String,
    name: String
  },
  dueDate: Date,
  isUrgent: Boolean,
  priority: String (enum: ['', 'low', 'medium', 'high']),
  createdBy: String (Firebase UID),
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Collection

```
Comment {
  _id: ObjectId,
  taskId: ObjectId (ref: Task),
  projectId: ObjectId (ref: Project),
  content: String,
  author: {
    userId: String (Firebase UID),
    name: String,
    email: String,
    photoURL: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Automation Collection

```
Automation {
  _id: ObjectId,
  projectId: ObjectId (ref: Project),
  name: String,
  isActive: Boolean,
  trigger: {
    type: String (enum: ['STATUS_CHANGE', 'ASSIGNMENT_CHANGE', 'DUE_DATE_PASSED']),
    fromStatus: String,     // For STATUS_CHANGE
    toStatus: String,       // For STATUS_CHANGE
    assigneeEmail: String   // For ASSIGNMENT_CHANGE
  },
  action: {
    type: String (enum: ['MOVE_TASK', 'ASSIGN_BADGE', 'SEND_NOTIFICATION']),
    targetStatus: String,           // For MOVE_TASK
    badgeName: String,              // For ASSIGN_BADGE
    notificationText: String,       // For SEND_NOTIFICATION
    notifyAssignee: Boolean,        // For SEND_NOTIFICATION
    notifyCreator: Boolean,         // For SEND_NOTIFICATION
    notifyProjectOwners: Boolean    // For SEND_NOTIFICATION
  },
  createdBy: String (Firebase UID),
  createdAt: Date,
  updatedAt: Date
}
```

### Badge Collection

```
Badge {
  _id: ObjectId,
  userId: String (Firebase UID),
  name: String,
  description: String,
  projectId: ObjectId (ref: Project),
  taskId: ObjectId (ref: Task),
  automationId: ObjectId (ref: Automation),
  awardedAt: Date
}
```

### Notification Collection

```
Notification {
  _id: ObjectId,
  userId: String (Firebase UID),
  type: String (enum: ['TASK_ASSIGNED', 'TASK_UPDATED', 'COMMENT_ADDED', 'AUTOMATION_TRIGGERED']),
  title: String,
  content: String,
  relatedProjectId: ObjectId (ref: Project),
  relatedTaskId: ObjectId (ref: Task),
  isRead: Boolean,
  createdAt: Date
}
```

## Database Schema Diagram

```
┌──────────────────────┐       ┌──────────────────────┐
│       Project        │       │        Task          │
├──────────────────────┤       ├──────────────────────┤
│ _id                  │       │ _id                  │
│ title                │       │ title                │
│ description          │       │ description          │
│ createdBy            │       │ projectId ───────────┼─────>
│ members []           │       │ status               │
│ statuses []          │       │ assignee {           │
│ createdAt            │       │   userId, email, name│
│ updatedAt            │       │ }                    │
└───────┬──────────────┘       │ dueDate              │
        │                      │ isUrgent             │
        │                      │ priority             │
        │                      │ createdBy            │
        │                      │ createdAt            │
        │                      │ updatedAt            │
        │                      └────────┬─────────────┘
        ▼                               │
┌──────────────────────┐               │
│     Automation       │               │
├──────────────────────┤               │
│ _id                  │               │
│ projectId ───────────┼─────>         │
│ name                 │               ▼
│ isActive             │       ┌──────────────────────┐
│ trigger {}           │       │      Comment         │
│ action {}            │       ├──────────────────────┤
│ createdBy            │       │ _id                  │
│ createdAt            │       │ taskId ──────────────┼─────>
│ updatedAt            │       │ projectId ───────────┼─────>
└───────┬──────────────┘       │ content              │
        │                      │ author {}            │
        │                      │ createdAt            │
        │                      │ updatedAt            │
        ▼                      └──────────────────────┘
┌──────────────────────┐
│       Badge          │
├──────────────────────┤
│ _id                  │
│ userId               │
│ name                 │
│ description          │
│ projectId ───────────┼─────>
│ taskId ──────────────┼─────>
│ automationId ────────┼─────>
│ awardedAt            │
└──────────────────────┘

┌──────────────────────┐
│    Notification      │
├──────────────────────┤
│ _id                  │
│ userId               │
│ type                 │
│ title                │
│ content              │
│ relatedProjectId ────┼─────>
│ relatedTaskId ───────┼─────>
│ isRead               │
│ createdAt            │
└──────────────────────┘
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Firebase account for authentication

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/taskboard-pro.git
cd taskboard-pro
```

2. Install dependencies for both frontend and backend
```bash
# Backend dependencies
cd Backend
npm install

# Frontend dependencies
cd ../Frontend
npm install
```

3. Create environment files
```bash
# In the Backend folder
touch .env

# In the Frontend folder
touch .env
```

4. Set up environment variables

Backend (.env):
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FIREBASE_CONFIG=your_firebase_config
FRONTEND_URL=http://localhost:5173
```

Frontend (.env):
```
VITE_API_URL=http://localhost:3000/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
```

5. Start the development servers

```bash
# Backend
cd Backend
npm run dev

# Frontend (in another terminal)
cd Frontend
npm run dev
```

The frontend will be available at http://localhost:5173 and the backend API at http://localhost:3000.

## License

[MIT License](LICENSE)

## Contributors

- [Your Name](https://github.com/yourusername)
```

This README includes:

1. Project introduction with an overview of Taskboard Pro
2. Comprehensive features list organized by category
3. API documentation with endpoints, methods, and descriptions
4. Detailed database schema with collections and fields
5. Visual database schema diagram showing relationships
6. Installation instructions and prerequisites

The database schema section is particularly thorough, showing the structure and relationships between collections, which should help developers understand how the application is organized.

Made changes.

Va16hav07: add all of this in Readme file

GitHub Copilot: Copilot took too long to get ready. Please review the guidance in the Chat view.

Va16hav07: - Clear README:
 - Project intro
 - Features list
 - API documentation
 - Database schema diagrams (mandatory)

 add all of the things in Readme

GitHub Copilot: I'll complete the README.md file with the database schema diagrams and the remaining content that was cut off.

Let me finish the README with proper database schema diagrams and all required sections:

```markdown
# Taskboard Pro

A modern project management and collaboration platform designed to help teams organize, track, and manage their tasks efficiently with real-time updates and workflow automation.

![Taskboard Pro Dashboard](https://example.com/dashboard-screenshot.png)

## Introduction

Taskboard Pro is a full-stack task management application built with React, Node.js, Express, and MongoDB. It enables teams to collaborate on projects, manage tasks using a Kanban-style board, communicate via comments, and automate workflows for improved productivity.

The application offers a responsive UI that works across all devices, real-time updates via WebSockets, customizable workflows with automation rules, and detailed analytics to track project progress.

## Features

### Project Management
- **Project Creation & Organization**: Create new projects, add descriptions, and organize work.
- **Customizable Statuses**: Define your own workflow stages (To Do, In Progress, Review, Done, etc.).
- **Team Collaboration**: Invite team members to projects and assign different roles (owner, member).

### Task Management
- **Kanban Board View**: Drag-and-drop interface for managing tasks across different statuses.
- **Task Details**: Title, description, assignee, due date, priority levels, and urgency flags.
- **Comments & Discussions**: Threaded comments on tasks to facilitate team communication.
- **Task Assignments**: Assign tasks to team members with email notifications.

### User Experience
- **Real-time Updates**: See changes to tasks and comments instantly via WebSocket integration.
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices.
- **Notifications**: In-app notifications for task assignments, mentions, and status changes.
- **Dark Mode Support**: Interface adapts to system preferences for better visibility.

### Workflow Automation
- **Custom Automation Rules**: Create "if this, then that" style automations.
- **Trigger Types**: Status change, assignment change, and due date passed triggers.
- **Action Types**: Move tasks, assign badges, and send notifications automatically.
- **Achievement Badges**: Gamification elements to reward productivity.

### Security & Access Control
- **Authentication**: Secure user authentication with Firebase.
- **Role-Based Access**: Different permissions for project owners vs. members.
- **Data Protection**: Encrypted data storage and secure API endpoints.

## API Documentation

### Authentication

All API endpoints (except registration/login) require authentication via a Bearer token in the Authorization header.

```
Authorization: Bearer <your-jwt-token>
```

### Projects API

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/api/projects` | GET | Get all projects for current user | - | Array of project objects |
| `/api/projects` | POST | Create a new project | `{title, description}` | Created project object |
| `/api/projects/:projectId` | GET | Get a specific project | - | Project object |
| `/api/projects/:projectId` | PUT | Update a project | `{title, description}` | Updated project object |
| `/api/projects/:projectId` | DELETE | Delete a project | - | Success message |
| `/api/projects/:projectId/invite` | POST | Invite user to project | `{email}` | Success message |
| `/api/projects/:projectId/members/:userId` | DELETE | Remove user from project | - | Success message |

### Tasks API

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/api/tasks` | POST | Create a new task | `{title, description, projectId, status, assignee, dueDate, priority, isUrgent}` | Created task object |
| `/api/tasks/project/:projectId` | GET | Get all tasks for a project | - | Array of task objects |
| `/api/tasks/user/assigned` | GET | Get tasks assigned to current user | - | Array of task objects |
| `/api/tasks/:taskId` | GET | Get a specific task | - | Task object |
| `/api/tasks/:taskId` | PUT | Update a task | Task fields to update | Updated task object |
| `/api/tasks/:taskId/status` | PATCH | Update task status | `{status}` | Updated task object |
| `/api/tasks/:taskId` | DELETE | Delete a task | - | Success message |
| `/api/tasks/project/:projectId/statuses` | PUT | Update project statuses | `{statuses: []}` | Updated project object |

### Comments API

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/api/comments` | POST | Create a comment | `{taskId, content}` | Created comment object |
| `/api/comments/task/:taskId` | GET | Get comments for a task | - | Array of comment objects |
| `/api/comments/:commentId` | DELETE | Delete a comment | - | Success message |

### Automations API

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|-------------|----------|
| `/api/automations` | POST | Create automation rule | Automation object | Created automation object |
| `/api/automations/project/:projectId` | GET | Get automations for project | - | Array of automation objects |
| `/api/automations/:automationId` | PUT | Update automation | Automation fields | Updated automation object |
| `/api/automations/:automationId` | DELETE | Delete automation | - | Success message |
| `/api/automations/badges` | GET | Get user badges | - | Array of badge objects |
| `/api/automations/notifications` | GET | Get user notifications | - | Array of notification objects |

## Database Schema

### Project Collection

```json
{
  "_id": "ObjectId",
  "title": "String",
  "description": "String",
  "createdBy": "String (Firebase UID)",
  "members": [
    {
      "userId": "String (Firebase UID)",
      "email": "String",
      "role": "String (owner/member)",
      "name": "String",
      "joinedAt": "Date"
    }
  ],
  "statuses": ["String", "String", "..."],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Task Collection

```json
{
  "_id": "ObjectId",
  "title": "String",
  "description": "String",
  "projectId": "ObjectId (ref: Project)",
  "status": "String",
  "assignee": {
    "userId": "String (Firebase UID)",
    "email": "String",
    "name": "String"
  },
  "dueDate": "Date",
  "isUrgent": "Boolean",
  "priority": "String (low/medium/high)",
  "createdBy": "String (Firebase UID)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Comment Collection

```json
{
  "_id": "ObjectId",
  "taskId": "ObjectId (ref: Task)",
  "projectId": "ObjectId (ref: Project)",
  "content": "String",
  "author": {
    "userId": "String (Firebase UID)",
    "name": "String",
    "email": "String",
    "photoURL": "String"
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Automation Collection

```json
{
  "_id": "ObjectId",
  "projectId": "ObjectId (ref: Project)",
  "name": "String",
  "isActive": "Boolean",
  "trigger": {
    "type": "String (STATUS_CHANGE/ASSIGNMENT_CHANGE/DUE_DATE_PASSED)",
    "fromStatus": "String",
    "toStatus": "String",
    "assigneeEmail": "String"
  },
  "action": {
    "type": "String (MOVE_TASK/ASSIGN_BADGE/SEND_NOTIFICATION)",
    "targetStatus": "String",
    "badgeName": "String",
    "notificationText": "String",
    "notifyAssignee": "Boolean",
    "notifyCreator": "Boolean",
    "notifyProjectOwners": "Boolean"
  },
  "createdBy": "String (Firebase UID)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Badge Collection

```json
{
  "_id": "ObjectId",
  "userId": "String (Firebase UID)",
  "name": "String",
  "description": "String",
  "projectId": "ObjectId (ref: Project)",
  "taskId": "ObjectId (ref: Task)",
  "automationId": "ObjectId (ref: Automation)",
  "awardedAt": "Date"
}
```

### Notification Collection

```json
{
  "_id": "ObjectId",
  "userId": "String (Firebase UID)",
  "type": "String (TASK_ASSIGNED/TASK_UPDATED/COMMENT_ADDED/AUTOMATION_TRIGGERED)",
  "title": "String",
  "content": "String",
  "relatedProjectId": "ObjectId (ref: Project)",
  "relatedTaskId": "ObjectId (ref: Task)",
  "isRead": "Boolean",
  "createdAt": "Date"
}
```

## Database Schema Diagram

```
┌──────────────────────┐       ┌──────────────────────┐
│       Project        │       │        Task          │
├──────────────────────┤       ├──────────────────────┤
│ _id                  │       │ _id                  │
│ title                │       │ title                │
│ description          │       │ description          │
│ createdBy            │       │ projectId ───────────┼─────>
│ members []           │       │ status               │
│ statuses []          │       │ assignee {           │
│ createdAt            │       │   userId, email, name│
│ updatedAt            │       │ }                    │
└───────┬──────────────┘       │ dueDate              │
        │                      │ isUrgent             │
        │                      │ priority             │
        │                      │ createdBy            │
        │                      │ createdAt            │
        │                      │ updatedAt            │
        │                      └────────┬─────────────┘
        ▼                               │
┌──────────────────────┐               │
│     Automation       │               │
├──────────────────────┤               │
│ _id                  │               │
│ projectId ───────────┼─────>         │
│ name                 │               ▼
│ isActive             │       ┌──────────────────────┐
│ trigger {}           │       │      Comment         │
│ action {}            │       ├──────────────────────┤
│ createdBy            │       │ _id                  │
│ createdAt            │       │ taskId ──────────────┼─────>
│ updatedAt            │       │ projectId ───────────┼─────>
└───────┬──────────────┘       │ content              │
        │                      │ author {}            │
        │                      │ createdAt            │
        │                      │ updatedAt            │
        ▼                      └──────────────────────┘
┌──────────────────────┐
│       Badge          │
├──────────────────────┤
│ _id                  │
│ userId               │
│ name                 │
│ description          │
│ projectId ───────────┼─────>
│ taskId ──────────────┼─────>
│ automationId ────────┼─────>
│ awardedAt            │
└──────────────────────┘

┌──────────────────────┐
│    Notification      │
├──────────────────────┤
│ _id                  │
│ userId               │
│ type                 │
│ title                │
│ content              │
│ relatedProjectId ────┼─────>
│ relatedTaskId ───────┼─────>
│ isRead               │
│ createdAt            │
└──────────────────────┘
```

## Entity Relationship Diagram (ERD)

```
Project 1──┐
           │
           │ n
           ▼
Task 1─────┬────────┐
           │        │
           │        │ n
   1       │ n      ▼
Automation ◄──── Badge
           │
           │ n
           ▼
        Comment

           n
Project ◄─────┐
           │  │
           │  │ 1
Task ◄─────┘  │
           │  │
           │  │
Comment ◄──┘  │
              │
Notification ◄┘
```

## System Architecture

```
┌─────────────────┐          ┌─────────────────┐          ┌─────────────────┐
│                 │          │                 │          │                 │
│  React Frontend │◄────────►│  Express API    │◄────────►│   MongoDB       │
│                 │  HTTP    │                 │          │   Database      │
│  (Vite)         │  REST    │  (Node.js)      │          │                 │
│                 │          │                 │          │                 │
└────────┬────────┘          └────────┬────────┘          └─────────────────┘
         │                            │
         │                            │
         ▼                            ▼
┌─────────────────┐          ┌─────────────────┐
│                 │          │                 │
│  WebSocket      │◄────────►│  Socket.io      │
│  Connection     │  Real-   │  Server         │
│  (Client)       │  time    │                 │
│                 │  Events  │                 │
└─────────────────┘          └─────────────────┘


┌─────────────────┐
│                 │
│    Firebase     │
│  Authentication │
│                 │
└─────────────────┘
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Firebase account for authentication

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/taskboard-pro.git
cd taskboard-pro
```

2. Install dependencies for both frontend and backend
```bash
# Backend dependencies
cd Backend
npm install

# Frontend dependencies
cd ../Frontend
npm install
```

3. Create environment files
```bash
# In the Backend folder
touch .env

# In the Frontend folder
touch .env
```

4. Set up environment variables

Backend (.env):
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FIREBASE_CONFIG=your_firebase_config
FRONTEND_URL=http://localhost:5173
```

Frontend (.env):
```
VITE_API_URL=http://localhost:3000/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
```

5. Start the development servers

```bash
# Backend
cd Backend
npm run dev

# Frontend (in another terminal)
cd Frontend
npm run dev
```

The frontend will be available at http://localhost:5173 and the backend API at http://localhost:3000.

## License

[MIT License](LICENSE)

## Contributors

- [Vaibhav](https://github.com/vaibhav)
```

Made changes.

Similar code found with 2 license types