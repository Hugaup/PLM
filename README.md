# AirPlus Process Mining Dashboard

A comprehensive process mining and data analysis platform for manufacturing operations, analyzing data from ERP (Enterprise Resource Planning), MES (Manufacturing Execution System), and PLM (Product Lifecycle Management) systems.

## Overview

This project provides an end-to-end solution for analyzing manufacturing operations at AirPlus, an aerospace company. It combines data from multiple systems to identify bottlenecks, calculate costs, detect anomalies, and provide actionable insights for operational efficiency improvements.

The project includes:
- **Jupyter Notebook**: Complete data analysis pipeline with machine learning-based anomaly detection
- **Streamlit Dashboard**: Interactive web application for visualizing workflows and analysis results

## Features

### Data Integration
- **ERP Integration**: Employee data with hourly costs, qualifications, and workstation assignments
- **MES Integration**: Manufacturing operations data with planned vs actual times, delays, and industrial incidents
- **PLM Integration**: Component data with costs, criticality levels, and supplier information

### Analysis Capabilities
- Cost calculation (human labor + materials)
- Delay analysis and bottleneck identification
- Workstation performance metrics
- Component cost tracking
- AI-powered anomaly detection using Isolation Forest
- Correlation analysis of key metrics

### Visualization
- Interactive workflow diagrams (Client, Logistics, Services)
- Cost breakdown charts (human vs material costs)
- Delay analysis by workstation
- Component cost analysis
- Anomaly detection scatter plots
- Performance metrics and KPIs

## Project Structure

```
PLM/
 data/                                      # Data directory
    ERP_Equipes Airplus.xlsx              # Employee and workstation data
    MES_Extraction.xlsx                   # Manufacturing operations data
    PLM_DataSet.xlsx                      # Component and part data
    image_front.jpeg                      # Reference workflow diagram
    AirPlus_Analysis_Results.xlsx         # Generated analysis results
    AirPlus_Summary_Reports.xlsx          # Generated summary reports

 AirPlus_Process_Mining_Analysis.ipynb     # Main analysis notebook
 streamlit_app.py                          # Interactive dashboard application
 main.py                                   # Entry point script
 pyproject.toml                            # Project dependencies
 uv.lock                                   # Dependency lock file
 README.md                                 # This file
```

## Installation

### Prerequisites
- Python 3.13 or higher
- UV package manager (recommended) or pip

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd PLM
```

2. Create and activate virtual environment:
```bash
python -m venv .venv
# On Windows
.venv\Scripts\activate
# On macOS/Linux
source .venv/bin/activate
```

3. Install dependencies:
```bash
# Using uv (recommended)
uv sync

# Using pip
pip install -r requirements.txt
```

### Dependencies
- pandas >= 2.3.3 - Data manipulation
- numpy >= 2.3.5 - Numerical computing
- matplotlib >= 3.10.7 - Data visualization
- seaborn >= 0.13.2 - Statistical visualization
- scikit-learn >= 1.7.2 - Machine learning (anomaly detection)
- streamlit >= 1.51.0 - Web dashboard framework
- openpyxl >= 3.1.5 - Excel file handling

## Usage

### Running the Analysis

1. Open the Jupyter notebook:
```bash
jupyter notebook AirPlus_Process_Mining_Analysis.ipynb
```

2. Run all cells to:
   - Load and integrate ERP, MES, and PLM datasets
   - Clean and transform data
   - Calculate costs and delays
   - Perform anomaly detection
   - Generate visualizations
   - Export results to Excel files

### Running the Dashboard

Launch the Streamlit dashboard:
```bash
streamlit run streamlit_app.py
```

The dashboard will open in your browser at `http://localhost:8501`

### Dashboard Features

**Workflow Tab**:
- Visual representation of three main process flows:
  - **Clients**: Quote requests, validation, contracts, order tracking, invoicing
  - **Logistics**: Production planning, procurement, inventory, shipping
  - **Services**: Assembly, testing, quality control, certification

**Graphs Tab**:
- **Cost Analysis**: Total costs, human vs material breakdown, cost by workstation
- **Delays & Bottlenecks**: Delay statistics, cumulative delays by workstation
- **Components**: Most expensive components, usage frequency
- **Anomalies**: AI-detected anomalous operations, cost impact analysis

## Key Metrics & Insights

### Cost Analysis
- **Total Operation Cost**: Human labor + Material costs
- **Delay Surcharge**: Additional costs from operations running over planned time
- **Cost by Workstation**: Identify most expensive operations
- **Component Costs**: Track high-value parts and materials

### Performance Metrics
- **Delay Rate**: Percentage of operations with delays
- **Average Delay**: Mean delay time across operations
- **Bottleneck Identification**: Workstations with highest cumulative delays
- **Anomaly Detection**: Operations significantly deviating from normal patterns

### Typical Findings
Based on the analysis:
- Material costs represent the majority of total costs (typically >95%)
- Delays impact 100% of operations with an average 29% surcharge on human costs
- Top 10 operations can account for 96%+ of total costs
- AI detects 10-15% of operations as anomalies requiring investigation

## Data Sources

### ERP Dataset
**File**: `ERP_Equipes Airplus.xlsx`
**Contains**: 150 employees with:
- Employee ID, name, age
- Qualifications and experience level
- Workstation assignments
- Hourly costs (�)
- Skills and certifications
- Rotation schedules

### MES Dataset
**File**: `MES_Extraction.xlsx`
**Contains**: 56 manufacturing operations with:
- Workstation ID
- Operation name and description
- Planned vs actual time
- Component references (semicolon-separated)
- Industrial incidents and root causes
- Date and time stamps

