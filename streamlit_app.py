"""
AirPlus Process Mining Dashboard
Streamlit application replicating the workflow layout from data/image_front.jpeg
"""

import streamlit as st
from PIL import Image
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Page configuration
st.set_page_config(
    page_title="AirPlus Process Mining Dashboard",
    page_icon="✈️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for styling the workflow boxes
st.markdown("""
<style>
    .workflow-box {
        padding: 15px;
        margin: 10px 0;
        border-radius: 8px;
        text-align: center;
        font-weight: 500;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        position: relative;
    }
    
    .client-box {
        background-color: #E3F2FD;
        border-left: 4px solid #2196F3;
        color: #1565C0;
    }
    
    .logistics-box {
        background-color: #FFF3E0;
        border-left: 4px solid #FF9800;
        color: #E65100;
    }
    
    .service-box {
        background-color: #E8F5E9;
        border-left: 4px solid #4CAF50;
        color: #2E7D32;
    }
    
    .column-header {
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        padding: 20px 0;
        margin-bottom: 15px;
        border-radius: 8px;
    }
    
    .client-header {
        background-color: #2196F3;
        color: white;
    }
    
    .logistics-header {
        background-color: #FF9800;
        color: white;
    }
    
    .service-header {
        background-color: #4CAF50;
        color: white;
    }
    
    .arrow-down {
        text-align: center;
        font-size: 24px;
        color: #666;
        margin: 5px 0;
    }
    
    .arrow-right {
        text-align: center;
        font-size: 20px;
        color: #999;
        margin: 5px 0;
    }
    
    .connection-info {
        text-align: center;
        font-size: 11px;
        color: #888;
        font-style: italic;
        margin: 3px 0;
    }
</style>
""", unsafe_allow_html=True)

# Sidebar
with st.sidebar:
    st.title("⚙️ Navigation")
    st.markdown("---")
    st.info("**AirPlus Process Mining Dashboard**\n\nAnalyzing ERP, MES, and PLM data for operational efficiency.")

# Main title
st.title("✈️ AirPlus Process Mining Dashboard")
st.markdown("### Operational Workflow & Analytics")
st.markdown("---")

# Create tabs
tab1, tab2 = st.tabs(["📋 Workflow", "📊 Analytics"])

# ================================
# TAB 1: WORKFLOW
# ================================
with tab1:
    st.header("Process Workflow Overview")
    st.markdown("*Interactive workflow powered by React Flow*")
    
    # Add toggle for view mode
    col_toggle1, col_toggle2 = st.columns([1, 4])
    with col_toggle1:
        view_mode = st.radio("View Mode:", ["Interactive", "Classic"], horizontal=True)
    
    st.markdown("---")
    
    if view_mode == "Interactive":
        # Interactive Workflow with Plotly Network Graph
        st.subheader("🎨 Interactive Workflow Visualization")
        
        import plotly.graph_objects as go
        import networkx as nx
        
        # Create a directed graph
        G = nx.DiGraph()
        
        # Define nodes with departments
        nodes = {
            # Client nodes
            'c1': {'label': 'Quote Request', 'dept': 'client', 'pos': (0, 6)},
            'c2': {'label': 'Commercial Validation', 'dept': 'client', 'pos': (0, 5)},
            'c3': {'label': 'Contract Signature', 'dept': 'client', 'pos': (0, 4)},
            'c4': {'label': 'Order Tracking', 'dept': 'client', 'pos': (0, 3)},
            'c5': {'label': 'Reception & Validation', 'dept': 'client', 'pos': (0, 2)},
            'c6': {'label': 'Invoicing', 'dept': 'client', 'pos': (0, 1)},
            'c7': {'label': 'Customer Support', 'dept': 'client', 'pos': (0, 0)},
            
            # Logistics nodes
            'l1': {'label': 'Production Planning', 'dept': 'logistics', 'pos': (5, 7)},
            'l2': {'label': 'Parts Procurement', 'dept': 'logistics', 'pos': (5, 6)},
            'l3': {'label': 'Material Reception', 'dept': 'logistics', 'pos': (5, 5)},
            'l4': {'label': 'Quality Control', 'dept': 'logistics', 'pos': (5, 4)},
            'l5': {'label': 'Storage', 'dept': 'logistics', 'pos': (5, 3)},
            'l6': {'label': 'Order Preparation', 'dept': 'logistics', 'pos': (5, 2)},
            'l7': {'label': 'Shipment', 'dept': 'logistics', 'pos': (5, 1)},
            'l8': {'label': 'Returns Management', 'dept': 'logistics', 'pos': (5, 0)},
            
            # Service nodes
            's1': {'label': 'Station Assignment', 'dept': 'service', 'pos': (10, 6)},
            's2': {'label': 'Assembly & Mounting', 'dept': 'service', 'pos': (10, 5)},
            's3': {'label': 'Functional Testing', 'dept': 'service', 'pos': (10, 4)},
            's4': {'label': 'Final Quality Control', 'dept': 'service', 'pos': (10, 3)},
            's5': {'label': 'Technical Documentation', 'dept': 'service', 'pos': (10, 2)},
            's6': {'label': 'Certification', 'dept': 'service', 'pos': (10, 1)},
            's7': {'label': 'Preventive Maintenance', 'dept': 'service', 'pos': (10, 0)},
        }
        
        # Add nodes to graph
        for node_id, attrs in nodes.items():
            G.add_node(node_id, **attrs)
        
        # Define edges (connections)
        edges = [
            # Client flow
            ('c1', 'c2'), ('c2', 'c3'), ('c3', 'c4'), ('c4', 'c5'), ('c5', 'c6'), ('c6', 'c7'),
            # Logistics flow
            ('l1', 'l2'), ('l2', 'l3'), ('l3', 'l4'), ('l4', 'l5'), ('l5', 'l6'), ('l6', 'l7'), ('l7', 'l8'),
            # Service flow
            ('s1', 's2'), ('s2', 's3'), ('s3', 's4'), ('s4', 's5'), ('s5', 's6'), ('s6', 's7'),
            # Cross-department connections
            ('c2', 'l1'), ('c3', 'l1'), ('c4', 'l6'), ('l7', 'c5'),
            ('l2', 's2'), ('s4', 'l6'),
        ]
        
        G.add_edges_from(edges)
        
        # Get positions
        pos = {node: attrs['pos'] for node, attrs in nodes.items()}
        
        # Create edge traces (simple lines)
        edge_traces = []
        for edge in G.edges():
            x0, y0 = pos[edge[0]]
            x1, y1 = pos[edge[1]]
            edge_traces.append(
                go.Scatter(
                    x=[x0, x1, None],
                    y=[y0, y1, None],
                    mode='lines',
                    line=dict(width=2, color='#888'),
                    hoverinfo='none',
                    showlegend=False
                )
            )
        
        # Create arrow annotations
        arrow_annotations = []
        for edge in G.edges():
            x0, y0 = pos[edge[0]]
            x1, y1 = pos[edge[1]]
            
            arrow_annotations.append(
                dict(
                    ax=x0, ay=y0,
                    axref='x', ayref='y',
                    x=x1, y=y1,
                    xref='x', yref='y',
                    showarrow=True,
                    arrowhead=2,
                    arrowsize=1.5,
                    arrowwidth=2,
                    arrowcolor='#888',
                    opacity=0.6
                )
            )
        
        # Create node traces by department
        dept_colors = {'client': '#2196F3', 'logistics': '#FF9800', 'service': '#4CAF50'}
        dept_names = {'client': 'Client Process', 'logistics': 'Logistics', 'service': 'Services'}
        
        node_traces = {}
        for dept in ['client', 'logistics', 'service']:
            node_x = []
            node_y = []
            node_text = []
            
            for node, attrs in nodes.items():
                if attrs['dept'] == dept:
                    x, y = pos[node]
                    node_x.append(x)
                    node_y.append(y)
                    node_text.append(attrs['label'])
            
            node_traces[dept] = go.Scatter(
                x=node_x, y=node_y,
                mode='markers+text',
                marker=dict(size=25, color=dept_colors[dept], line=dict(width=2, color='white')),
                text=node_text,
                textposition="bottom center",
                textfont=dict(size=10, color='#333'),
                hoverinfo='text',
                name=dept_names[dept],
                showlegend=True
            )
        
        # Create figure
        fig = go.Figure(data=edge_traces + list(node_traces.values()))
        
        fig.update_layout(
            title="AirPlus Process Mining Workflow",
            showlegend=True,
            hovermode='closest',
            margin=dict(b=20, l=20, r=20, t=60),
            xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
            yaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
            height=700,
            plot_bgcolor='rgba(240, 242, 246, 0.5)',
            legend=dict(x=0.02, y=0.98, bgcolor='rgba(255,255,255,0.8)'),
            annotations=arrow_annotations
        )
        
        st.plotly_chart(fig, width='stretch')
        
        # Additional info
        st.markdown("---")
        col1, col2, col3 = st.columns(3)
        with col1:
            st.info("🔵 **Client Process**\n7 steps from quote to support")
        with col2:
            st.warning("🟠 **Logistics**\n8 steps managing supply chain")
        with col3:
            st.success("🟢 **Services**\n7 steps for production & quality")
        
    else:
        # Original classic view
        # Load and display reference image
        try:
            reference_image = Image.open("data/image_front.jpeg")
            with st.expander("🖼️ View Reference Image"):
                st.image(reference_image, caption="Reference Workflow Design", width='stretch')
        except Exception as e:
            st.warning(f"Could not load reference image: {e}")
        
        st.markdown("---")
        
        # Create three columns for the workflow
        col1, col2, col3 = st.columns(3)
        
        # ================================
        # COLUMN 1: CLIENTS (Blue)
        # ================================
        with col1:
            st.markdown('<div class="column-header client-header">Clients</div>', unsafe_allow_html=True)
            
            # Client workflow boxes
            client_steps = [
            "Quote Request",
            "Commercial Validation",
            "Contract Signature",
            "Order Tracking",
            "Reception & Validation",
            "Invoicing",
            "Customer Support"
            ]
            
            connections = [
            None,
            "→ Production Planning",
            None,
            "→ Preparation",
            "← Shipment",
            None,
            None
            ]
            
            for i, step in enumerate(client_steps):
                st.markdown(f'<div class="workflow-box client-box">{step}</div>', unsafe_allow_html=True)
                if connections[i]:
                    st.markdown(f'<div class="connection-info">{connections[i]}</div>', unsafe_allow_html=True)
                if i < len(client_steps) - 1:
                    st.markdown('<div class="arrow-down">↓</div>', unsafe_allow_html=True)
        
        # ================================
        # COLUMN 2: LOGISTICS (Orange/Beige)
        # ================================
        with col2:
            st.markdown('<div class="column-header logistics-header">Logistics</div>', unsafe_allow_html=True)
            
            # Logistics workflow boxes
            logistics_steps = [
                "Production Planning",
                "Parts Procurement",
                "Material Reception",
                "Incoming Quality Control",
                "Storage",
                "Order Preparation",
                "Shipment",
                "Returns Management"
            ]
            
            log_connections = [
                "← Contract",
                "→ Assembly",
                None,
                None,
                None,
                "← Order",
                "→ Customer",
                None
            ]
            
            for i, step in enumerate(logistics_steps):
                st.markdown(f'<div class="workflow-box logistics-box">{step}</div>', unsafe_allow_html=True)
                if log_connections[i]:
                    st.markdown(f'<div class="connection-info">{log_connections[i]}</div>', unsafe_allow_html=True)
                if i < len(logistics_steps) - 1:
                    st.markdown('<div class="arrow-down">↓</div>', unsafe_allow_html=True)
        
        # ================================
        # COLUMN 3: SERVICES (Green)
        # ================================
        with col3:
            st.markdown('<div class="column-header service-header">Services</div>', unsafe_allow_html=True)
            
            # Service workflow boxes
            service_steps = [
                "Assembly Station Assignment",
                "Assembly & Mounting",
                "Functional Testing",
                "Final Quality Control",
                "Technical Documentation",
                "Certification",
                "Preventive Maintenance"
            ]
            
            service_connections = [
                None,
                "← Parts",
                None,
                "→ Preparation",
                None,
                None,
                None
            ]
            
            for i, step in enumerate(service_steps):
                st.markdown(f'<div class="workflow-box service-box">{step}</div>', unsafe_allow_html=True)
                if service_connections[i]:
                    st.markdown(f'<div class="connection-info">{service_connections[i]}</div>', unsafe_allow_html=True)
                if i < len(service_steps) - 1:
                    st.markdown('<div class="arrow-down">↓</div>', unsafe_allow_html=True)
        
        st.markdown("---")
        
        # Additional information section
        st.subheader("📌 Process Overview")
        
        info_col1, info_col2, info_col3 = st.columns(3)
        
        with info_col1:
            st.metric("Client Steps", len(client_steps), "Complete workflow")
        
        with info_col2:
            st.metric("Logistics Steps", len(logistics_steps), "Supply chain")
        
        with info_col3:
            st.metric("Service Steps", len(service_steps), "Production flow")

# ================================
# TAB 2: GRAPHS
# ================================
with tab2:
    st.header("Analytics & Visualizations")
    st.markdown("*Interactive charts and analysis results*")
    st.markdown("---")
    
    # Check if analysis results exist
    try:
        # Load analysis results
        results = pd.read_excel('data/AirPlus_Analysis_Results.xlsx')
        summary = pd.read_excel('data/AirPlus_Summary_Reports.xlsx', sheet_name=None)
        
        st.success(f"✅ Loaded analysis data: {len(results)} operations analyzed")
        
        # Create sub-sections for different visualizations
        viz_tab1, viz_tab2, viz_tab3, viz_tab4 = st.tabs([
            "💰 Cost Analysis", 
            "⏱️ Delays & Bottlenecks", 
            "🔧 Components", 
            "🚨 Anomalies"
        ])
        
        # Cost Analysis
        with viz_tab1:
            st.subheader("Cost Breakdown")
            
            col1, col2 = st.columns(2)
            
            with col1:
                # Cost summary metrics
                total_cost = results['Coût total (€)'].sum()
                human_cost = results['Coût humain (€)'].sum()
                material_cost = results['Coût matière total (€)'].sum()
                delay_cost = results['Surcoût retard (€)'].sum()
                
                st.metric("Total Cost", f"{total_cost:,.2f} €")
                st.metric("Human Cost", f"{human_cost:,.2f} €", f"{100*human_cost/total_cost:.1f}%")
                st.metric("Material Cost", f"{material_cost:,.2f} €", f"{100*material_cost/total_cost:.1f}%")
                st.metric("Delay Surcharge", f"{delay_cost:,.2f} €", f"{100*delay_cost/human_cost:.1f}% of human")
            
            with col2:
                # Pie chart of cost breakdown
                fig, ax = plt.subplots(figsize=(8, 6))
                costs = [human_cost, material_cost, delay_cost]
                labels = ['Human Cost', 'Material Cost', 'Delay Surcharge']
                colors = ['#3498db', '#e74c3c', '#f39c12']
                
                ax.pie(costs, labels=labels, autopct='%1.1f%%', startangle=90, colors=colors)
                ax.set_title('Cost Distribution', fontsize=14, fontweight='bold')
                st.pyplot(fig)
            
            # Cost by workstation
            st.markdown("---")
            st.subheader("Cost by Workstation")
            
            if 'Costs_by_Poste' in summary:
                cost_by_poste = summary['Costs_by_Poste']
                
                fig, ax = plt.subplots(figsize=(12, 6))
                ax.bar(cost_by_poste['Poste'].astype(str), cost_by_poste['Coût humain total (€)'], 
                       color='skyblue', edgecolor='black', alpha=0.8)
                ax.set_xlabel('Workstation (Poste)', fontsize=12, fontweight='bold')
                ax.set_ylabel('Total Human Cost (€)', fontsize=12, fontweight='bold')
                ax.set_title('Human Cost by Workstation', fontsize=14, fontweight='bold')
                ax.grid(axis='y', alpha=0.3)
                plt.tight_layout()
                st.pyplot(fig)
        
        # Delays & Bottlenecks
        with viz_tab2:
            st.subheader("Delay Analysis")
            
            # Delay metrics
            col1, col2, col3 = st.columns(3)
            
            total_delays = results['Retard (h)'].sum()
            ops_with_delay = (results['Retard (h)'] > 0).sum()
            avg_delay = results[results['Retard (h)'] > 0]['Retard (h)'].mean()
            
            with col1:
                st.metric("Total Delays", f"{total_delays:.2f} h")
            with col2:
                st.metric("Operations with Delays", f"{ops_with_delay}", f"{100*ops_with_delay/len(results):.1f}%")
            with col3:
                st.metric("Average Delay", f"{avg_delay:.2f} h")
            
            # Delays by workstation
            if 'Delays_by_Poste' in summary:
                delays_by_poste = summary['Delays_by_Poste']
                
                st.markdown("---")
                st.subheader("Delays by Workstation")
                
                fig, ax = plt.subplots(figsize=(12, 6))
                ax.bar(delays_by_poste['Poste'].astype(str), delays_by_poste['Retard total (h)'], 
                       color='coral', edgecolor='black', alpha=0.8)
                ax.set_xlabel('Workstation (Poste)', fontsize=12, fontweight='bold')
                ax.set_ylabel('Total Delay (hours)', fontsize=12, fontweight='bold')
                ax.set_title('Cumulative Delays by Workstation', fontsize=14, fontweight='bold')
                ax.grid(axis='y', alpha=0.3)
                plt.tight_layout()
                st.pyplot(fig)
                
                st.dataframe(delays_by_poste, width='stretch')
        
        # Components Analysis
        with viz_tab3:
            st.subheader("Component Analysis")
            
            if 'Top_Components' in summary:
                top_components = summary['Top_Components']
                
                st.markdown("**Top 15 Most Expensive Components**")
                st.dataframe(top_components.head(15), width='stretch')
                
                # Bar chart of top components
                fig, ax = plt.subplots(figsize=(12, 8))
                top_15 = top_components.head(15)
                ax.barh(range(len(top_15)), top_15['Coût total (€)'], color='teal', alpha=0.8)
                ax.set_yticks(range(len(top_15)))
                ax.set_yticklabels(top_15['Référence'])
                ax.set_xlabel('Total Cost (€)', fontsize=12, fontweight='bold')
                ax.set_title('Top 15 Components by Total Cost', fontsize=14, fontweight='bold')
                ax.grid(axis='x', alpha=0.3)
                plt.tight_layout()
                st.pyplot(fig)
        
        # Anomalies
        with viz_tab4:
            st.subheader("Anomaly Detection Results")
            
            if 'Anomalies' in summary:
                anomalies = summary['Anomalies']
                
                col1, col2 = st.columns(2)
                
                with col1:
                    st.metric("Anomalous Operations", len(anomalies))
                    st.metric("Total Anomaly Cost", f"{anomalies['Coût total (€)'].sum():,.2f} €")
                
                with col2:
                    anomaly_rate = 100 * len(anomalies) / len(results)
                    st.metric("Anomaly Rate", f"{anomaly_rate:.1f}%")
                    st.metric("Avg Anomaly Cost", f"{anomalies['Coût total (€)'].mean():,.2f} €")
                
                st.markdown("---")
                st.markdown("**Top 10 Anomalies**")
                st.dataframe(anomalies.head(10), width='stretch')
                
                # Scatter plot
                fig, ax = plt.subplots(figsize=(12, 6))
                ax.scatter(anomalies['Temps Réel (h)'], anomalies['Coût total (€)'], 
                          c='red', alpha=0.6, s=100, edgecolors='black', label='Anomalies')
                ax.set_xlabel('Real Time (hours)', fontsize=12, fontweight='bold')
                ax.set_ylabel('Total Cost (€)', fontsize=12, fontweight='bold')
                ax.set_title('Anomalous Operations: Time vs Cost', fontsize=14, fontweight='bold')
                ax.legend()
                ax.grid(alpha=0.3)
                plt.tight_layout()
                st.pyplot(fig)
            else:
                st.info("Run the Jupyter notebook analysis to generate anomaly detection results.")
    
    except FileNotFoundError:
        st.warning("⚠️ Analysis results not found. Please run the Jupyter notebook first to generate data.")
        st.info("""
        **To generate data:**
        1. Open `AirPlus_Process_Mining_Analysis.ipynb`
        2. Run all cells to perform the complete analysis
        3. The results will be saved to `data/AirPlus_Analysis_Results.xlsx`
        4. Refresh this dashboard to view the charts
        """)
        
        # Placeholder visualization
        st.markdown("---")
        st.subheader("📊 Placeholder: Sample Visualization Area")
        
        # Sample chart
        fig, ax = plt.subplots(figsize=(10, 6))
        x = ['Poste 1', 'Poste 2', 'Poste 3', 'Poste 4', 'Poste 5']
        y = [120, 85, 150, 95, 110]
        ax.bar(x, y, color='lightblue', edgecolor='black', alpha=0.7)
        ax.set_xlabel('Workstation', fontsize=12)
        ax.set_ylabel('Value', fontsize=12)
        ax.set_title('Sample Chart - Waiting for Analysis Data', fontsize=14, fontweight='bold')
        ax.grid(axis='y', alpha=0.3)
        st.pyplot(fig)

# Footer
st.markdown("---")
st.markdown("""
<div style='text-align: center; color: #666; padding: 20px;'>
    <p><strong>AirPlus Process Mining Dashboard</strong> | ESILV S9 PLM | November 2025</p>
    <p>Built with Streamlit | Data from ERP, MES & PLM systems</p>
</div>
""", unsafe_allow_html=True)
