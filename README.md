# Echo – Share Your World 🌍

A full-featured social media web application built with the MERN stack, enabling users to share posts, connect with others, chat in real-time, and even initiate one-on-one video/audio calls.

> 🔗 **Live Demo**: *(Add your deployed frontend link here)*  
> 🖥️ **Backend Repository**: [Echo-Backend](https://github.com/akashkhedar/Echo-Backend)

---

## 🚀 Features

- 🔐 **User Authentication**
  - Register, Login, Logout
  - JWT-based session management
- 📝 **Post Feed**
  - Create, delete, and like posts
  - View posts from followed users in real time
- 👥 **User Profiles**
  - Follow/unfollow users
  - View personal and others' profiles
- 💬 **Real-Time Chat**
  - One-on-one messaging using Socket.IO
  - Chat history persists via backend APIs
- 🎥 **Video/Audio Calling**
  - Peer-to-peer video/audio calls via WebRTC
  - Toggle camera and mic, with signaling over Socket.IO
- 📷 **Media Uploads**
  - Upload images and media with Cloudinary
- 🎨 **Responsive UI**
  - Built with Material-UI (MUI), works across devices

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Material-UI (MUI)
- **State Management**: React Context API
- **Real-Time Communication**: Socket.IO
- **Media Uploads**: Cloudinary
- **Calling Feature**: WebRTC
- **API Testing**: Postman

---

## 📁 Folder Structure
src/<br>
  ├── assets/<br>
  ├── components/<br>
  ├── context/<br>
  ├── pages/<br>
  ├── utils/<br>
  └── App.jsx

---

## 🧩 Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/akashkhedar/Echo-Frontend.git
cd Echo-Frontend
```

2. Install dependencies
```bash
npm install
```
3. Run the frontend
```bash
npm run start
```
