# Satellite Tracking Portal

A web application for tracking and visualizing satellites in real-time, providing orbital information, pass predictions, and visualization tools.

## Project Structure

The project follows a modern full-stack architecture:

- **Frontend**: Next.js application with React components
- **Backend**: FastAPI-based Python service that handles satellite data and calculations

## Getting Started

### Backend Setup

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Create a virtual environment (optional but recommended):

   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:

   ```
   pip install -r requirements.txt
   ```

4. Run the backend server:
   ```
   python main.py
   ```

The backend API will be available at http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

The frontend application will be available at http://localhost:3000

## Features

- Real-time satellite tracking
- Orbital visualization
- Pass prediction
- Location-based satellite finder

## Technologies

- **Frontend**: Next.js, React, Three.js (for 3D visualizations)
- **Backend**: FastAPI, SQLAlchemy, Skyfield (for orbital calculations)
- **Data Sources**: Space-Track API, Celestrak
