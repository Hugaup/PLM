# AirPlus Process Mining Dashboard - React Flow Hybrid Solution

This branch (`react_flow`) implements a hybrid solution combining Streamlit with React Flow for an interactive workflow visualization.

## 🎨 Features

### Interactive React Flow Visualization
- **Drag & Pan Navigation**: Move around the workflow canvas
- **Zoom Controls**: Mouse wheel or control buttons
- **Animated Connections**: Visual data flow between processes
- **Custom Nodes**: Color-coded by department (Client/Logistics/Services)
- **Mini-map**: Bird's eye view of entire workflow
- **Cross-column Dependencies**: Clear visual links between departments

### Dual View Modes
1. **Interactive Mode**: React Flow embedded visualization (default)
2. **Classic Mode**: Original column-based static view

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         Streamlit Dashboard             │
│         (Port 8501)                     │
│  ┌───────────────────────────────────┐ │
│  │  Tab 1: Workflow                  │ │
│  │   ┌─────────────────────────┐     │ │
│  │   │   React Flow (iframe)   │     │ │
│  │   │   via FastAPI           │     │ │
│  │   └─────────────────────────┘     │ │
│  │  Tab 2: Analytics                 │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
                 ↓ HTTP
┌─────────────────────────────────────────┐
│         FastAPI Server                  │
│         (Port 8502)                     │
│  • Serves React Flow HTML              │
│  • Provides workflow data API           │
│  • Handles CORS for embedding           │
└─────────────────────────────────────────┘
```

## 📦 Files Added

- `react_flow/workflow.html` - Standalone React Flow visualization
- `api_server.py` - FastAPI backend serving React component
- `start.ps1` - PowerShell script to launch both servers

## 🚀 Usage

### Option 1: Launch Script (Recommended)
```powershell
./start.ps1
```
This starts both servers automatically.

### Option 2: Manual Launch

Terminal 1 - FastAPI:
```powershell
uv run uvicorn api_server:app --host 0.0.0.0 --port 8502 --reload
```

Terminal 2 - Streamlit:
```powershell
uv run streamlit run streamlit_app.py
```

### Access
- **Dashboard**: http://localhost:8501
- **API**: http://localhost:8502
- **React Flow Direct**: http://localhost:8502/workflow

## 🎯 Workflow Overview

### Client Process (Blue)
1. Quote Request → 2. Commercial Validation → 3. Contract Signature → 4. Order Tracking → 5. Reception & Validation → 6. Invoicing → 7. Customer Support

### Logistics Process (Orange)
1. Production Planning → 2. Parts Procurement → 3. Material Reception → 4. Quality Control → 5. Storage → 6. Order Preparation → 7. Shipment → 8. Returns Management

### Services Process (Green)
1. Station Assignment → 2. Assembly & Mounting → 3. Functional Testing → 4. Final Quality Control → 5. Technical Documentation → 6. Certification → 7. Preventive Maintenance

### Cross-Department Connections
- Commercial Validation → Production Planning
- Order Tracking → Order Preparation
- Shipment → Reception & Validation
- Parts Procurement → Assembly & Mounting
- Final Quality Control → Order Preparation

## 🔧 Technical Stack

- **Frontend**: React 18 + React Flow 11
- **Backend**: FastAPI + Uvicorn
- **Dashboard**: Streamlit
- **Data Processing**: Pandas, NumPy
- **Visualization**: Matplotlib, Seaborn

## 📊 API Endpoints

- `GET /` - API status
- `GET /workflow` - Serve React Flow HTML
- `GET /api/workflow-data` - Get workflow metrics from analysis
- `GET /api/health` - Health check

## 🎨 Customization

Edit `react_flow/workflow.html` to:
- Modify node positions
- Change colors and styling
- Add new connections
- Adjust animations
- Update node content

## 📝 Notes

- React Flow runs in an iframe for seamless integration
- FastAPI handles CORS for cross-origin requests
- Data can be dynamically loaded from analysis results
- Workflow is fully interactive (zoom, pan, drag)

## 🔄 Future Enhancements

- [ ] Real-time data updates from backend
- [ ] Click nodes to show detailed metrics
- [ ] Filter nodes by department
- [ ] Export workflow as PNG/SVG
- [ ] Add time-based animation
- [ ] Node status indicators (active/delayed/complete)
