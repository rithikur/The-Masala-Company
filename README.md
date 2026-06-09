# 🍛 The Masala Company

A modern web application built with **React** and **Vite** for fast development and optimized production builds.

## ✨ Features

- ⚡ **Lightning-fast development** with Vite HMR (Hot Module Replacement)
- ⚙️ **React 18+** with modern JavaScript support
- 🎨 **ESLint configuration** for code quality
- 📦 **Minimal setup** - get started quickly
- 🚀 **Production-ready** build optimization

## 🛠️ Tech Stack

- **React 18+** - A JavaScript library for building user interfaces
- **Vite** - Next generation frontend tooling
- **ESLint** - JavaScript linting for code quality

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/rithikur/The-Masala-Company.git
cd The-Masala-Company
```

2. Install dependencies
```bash
npm install
```

### Development

Run the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Create an optimized production build:

```bash
npm run build
```

### Preview

Preview the production build locally:

```bash
npm run preview
```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Build Tools

The project uses two official Vite plugins:

- **[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react)** - Uses [Oxc](https://oxc.rs) for fast transformation
- **[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react)** - Uses [SWC](https://swc.rs/) for alternative compilation

### ESLint Configuration

To enable TypeScript with type-aware lint rules for production applications:

Check the [Vite TypeScript template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for additional configuration options.

### React Compiler

The React Compiler is disabled by default to preserve dev and build performance. To enable it, refer to the [React Compiler installation guide](https://react.dev/learn/react-compiler/installation).

## 📁 Project Structure

```
The-Masala-Company/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
├── vite.config.js
├── .eslintrc.cjs
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Rithik Urs**

---

**Happy coding! 🚀**
