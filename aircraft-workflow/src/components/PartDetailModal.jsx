import React from 'react';
import { X, Package, Factory, Clock, TrendingUp, Weight, Euro, Ruler } from 'lucide-react';

const PartDetailModal = ({ part, onClose }) => {
  if (!part) return null;

  const getCriticalityColor = (criticite) => {
    const level = criticite?.toLowerCase();
    if (level === 'critique') return 'bg-red-100 text-red-800 border-red-300';
    if (level === 'haute') return 'bg-orange-100 text-orange-800 border-orange-300';
    if (level === 'moyenne') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-green-100 text-green-800 border-green-300';
  };

  const getCriticalityIcon = (criticite) => {
    const level = criticite?.toLowerCase();
    if (level === 'critique') return '🔴';
    if (level === 'haute') return '🟠';
    if (level === 'moyenne') return '🟡';
    return '🟢';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-700 text-white p-6 flex justify-between items-start z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-8 h-8" />
              <h2 className="text-2xl font-bold">
                {part.Désignation}
              </h2>
            </div>
            <div className="text-blue-100 text-sm font-mono">
              Réf: {part['Code / Référence']}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Ruler className="w-4 h-4 text-gray-600" />
                <div className="text-xs font-semibold text-gray-600">QUANTITÉ</div>
              </div>
              <div className="text-2xl font-bold text-gray-800">{part.Quantité}</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Weight className="w-4 h-4 text-gray-600" />
                <div className="text-xs font-semibold text-gray-600">MASSE</div>
              </div>
              <div className="text-2xl font-bold text-gray-800">{part['Masse (kg)']} kg</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Euro className="w-4 h-4 text-gray-600" />
                <div className="text-xs font-semibold text-gray-600">COÛT UNITAIRE</div>
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(part['Coût achat pièce (€)'])}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <div className="text-xs font-semibold text-gray-600">TEMPS CAO</div>
              </div>
              <div className="text-2xl font-bold text-gray-800">{part['Temps CAO (h)']} h</div>
            </div>
          </div>

          {/* Coût total */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-gray-600 mb-1">COÛT TOTAL</div>
                <div className="text-3xl font-bold text-blue-900">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
                    part['Coût achat pièce (€)'] * part.Quantité
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {part.Quantité} × {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(part['Coût achat pièce (€)'])}
              </div>
            </div>
          </div>

          {/* Criticité */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-bold text-gray-800">Criticité</h3>
            </div>
            <div className={`p-4 rounded-lg border-2 ${getCriticalityColor(part.Criticité)}`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getCriticalityIcon(part.Criticité)}</span>
                <div>
                  <div className="text-xl font-bold">{part.Criticité}</div>
                  <div className="text-sm mt-1">
                    {part.Criticité?.toLowerCase() === 'critique' && "Pièce essentielle - Priorité maximale"}
                    {part.Criticité?.toLowerCase() === 'haute' && "Pièce importante - Haute priorité"}
                    {part.Criticité?.toLowerCase() === 'moyenne' && "Pièce standard - Priorité normale"}
                    {part.Criticité?.toLowerCase() === 'faible' && "Pièce secondaire - Priorité basse"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fournisseur */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Factory className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-bold text-gray-800">Fournisseur</h3>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-xl font-semibold text-purple-900 mb-2">
                {part.Fournisseur}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Clock className="w-4 h-4" />
                <span>Délai d'approvisionnement : <strong>{part['Délai Approvisionnement']} jours</strong></span>
              </div>
            </div>
          </div>

          {/* Masse totale */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Weight className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-700">Masse totale</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                {(part['Masse (kg)'] * part.Quantité).toFixed(2)} kg
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartDetailModal;
