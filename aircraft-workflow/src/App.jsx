import React, { useState, useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import StageNode from './components/StageNode';
import PosteNode from './components/PosteNode';
import DetailPanel from './components/DetailPanel';
import EmployeeDirectory from './components/EmployeeDirectory';
import PartsDirectory from './components/PartsDirectory';
import ProductionPlanning from './components/ProductionPlanning';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import IshikawaDashboard from './components/IshikawaDashboard';
import RecommendationAffectation from './components/RecommendationAffectation';
import workflowData from '../workflow_data.json';

const nodeTypes = {
  stage: StageNode,
  poste: PosteNode,
};

// Ordre logique des étapes de construction d'un avion
const stageOrder = [
  'Assemblage fuselage centrale',
  'Montage train atterissage',
  'Assemblage moteur / fuselage / train atterissage',
  'Assemblage visserie fuselage partie basse',
  'Assemblage visserie train atterissage',
  'Assemblage queue avion',
  'Assemblage cockpit',
  'Assemblage réacteurs',
  'Assemblage aile gauche',
  'Assemblage train atterissage gauche',
  'Fixation réacteur aile gauche',
  'Fixation aile gauche avion / train atterissage',
  'Assemblage aile droite',
  'Assemblage train atterissage droit',
  'Fixation réacteur aile droite',
  'Fixation aile droit avion / train atterissage',
  'Fixation bout ailes',
  'Passage faisceaux électrique ailes',
  'Fixation lumières bout ailes',
  'Stickers cockpit',
  'Stickers réacteur',
  'Stickers fuselage gauche',
  'Stickers fuselage droit',
];

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState('workflow'); // 'workflow' or 'detail'
  const [activeTab, setActiveTab] = useState('workflow'); // 'workflow', 'employees', 'parts', 'production', 'analytics', 'ishikawa' or 'recommandations'

  // Créer un index des employés par matricule pour un accès rapide
  const employeesByMatricule = useMemo(() => {
    const map = {};
    if (workflowData.employees) {
      workflowData.employees.forEach(emp => {
        map[emp.Matricule] = emp;
      });
    }
    return map;
  }, []);

  // Créer un index des pièces par référence
  const partsByReference = useMemo(() => {
    const map = {};
    if (workflowData.parts) {
      workflowData.parts.forEach(part => {
        map[part['Code / Référence']] = part;
      });
    }
    return map;
  }, []);

  useEffect(() => {
    generateWorkflowNodes();
  }, []);

  const generateWorkflowNodes = () => {
    const sortedStages = [...workflowData.stages].sort((a, b) => {
      const indexA = stageOrder.indexOf(a.name);
      const indexB = stageOrder.indexOf(b.name);
      return indexA - indexB;
    });

    const newNodes = [];
    const newEdges = [];
    const nodesPerRow = 4;
    const horizontalSpacing = 350;
    const verticalSpacing = 200;

    sortedStages.forEach((stage, index) => {
      const row = Math.floor(index / nodesPerRow);
      const col = index % nodesPerRow;
      const x = col * horizontalSpacing + 50;
      const y = row * verticalSpacing + 50;

      newNodes.push({
        id: stage.id,
        type: 'stage',
        position: { x, y },
        data: {
          label: stage.name,
          stage: stage,
          onClick: () => handleStageClick(stage),
        },
      });

      // Créer des connexions entre les étapes successives
      if (index > 0) {
        newEdges.push({
          id: `e${sortedStages[index - 1].id}-${stage.id}`,
          source: sortedStages[index - 1].id,
          target: stage.id,
          animated: true,
          style: { stroke: '#3b82f6' },
        });
      }
    });

    setNodes(newNodes);
    setEdges(newEdges);
  };

  const generatePosteNodes = (stage) => {
    const newNodes = [];
    const newEdges = [];
    const spacing = 250;

    stage.postes.forEach((poste, index) => {
      const x = (index % 3) * spacing + 50;
      const y = Math.floor(index / 3) * 200 + 50;

      newNodes.push({
        id: `poste-${poste.poste_id}`,
        type: 'poste',
        position: { x, y },
        data: {
          poste: poste,
          onClick: () => handlePosteClick(poste),
        },
      });

      if (index > 0) {
        newEdges.push({
          id: `e-poste-${stage.postes[index - 1].poste_id}-${poste.poste_id}`,
          source: `poste-${stage.postes[index - 1].poste_id}`,
          target: `poste-${poste.poste_id}`,
          animated: false,
          style: { stroke: '#10b981' },
        });
      }
    });

    setNodes(newNodes);
    setEdges(newEdges);
  };

  const handleStageClick = (stage) => {
    setSelectedItem({ type: 'stage', data: stage });
    setViewMode('detail');
    generatePosteNodes(stage);
  };

  const handlePosteClick = (poste) => {
    setSelectedItem({ type: 'poste', data: poste });
  };

  const handleBackToWorkflow = () => {
    setViewMode('workflow');
    setSelectedItem(null);
    generateWorkflowNodes();
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Enhanced Navigation with Visual Grouping */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-300 shadow-sm">
        <div className="flex items-center px-4 py-2">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2 mr-6 px-4 py-1 bg-white rounded-lg shadow-sm border border-gray-200">
            <span className="text-2xl">🎼</span>
            <div className="text-sm">
              <div className="font-bold text-gray-800">MAESTRO</div>
              <div className="text-xs text-gray-500">Production Analytics</div>
            </div>
          </div>

          {/* Production Section */}
          <div className="flex items-center gap-1 mr-2 px-3 py-1 bg-blue-50 rounded-lg border border-blue-200">
            <span className="text-xs font-bold text-blue-700 mr-2 pr-2 border-r-2 border-blue-300">🏭 PRODUCTION</span>
            <button
              onClick={() => {
                setActiveTab('workflow');
                setSelectedItem(null);
              }}
              className={`px-4 py-2 text-sm font-semibold rounded transition-all ${
                activeTab === 'workflow'
                  ? 'bg-blue-600 text-white shadow-md transform scale-105'
                  : 'text-blue-700 hover:bg-blue-100'
              }`}
            >
              🛩️ Workflow
            </button>
            <button
              onClick={() => {
                setActiveTab('parts');
                setSelectedItem(null);
              }}
              className={`px-4 py-2 text-sm font-semibold rounded transition-all ${
                activeTab === 'parts'
                  ? 'bg-blue-600 text-white shadow-md transform scale-105'
                  : 'text-blue-700 hover:bg-blue-100'
              }`}
            >
              📦 Pièces ({workflowData.parts?.length || 0})
            </button>
            <button
              onClick={() => {
                setActiveTab('production');
                setSelectedItem(null);
              }}
              className={`px-4 py-2 text-sm font-semibold rounded transition-all ${
                activeTab === 'production'
                  ? 'bg-blue-600 text-white shadow-md transform scale-105'
                  : 'text-blue-700 hover:bg-blue-100'
              }`}
            >
              📋 Planning
            </button>
          </div>

          {/* Divider */}
          <div className="h-10 w-px bg-gray-300 mx-2"></div>

          {/* Personnel Section */}
          <div className="flex items-center gap-1 mr-2 px-3 py-1 bg-green-50 rounded-lg border border-green-200">
            <span className="text-xs font-bold text-green-700 mr-2 pr-2 border-r-2 border-green-300">👥 PERSONNEL</span>
            <button
              onClick={() => {
                setActiveTab('employees');
                setSelectedItem(null);
              }}
              className={`px-4 py-2 text-sm font-semibold rounded transition-all ${
                activeTab === 'employees'
                  ? 'bg-green-600 text-white shadow-md transform scale-105'
                  : 'text-green-700 hover:bg-green-100'
              }`}
            >
              📋 Annuaire ({workflowData.employees?.length || 0})
            </button>
            <button
              onClick={() => {
                setActiveTab('recommandations');
                setSelectedItem(null);
              }}
              className={`px-4 py-2 text-sm font-semibold rounded transition-all ${
                activeTab === 'recommandations'
                  ? 'bg-green-600 text-white shadow-md transform scale-105'
                  : 'text-green-700 hover:bg-green-100'
              }`}
            >
              🎯 Recommandations
            </button>
          </div>

          {/* Divider */}
          <div className="h-10 w-px bg-gray-300 mx-2"></div>

          {/* Analytics Section */}
          <div className="flex items-center gap-1 px-3 py-1 bg-purple-50 rounded-lg border border-purple-200">
            <span className="text-xs font-bold text-purple-700 mr-2 pr-2 border-r-2 border-purple-300">📊 ANALYSE</span>
            <button
              onClick={() => {
                setActiveTab('analytics');
                setSelectedItem(null);
              }}
              className={`px-4 py-2 text-sm font-semibold rounded transition-all ${
                activeTab === 'analytics'
                  ? 'bg-purple-600 text-white shadow-md transform scale-105'
                  : 'text-purple-700 hover:bg-purple-100'
              }`}
            >
              📈 Indicateurs
            </button>
            <button
              onClick={() => {
                setActiveTab('ishikawa');
                setSelectedItem(null);
              }}
              className={`px-4 py-2 text-sm font-semibold rounded transition-all ${
                activeTab === 'ishikawa'
                  ? 'bg-purple-600 text-white shadow-md transform scale-105'
                  : 'text-purple-700 hover:bg-purple-100'
              }`}
            >
              🐟 Ishikawa
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'workflow' ? (
          <>
            <div className="flex-1 relative">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                attributionPosition="bottom-left"
              >
                <Controls />
                <MiniMap />
                <Background variant="dots" gap={12} size={1} />
                <Panel position="top-left" className="bg-white p-4 rounded-lg shadow-lg">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    🛩️ Workflow Construction Avion
                  </h1>
                  <p className="text-sm text-gray-600">
                    {viewMode === 'workflow' 
                      ? 'Cliquez sur une étape pour voir les postes'
                      : 'Vue détaillée des postes'}
                  </p>
                  {viewMode === 'detail' && (
                    <button
                      onClick={handleBackToWorkflow}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      ← Retour au workflow
                    </button>
                  )}
                </Panel>
              </ReactFlow>
            </div>
            
            {selectedItem && (
              <DetailPanel
                item={selectedItem}
                employeesByMatricule={employeesByMatricule}
                partsByReference={partsByReference}
                onClose={() => setSelectedItem(null)}
              />
            )}
          </>
        ) : activeTab === 'employees' ? (
          <EmployeeDirectory employees={workflowData.employees || []} />
        ) : activeTab === 'parts' ? (
          <PartsDirectory parts={workflowData.parts || []} />
        ) : activeTab === 'production' ? (
          <ProductionPlanning 
            stages={workflowData.stages || []} 
            partsByReference={partsByReference}
          />
        ) : activeTab === 'analytics' ? (
          <AnalyticsDashboard 
            stages={workflowData.stages || []} 
            employees={workflowData.employees || []}
            parts={workflowData.parts || []}
            partsByReference={partsByReference}
          />
        ) : activeTab === 'ishikawa' ? (
          <IshikawaDashboard 
            stages={workflowData.stages || []} 
          />
        ) : (
          <RecommendationAffectation 
            stages={workflowData.stages || []} 
            employees={workflowData.employees || []}
          />
        )}
      </div>
    </div>
  );
}

export default App;
