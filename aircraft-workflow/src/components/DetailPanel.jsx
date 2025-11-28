import React, { useState } from 'react';
import { X, User, Package, AlertCircle, Clock } from 'lucide-react';
import EmployeeDetailModal from './EmployeeDetailModal';
import PartDetailModal from './PartDetailModal';

const DetailPanel = ({ item, employeesByMatricule, partsByReference, onClose }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedPart, setSelectedPart] = useState(null);
  
  if (!item) return null;

  const { type, data } = item;

  // Fonction pour récupérer l'employé complet
  const getFullEmployee = (empBasic) => {
    if (!empBasic || !empBasic.Matricule) return null;
    return employeesByMatricule[empBasic.Matricule] || empBasic;
  };

  // Parser les références de pièces (séparées par ";")
  const parsePartReferences = (refString) => {
    if (!refString) return [];
    return refString.split(';').map(ref => ref.trim()).filter(ref => ref);
  };

  // Obtenir les pièces depuis les références (avec quantités)
  const getPartsFromReferences = (refString) => {
    const refs = parsePartReferences(refString);
    
    // Compter les occurrences de chaque référence
    const refCounts = {};
    refs.forEach(ref => {
      refCounts[ref] = (refCounts[ref] || 0) + 1;
    });
    
    // Créer un tableau unique de pièces avec leurs quantités
    const uniqueParts = [];
    const seen = new Set();
    
    refs.forEach(ref => {
      if (!seen.has(ref)) {
        seen.add(ref);
        const part = partsByReference[ref];
        if (part) {
          uniqueParts.push({
            ...part,
            quantityUsed: refCounts[ref] // Quantité utilisée dans ce poste
          });
        }
      }
    });
    
    return uniqueParts;
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 shadow-xl overflow-y-auto">
      <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex justify-between items-center z-10">
        <h2 className="text-xl font-bold">
          {type === 'stage' ? '📋 Étape' : '🔧 Poste'}
        </h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-blue-700 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        {type === 'stage' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {data.name}
            </h3>
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-gray-700">
                Cette étape contient <strong>{data.postes.length} poste(s)</strong> de travail.
                Cliquez sur les postes dans le diagramme pour voir les détails.
              </p>
            </div>
          </div>
        )}

        {type === 'poste' && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Poste #{data.poste_id}
            </h3>

            {/* Temps */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <div className="text-xs font-semibold text-gray-600">TEMPS</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-xs text-gray-500">Prévu</div>
                  <div className="font-semibold">{data.temps_prevu || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Réel</div>
                  <div className={`font-semibold ${
                    data.temps_reel && data.temps_prevu && 
                    parseFloat(data.temps_reel) > parseFloat(data.temps_prevu)
                      ? 'text-red-600'
                      : 'text-green-600'
                  }`}>
                    {data.temps_reel || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Aléas et problèmes */}
            {data.aleas && data.aleas !== 'Aucun' && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <div className="text-xs font-semibold text-red-800">ALÉAS INDUSTRIELS</div>
                </div>
                <div className="text-sm text-red-900 mb-2">{data.aleas}</div>
                {data.cause && (
                  <div>
                    <div className="text-xs font-semibold text-red-700 mb-1">Cause potentielle:</div>
                    <div className="text-xs text-red-800">{data.cause}</div>
                  </div>
                )}
              </div>
            )}

            {/* Employés */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-gray-700" />
                <h4 className="text-sm font-semibold text-gray-700">
                  EMPLOYÉS ({data.employees.length})
                </h4>
              </div>
              {data.employees.length > 0 ? (
                <div className="space-y-2">
                  {data.employees.map((emp, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setSelectedEmployee(getFullEmployee(emp))}
                      className="p-3 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-gray-100 hover:border-indigo-400 transition-all"
                    >
                      <div className="font-semibold text-sm text-gray-800">
                        {emp.Prénom} {emp.Nom}
                      </div>
                      <div className="text-xs text-gray-600">
                        {emp.Matricule} - {emp.Qualification}
                      </div>
                      <div className="text-xs text-indigo-600 mt-1 font-medium">
                        Cliquer pour plus de détails →
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic">Aucun employé assigné</div>
              )}
            </div>

            {/* Pièces */}
            {data.reference && (() => {
              const parts = getPartsFromReferences(data.reference);
              return parts.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-4 h-4 text-gray-700" />
                    <h4 className="text-sm font-semibold text-gray-700">
                      PIÈCES UTILISÉES ({parts.length})
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {parts.map((part, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setSelectedPart(part)}
                        className="p-3 bg-blue-50 rounded border border-blue-200 cursor-pointer hover:bg-blue-100 hover:border-blue-400 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="font-semibold text-sm text-gray-800">
                            {part.Désignation}
                          </div>
                          {part.quantityUsed > 1 && (
                            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">
                              × {part.quantityUsed}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Code: {part['Code / Référence']}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-600">
                          <span>Stock: {part.Quantité}</span>
                          <span>{part.Fournisseur}</span>
                        </div>
                        <div className="text-xs text-blue-600 mt-1 font-medium">
                          Cliquer pour plus de détails →
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Modal de détails employé */}
      {selectedEmployee && (
        <EmployeeDetailModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}

      {/* Modal de détails pièce */}
      {selectedPart && (
        <PartDetailModal
          part={selectedPart}
          onClose={() => setSelectedPart(null)}
        />
      )}
    </div>
  );
};

export default DetailPanel;
