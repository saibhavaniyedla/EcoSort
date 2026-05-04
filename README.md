# ECOSORT – SMART WASTE SEGREGATION SYSTEM

EcoSort is a sophisticated, full-stack environmental management application designed to bridge the gap between waste generation and sustainable disposal. It utilizes advanced AI models to provide real-time sorting guidance, detailed material analysis, and interactive eco-education.

## 🚀 How to Execute the Project

Follow these steps to get the project running locally on your machine.

### Prerequisites

- **Node.js**: Ensure you have Node.js (v18 or higher) installed.
- **NPM**: Standard package manager that comes with Node.js.
- **Gemini API Key**: You will need a Google Gemini API key to power the AI features. You can obtain one from the [Google AI Studio](https://aistudio.google.com/).

### Installation & Setup

1. **Clone the Project**:
   ```bash
   # Clone the repository (or download the source)
   cd ecosort
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

5. **Access the App**:
   Open your browser and navigate to `http://localhost:3000`.

---

## 🌐 Website Information & Features

EcoSort is built as a Single Page Application (SPA) with a mobile-first, high-performance architecture.

### Core Modules

1. **Dashboard (Home)**:
   - Visual overview of waste management categories (Recyclable, Dry, Wet).
   - Real-time impact tracking (Carbon offset, Items sorted).
   - Rotating sustainability tips and "Eco-Missions."

2. **Smart Scanner**:
   - High-precision image analysis for waste identification.
   - Provides confidence scores, material detection, and specific disposal instructions.
   - Calculates potential carbon offset and rewards users with "Eco Points."

3. **Sorting Game**:
   - An interactive mini-game designed to test and improve sorting speed and accuracy.

4. **Eco-Assistant (AI Chat)**:
   - A dedicated AI chat interface for complex sustainability questions.

---

## 🧠 API Usage & Integration

The intelligence of EcoSort is powered primarily by the **Google Gemini API** (`@google/genai`).

| Feature | API / Model | Purpose |
| :--- | :--- | :--- |
| **Scanner Analysis** | `gemini-3-flash-preview` | **Vision & Classification**: Processes uploaded images to identify the item, determine the material, and suggest the correct bin type using a JSON-structured response. |
| **Eco-Assistant** | `gemini-3-flash-preview` | **Conversational AI**: Handles natural language queries about recycling, composting, and local waste management practices. |
| **Icons** | `Lucide React` | Provides a consistent, vector-based visual language for the UI. |
| **Animations** | `Motion` | Powers smooth state transitions, micro-interactions, and the sorting game animations. |

## 🛠 Tech Stack

- **Framework**: React 19 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **Animation**: Motion (motion/react)
- **Icons**: Lucide React
- **Client SDK**: Google Generative AI SDK

---

## 📈 Project Motivation

EcoSort aims to reduce contamination in recycling streams by providing users with instant, accurate, and actionable data at the moment of disposal.
