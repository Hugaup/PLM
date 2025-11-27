import React, { useState, useMemo } from 'react';
import { AlertTriangle, Clock, Euro, Wrench, TrendingDown, Factory } from 'lucide-react';
import PartDetailModal from './PartDetailModal';

const MissingParts = ({ stages, partsByReference }) => {
  const [selectedPart, setSelectedPart] = useState(null);

  // Calculer les pièces manquantes
  const missingParts = useMemo(() => {
    const needs = {};
    
    stages.forEach(stage => {
      stage.postes.forEach(poste => {
        if (poste.reference) {
          const refs = poste.reference.split(';').map(r => r.trim()).filter(r => r);
          
          refs.forEach(ref => {
            const part = partsByReference[ref];
            if (part) {
              if (!needs[ref]) {
                needs[ref] = {
                  part: part,
                  requiredQuantity: 0,
                  usedInStages: [],
                  usedInPostes: []
                };
              }
              needs[ref].requiredQuantity += 1;
              
              if (!needs[ref].usedInStages.includes(stage.name)) {
                needs[ref].usedInStages.push(stage.name);
              }
              needs[ref].usedInPostes.push({
                stage: stage.name,
                poste: poste.poste_id
              });
            }
          });
        }
      });
    });

    // Filtrer uniquement les pièces manquantes
    return Object.entries(needs)
      .map(([ref, data]) => {
        const part = data.part;
        const required = data.requiredQuantity;
        const available = part.Quantité;
        const missing = required - available;

        if (missing <= 0) return null; // Quantité suffisante

        return {
          reference: ref,
          designation: part.Désignation,
          required: required,
          available: available,
          missing: missing,
          criticite: part.Criticité,
          fournisseur: part.Fournisseur,
          delai: part['Délai Approvisionnement'],
          caoTime: part['Temps CAO (h)'],
          unitCost: part['Coût achat pièce (€)'],
          totalCost: part['Coût achat pièce (€)'] * missing,
          usedInStages: data.usedInStages,
          usedInPostes: data.usedInPostes,
          part: part
        };
      })
      .filter(item => item !== null)
      .sort((a, b) => {
        // Trier par criticité puis par nombre manquant
        const critOrder = { 'Critique': 0, 'Haute': 1, 'Moyenne': 2, 'Faible': 3 };
        const critA = critOrder[a.criticite] ?? 4;
        const critB = critOrder[b.criticite] ?? 4;
        if (critA !== critB) return critA - critB;
        return b.missing - a.missing;
      });
  }, [stages, partsByReference]);

  // Statistiques globales
  const stats = useMemo(() => {
    const totalMissing = missingParts.reduce((sum, p) => sum + p.missing, 0);
    const totalCost = missingParts.reduce((sum, p) => sum + p.totalCost, 0);
    const totalCAO = missingParts.reduce((sum, p) => sum + (p.caoTime * p.missing), 0);
    const delays = missingParts.map(p => p.delai).filter(d => d && !isNaN(d));
    const maxDelay = delays.length > 0 ? Math.max(...delays) : 0;
    const criticalCount = missingParts.filter(p => p.criticite?.toLowerCase() === 'critique').length;

    return { 
      totalMissing, 
      totalCost, 
      totalCAO, 
      maxDelay,
      criticalCount,
      typesCount: missingParts.length 
    };
  }, [missingParts]);

  const getCriticalityBadge = (criticite) => {
    const level = criticite?.toLowerCase();
    if (level === 'critique') return 'bg-red-100 text-red-800 border-red-300';
    if (level === 'haute') return 'bg-orange-100 text-orange-800 border-orange-300';
    if (level === 'moyenne') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-green-100 text-green-800 border-green-300';
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <AlertTriangle className="w-7 h-7 text-red-600" />
            Pièces Manquantes
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Liste des pièces à commander pour la production
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-5 gap-3 mb-4">
          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
            <div className="text-xs text-red-600 font-semibold mb-1">TYPES MANQUANTS</div>
            <div className="text-2xl font-bold text-red-900">{stats.typesCount}</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
            <div className="text-xs text-orange-600 font-semibold mb-1">TOTAL PIÈCES</div>
            <div className="text-2xl font-bold text-orange-900">{stats.totalMissing}</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="text-xs text-blue-600 font-semibold mb-1">COÛT TOTAL</div>
            <div className="text-lg font-bold text-blue-900">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', notation: 'compact' }).format(stats.totalCost)}
            </div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
            <div className="text-xs text-purple-600 font-semibold mb-1">TEMPS CAO</div>
            <div className="text-2xl font-bold text-purple-900">{stats.totalCAO.toFixed(0)} h</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <div className="text-xs text-yellow-600 font-semibold mb-1">DÉLAI MAX</div>
            <div className="text-2xl font-bold text-yellow-900">{stats.maxDelay} j</div>
          </div>
        </div>

        {/* Alerte critique */}
        {stats.criticalCount > 0 && (
          <div className="p-3 bg-red-50 border-2 border-red-400 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-700 mt-0.5" />
            <div className="text-sm text-red-800">
              <strong>URGENT :</strong> {stats.criticalCount} type(s) de pièce(s) critique(s) manquant(es) ! 
              Commander immédiatement pour éviter l'arrêt de production.
            </div>
          </div>
        )}

        {missingParts.length === 0 && (
          <div className="p-4 bg-green-50 border border-green-300 rounded-lg text-center">
            <div className="text-green-800 font-semibold">
              ✅ Toutes les pièces sont en stock suffisant !
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      {missingParts.length > 0 && (
        <div className="flex-1 overflow-auto p-4">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Référence</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Désignation</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Manquant</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Criticité</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Fournisseur</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Délai</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Temps CAO</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Coût</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {missingParts.map((item) => (
                  <tr 
                    key={item.reference} 
                    className={`hover:bg-gray-50 transition-colors ${
                      item.criticite?.toLowerCase() === 'critique' ? 'bg-red-50' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">{item.reference}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-800">{item.designation}</div>
                      <div className="text-xs text-gray-500">
                        Stock: {item.available} / Requis: {item.required}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-3 py-1.5 bg-red-100 text-red-800 rounded-full text-base font-bold">
                        {item.missing}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getCriticalityBadge(item.criticite)}`}>
                        {item.criticite}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <Factory className="w-3 h-3" />
                        {item.fournisseur}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm font-semibold text-gray-800">
                        <Clock className="w-4 h-4 text-yellow-600" />
                        {item.delai} jours
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="text-sm text-gray-700">
                        {(item.caoTime * item.missing).toFixed(1)} h
                      </div>
                      <div className="text-xs text-gray-500">
                        ({item.caoTime}h × {item.missing})
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-gray-900">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', notation: 'compact' }).format(item.totalCost)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', notation: 'compact' }).format(item.unitCost)}/u
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedPart(item.part)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
                      >
                        Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Résumé de commande */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-t-2 border-blue-200 p-4">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <div className="text-xs font-semibold text-gray-600 mb-1">TOTAL À COMMANDER</div>
                  <div className="text-xl font-bold text-gray-900">{stats.totalMissing} pièces</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-600 mb-1">BUDGET NÉCESSAIRE</div>
                  <div className="text-xl font-bold text-blue-900">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stats.totalCost)}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-600 mb-1">TEMPS CAO TOTAL</div>
                  <div className="text-xl font-bold text-purple-900">{stats.totalCAO.toFixed(0)} heures</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-600 mb-1">DÉLAI CRITIQUE</div>
                  <div className="text-xl font-bold text-yellow-900">{stats.maxDelay} jours</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de détails */}
      {selectedPart && (
        <PartDetailModal
          part={selectedPart}
          onClose={() => setSelectedPart(null)}
        />
      )}
    </div>
  );
};

export default MissingParts;
