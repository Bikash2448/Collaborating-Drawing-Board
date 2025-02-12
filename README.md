# 🎨 Real-Time Collaborative Drawing Board

A real-time collaborative drawing board that allows multiple users to draw together on the same canvas. It supports **desktop** and **mobile devices** and uses **Socket.IO** for live updates.

## 🚀 Features
✔ **Real-time drawing synchronization** between multiple users  
✔ **Supports mobile touch drawing** (Android & iOS)  
✔ **Color picker** to choose different pen colors  
✔ **Eraser tool** to remove drawings  
✔ **Clear canvas** button to reset the board for all users  
✔ **Responsive design** for different screen sizes  


🖥️ How It Works?
Users draw on the canvas
Drawing data is sent to the server via Socket.IO
Server broadcasts the data to all connected users
Other users' canvases update in real-time


🛠️ Technologies Used
Node.js + Express.js (Backend)
Socket.IO (Real-time communication)
HTML5 Canvas (Drawing board)
JavaScript
CSS3 (Styling)
