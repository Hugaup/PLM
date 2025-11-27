import React from 'react';
import { Handle, Position } from 'reactflow';
import { Package } from 'lucide-react';

const StageNode = ({ data }) => {
  return (
    <div
      onClick={data.onClick}
      className="px-6 py-4 shadow-lg rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 border-2 border-blue-800 cursor-pointer hover:shadow-xl transition-all min-w-[280px]"
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center gap-3 mb-2">
        <Package className="w-5 h-5 text-white" />
        <div className="font-bold text-white text-sm">ÉTAPE</div>
      </div>
      
      <div className="text-white font-semibold text-base mb-2">
        {data.label}
      </div>
      
      <div className="text-blue-100 text-xs">
        {data.stage.postes.length} poste(s)
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export default StageNode;
