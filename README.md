# 🚀 Modern MERN Blog Platform

A high-performance, full-stack blogging ecosystem built to handle secure authentication, rich content creation, and optimized data delivery. This project was developed with a focus on solving common SPA challenges like SEO and bundle size management.

## 🛠️ Tech Stack

Frontend: React.js, Tailwind CSS, Redux Toolkit
Backend: Node.js, Express.js
Database: MongoDB (via Mongoose)
Storage: Cloudinary (Cloud-based image management)
Middleware: Multer (Multipart/form-data handling)
Authentication: JWT (Access & Refresh Token)

---

## ✨ Key Features & Technical Implementations

### 🔐 Advanced Authentication

Implemented a secure, stateless authentication flow using **JWT**.

- **Token Rotation:** Uses short-lived Access Tokens and long-lived Refresh Tokens to balance security and user experience.
- **Protected Routes:** Granular authorization levels for Users and Admins.

### ⚡ Performance Optimization

To ensure a "high-performance" experience, I moved beyond standard React patterns:

- **Lazy Loading & Code Splitting:** Implemented manual code-splitting to break down heavy bundles, significantly reducing Initial Page Load time.
- **Server-Side Logic:** Optimized data retrieval with server-side search, filtering, and pagination to keep the frontend snappy even with large datasets.

### 📝 Content Management

- **Rich Text Integration:** Integrated **React Quill** for a seamless "What You See Is What You Get" (WYSIWYG) editing experience.
- **Image Handling:** Secure uploads and optimized rendering for blog post thumbnails.
- **Admin Dashboard:** A dedicated interface for real-time content moderation and user management.

---

## 🚦 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB Atlas account or local MongoDB instance

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/mern-blog.git
    ```

2.  **Install dependencies for both folders:**

    ```bash
    # Install Backend deps
    npm install

    # Install Frontend deps
    cd client && npm install
    ```

3.  ** Server-Side Variables Environment Variables: (root/.env)**
    Create a `.env` file in the root directory:

# Server Configuration

```env
    PORT=5000
    NODE_ENV=development

    # Database
    # Format: mongodb+srv://<username>:<password>@cluster.mongodb.net/<db_name>
    MONGO_URI=mongodb+srv://your_username:your_password@cluster0.example.mongodb.net/mern-blog

    # Authentication (JWT)
    # Use long, random strings for secrets
    JWT_ACCESS_SECRET=your_jwt_access_token_secret_key
    JWT_REFRESH_SECRET=your_jwt_refresh_token_secret_key

    # Cloudinary (Media Management)
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Client-Side Variables (/client/.env)

```env
    VITE_FIREBASE_API_KEY="abcdefghijkll-abcdefghiJnmNByM"
```

5.  **Run the application:**
```bash
    npm run dev
```

---

## Future Improvements

- **Next.js Migration:** Currently exploring a transition to Next.js to implement Server-Side Rendering (SSR) for superior SEO.
- **Caching:** Implementing Redis for frequently accessed blog posts to further reduce database load.

---
