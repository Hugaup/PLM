"""
FastAPI server to serve React Flow component
Handles communication between Streamlit and React Flow
"""

from fastapi import FastAPI
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import pandas as pd

app = FastAPI(title="AirPlus Workflow API")

# Enable CORS for Streamlit integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to the React Flow HTML file
WORKFLOW_HTML = Path(__file__).parent / "react_flow" / "workflow.html"


@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "AirPlus Workflow API", "status": "running"}


@app.get("/workflow")
async def get_workflow():
    """Serve the React Flow HTML page"""
    if WORKFLOW_HTML.exists():
        return FileResponse(WORKFLOW_HTML, media_type="text/html")
    return JSONResponse({"error": "Workflow file not found"}, status_code=404)


@app.get("/api/workflow-data")
async def get_workflow_data():
    """
    Get workflow data from analysis results
    This endpoint can be called by React Flow to get real-time data
    """
    try:
        # Try to load analysis results
        results_path = Path(__file__).parent / "data" / "AirPlus_Analysis_Results.xlsx"
        
        if results_path.exists():
            df = pd.read_excel(results_path)
            
            # Calculate metrics
            total_operations = len(df)
            total_cost = df['Coût total (€)'].sum() if 'Coût total (€)' in df.columns else 0
            total_delays = df['Retard (h)'].sum() if 'Retard (h)' in df.columns else 0
            
            # Group by poste if available
            poste_data = {}
            if 'Poste' in df.columns:
                poste_summary = df.groupby('Poste').agg({
                    'Coût total (€)': 'sum',
                    'Retard (h)': 'sum'
                }).to_dict('index')
                poste_data = {str(k): v for k, v in poste_summary.items()}
            
            return {
                "status": "success",
                "metrics": {
                    "total_operations": total_operations,
                    "total_cost": float(total_cost),
                    "total_delays": float(total_delays)
                },
                "poste_data": poste_data
            }
        else:
            return {
                "status": "no_data",
                "message": "Analysis results not found. Run the Jupyter notebook first.",
                "metrics": {
                    "total_operations": 0,
                    "total_cost": 0,
                    "total_delays": 0
                }
            }
    except Exception as e:
        return JSONResponse(
            {"status": "error", "message": str(e)},
            status_code=500
        )


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "workflow-api"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8502)
