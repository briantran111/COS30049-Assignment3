# Flight Prediction API

This project implements a Flight Prediction API using FastAPI for the backend and React for the frontend.

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:
- **Python 3.7+**
- **Node.js** and **npm**

## Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```
2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the FastAPI server:**
   ```bash
   python -m backend.app.main
   ```

4. **Access the API documentation** (provided by FastAPI):
   - Open [http://localhost:8000/docs](http://localhost:8000/docs) for Swagger UI.
   - Open [http://localhost:8000/redoc](http://localhost:8000/redoc) for ReDoc.

### Available Endpoints

- **GET /**: Welcome message.
- **POST /api/findFlights**: Find available flights based on input criteria.
  - **Request Body**:
    ```json
    {
      "selectedDate": "YYYY-MM-DD",
      "startTime": "HH:MM",
      "endTime": "HH:MM",
      "selectedAirline": "AirlineName"
    }
    ```

  - **Response Example**:
    ```json
    {
      "message": "Flights found successfully!",
      "predicted_price": 250,
      "delay_prediction": "On Time",
      "input_data": {
        "selectedDate": "2024-11-14T00:00:00Z",
        "start_time": "2024-11-14T05:25:00Z",
        "end_time": "2024-11-14T08:40:00Z"
      }
    }
    ```

## Frontend Setup

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in development mode.The page will reload if you make edits. You may also see any lint errors in the console.

#### `npm test`

Launches the test runner in interactive watch mode.See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production in the `build` folder.It correctly bundles React in production mode and optimizes the build for best performance.

The build is minified, and filenames include hashes. Your app is ready for deployment.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note**: This is a one-way operation. Once you `eject`, you can’t go back!

If you aren’t satisfied with the build tool and configuration, you can `eject` to have full control. This will copy all configuration files and dependencies directly into your project. However, this is generally not recommended for smaller projects.

## Project Structure

```
.
├── backend                   # FastAPI backend
│   ├── app                   # Application files
│   ├── data                  # Data files (e.g., datasets, etc.)
│   ├── ml_models             # Machine learning models and related files
│   ├── scripts               # Scripts for data processing or model training
│   └── requirements.txt      # Python dependencies
└── frontend                  # React frontend
    ├── node_modules          # Node.js dependencies
    ├── public                # Public assets
    ├── src                   # Source code for React app
    └── package.json          # Node.js project metadata and scripts

## Deployment

To deploy the application, follow these steps:

### Backend Deployment

1. **Build the backend into a deployable package** (e.g., Dockerize or use a cloud service).
2. **Run with a production server** such as Uvicorn with Gunicorn.

Example with Uvicorn:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend Deployment

1. **Build the frontend for production**:
   ```bash
   npm run build
   ```

2. **Deploy the contents of the `build` folder** to a static hosting service, such as Netlify, Vercel, or a cloud storage service configured to host static files.

## Learn More

For additional information on the tools and libraries used in this project:

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Documentation](https://reactjs.org/)

## Troubleshooting

- **Backend not starting**: Ensure dependencies are installed and the correct environment is activated.
- **CORS Issues**: Configure CORS in FastAPI if accessing the backend from different origins. Add the following in `app.main`:
  ```python
  from fastapi.middleware.cors import CORSMiddleware

  app.add_middleware(
      CORSMiddleware,
      allow_origins=["*"],  # Or specify your frontend URL
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )
  ```