### PLM Dataset
**File**: `PLM_DataSet.xlsx`
**Contains**: 40 components with:
- Part reference codes
- Designations and descriptions
- Quantities and suppliers
- Unit costs (�)
- Criticality levels
- Lead times and CAD hours

## Analysis Workflow

1. **Data Loading**: Import ERP, MES, and PLM datasets
2. **Data Cleaning**: Convert time formats, handle missing values
3. **Data Integration**: Link datasets via workstation IDs and component references
4. **Cost Calculation**: Compute human costs, material costs, and delay surcharges
5. **Delay Analysis**: Calculate delays and identify bottlenecks
6. **Anomaly Detection**: Apply Isolation Forest ML algorithm
7. **Visualization**: Generate charts and graphs
8. **Export**: Save results to Excel for further analysis

## Machine Learning

### Anomaly Detection
The project uses scikit-learn's Isolation Forest algorithm to detect anomalous operations based on:
- Real time duration
- Delay magnitude
- Total cost

**Configuration**:
- Contamination rate: 10%
- Number of estimators: 100
- Random state: 42 (reproducible results)

**Output**:
- Anomaly labels (Normal / Anomaly)
- Anomaly scores (lower = more anomalous)
- Visual identification in scatter plots

## Output Files

After running the analysis, the following files are generated:

### AirPlus_Analysis_Results.xlsx
Complete dataset with all calculated metrics:
- Original operation data
- Time conversions (hours)
- Cost breakdowns
- Delay calculations
- Anomaly detection results

### AirPlus_Summary_Reports.xlsx
Multiple sheets with summary tables:
- **Top_Expensive_Ops**: 10 most costly operations
- **Delays_by_Poste**: Cumulative delays per workstation
- **Costs_by_Poste**: Human costs per workstation
- **Top_Components**: Most expensive components (top 50)
- **Anomalies**: Detected anomalous operations

## Customization

### Modifying Analysis Parameters

**Delay Calculation** (`AirPlus_Process_Mining_Analysis.ipynb`):
```python
# Keep only positive delays (operations running over time)
mes['Retard (h)'] = (mes['Temps R�el (h)'] - mes['Temps Pr�vu (h)']).clip(lower=0)
```

**Anomaly Detection Sensitivity**:
```python
iso_forest = IsolationForest(
    contamination=0.1,  # Adjust expected anomaly rate (0.05-0.2)
    random_state=42,
    n_estimators=100    # Adjust model complexity
)
```

**Cost Calculations**:
```python
# Human cost
mes_final['Co�t humain (�)'] = mes_final['Temps R�el (h)'] * mes_final['Co�t horaire (�)']

# Delay surcharge
mes_final['Surco�t retard (�)'] = mes_final['Retard (h)'] * mes_final['Co�t horaire (�)']
```

### Customizing the Dashboard

Edit `streamlit_app.py` to:
- Modify color schemes in the CSS section
- Add new workflow steps to the lists
- Adjust chart types and parameters
- Add custom metrics and KPIs

## Troubleshooting

### Common Issues

**File not found errors**:
- Ensure all data files are in the `data/` directory
- Check file paths in the code match your directory structure

**Module import errors**:
- Verify all dependencies are installed: `pip list`
- Reinstall requirements: `pip install -r requirements.txt`

**Streamlit connection errors**:
- Check if port 8501 is available
- Try specifying a different port: `streamlit run streamlit_app.py --server.port 8502`

**Excel file issues**:
- Ensure openpyxl is installed for .xlsx support
- Check Excel files are not open in another application

## Performance Considerations

- **Large Datasets**: For datasets with >1000 operations, consider sampling or batch processing
- **Memory Usage**: The notebook loads all data into memory; monitor RAM usage for large files
- **Dashboard Loading**: First load may be slow; refresh if charts don't appear immediately

## Future Enhancements

Potential improvements:
- Real-time data integration via APIs
- Predictive models for delay forecasting
- Automated report generation and email distribution
- Advanced optimization algorithms for workstation scheduling
- Integration with additional data sources (quality control, maintenance)
- Multi-language support (currently in French)

## Technical Details

### Workflow Process Categories

**Clients (Blue)**:
1. Demande de devis (Quote request)
2. Validation commerciale (Commercial validation)
3. Signature du contrat (Contract signing)
4. Suivi de commande (Order tracking)
5. R�ception & validation (Reception & validation)
6. Facturation (Invoicing)
7. Support client (Customer support)

**Logistique (Orange)**:
1. Planification production (Production planning)
2. Approvisionnement pi�ces (Parts procurement)
3. R�ception mat�riel (Material reception)
4. Contr�le qualit� entr�e (Incoming quality control)
5. Stockage (Storage)
6. Pr�paration commande (Order preparation)
7. Exp�dition (Shipping)
8. Gestion des retours (Returns management)

**Services (Green)**:
1. Affectation poste montage (Assembly station assignment)
2. Montage & assemblage (Assembly)
3. Tests fonctionnels (Functional testing)
4. Contr�le qualit� final (Final quality control)
5. Documentation technique (Technical documentation)
6. Certification (Certification)
7. Maintenance pr�ventive (Preventive maintenance)

## Contributing

This project was developed for the AirPlus Process Mining Hackathon - ESILV S9 PLM - November 2025.

## License

[Specify your license here]

## Contact & Support

For questions or issues:
- Check the troubleshooting section above
- Review the Jupyter notebook comments for implementation details
- Consult the Streamlit documentation for dashboard customization

## Acknowledgments

- Built with Streamlit for interactive dashboards
- Powered by scikit-learn for machine learning capabilities
- Visualization by matplotlib and seaborn
- Data processing with pandas

---

**Generated for**: AirPlus Process Mining Analysis
**Course**: ESILV S9 PLM
**Date**: November 2025
**Technology Stack**: Python, Jupyter, Streamlit, scikit-learn
