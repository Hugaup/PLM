import React from 'react';
import { Handle, Position } from 'reactflow';
import { Wrench, AlertTriangle } from 'lucide-react';

const PosteNode = ({ data }) => {
  const { poste } = data;
  const hasProblems = poste.aleas && poste.aleas !== 'Aucun';
  const hasDelay = poste.temps_reel && poste.temps_prevu && 
                   parseFloat(poste.temps_reel) > parseFloat(poste.temps_prevu);

  return (
    <div
      onClick={data.onClick}
      className={`px-5 py-3 shadow-md rounded-lg border-2 cursor-pointer hover:shadow-lg transition-all min-w-[200px] ${
        hasProblems || hasDelay
          ? 'bg-gradient-to-br from-orange-50 to-red-50 border-red-400'
          : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400'
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-gray-700" />
          <div className="font-bold text-gray-800 text-xs">POSTE {poste.poste_id}</div>
        </div>
        {(hasProblems || hasDelay) && (
          <AlertTriangle className="w-4 h-4 text-red-500" />
        )}
      </div>
      
      {poste.reference && (
        <div className="text-xs text-gray-600 mb-1">
          Réf: {poste.reference}
        </div>
      )}
      
      <div className="text-xs text-gray-500">
        {poste.employees.length} employé(s)
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
};

export default PosteNode;
