import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import satellites, passes

app = FastAPI(
    title="Satellite Tracking API",
    description="API for tracking satellites and predicting passes",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(satellites.router, prefix="/satellites", tags=["satellites"])
app.include_router(passes.router, prefix="/passes", tags=["passes"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Satellite Tracking API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)