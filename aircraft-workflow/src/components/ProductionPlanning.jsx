import React, { useState, useMemo } from 'react';
import { Package, CheckCircle, AlertTriangle, Clock, Euro, Wrench, Factory } from 'lucide-react';
import PartDetailModal from './PartDetailModal';

const ProductionPlanning = ({ stages, partsByReference }) => {
  const [selectedPart, setSelectedPart] = useState(null);

  // Calculer les besoins en pièces pour tout le workflow
  const productionNeeds = useMemo(() => {
    const needs = {};
    
    stages.forEach(stage => {
      stage.postes.forEach(poste => {
        if (poste.reference) {
          // Parser les références séparées par ";"
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
              needs[ref].requiredQuantity += 1; // Chaque poste utilise 1 unité
              
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

    return needs;
  }, [stages, partsByReference]);

  // Convertir en tableau et ajouter les calculs
  const productionList = useMemo(() => {
    return Object.entries(productionNeeds).map(([ref, data]) => {
      const part = data.part;
      const required = data.requiredQuantity;
      const available = part.Quantité;
      const remaining = available - required;
      const sufficient = remaining >= 0;

      return {
        reference: ref,
        designation: part.Désignation,
        required: required,
        available: available,
        remaining: remaining,
        sufficient: sufficient,
        criticite: part.Criticité,
        fournisseur: part.Fournisseur,
        delai: part['Délai Approvisionnement'],
        caoTime: part['Temps CAO (h)'],
        unitCost: part['Coût achat pièce (€)'],
        usedInStages: data.usedInStages,
        usedInPostes: data.usedInPostes,
        part: part
      };
    }).sort((a, b) => {
      // Trier: insuffisant d'abord, puis par criticité
      if (a.sufficient !== b.sufficient) return a.sufficient ? 1 : -1;
      return a.designation.localeCompare(b.designation);
    });
  }, [productionNeeds]);

  // Pièces manquantes seulement
  const missingParts = useMemo(() => {
    return productionList
      .filter(p => !p.sufficient)
      .map(p => ({
        reference: p.reference,
        designation: p.designation,
        required: p.required,
        available: p.available,
        missing: Math.abs(p.remaining),
        criticite: p.criticite,
        fournisseur: p.fournisseur,
        delai: p.delai,
        caoTime: p.caoTime,
        unitCost: p.unitCost,
        totalCost: p.unitCost * Math.abs(p.remaining),
        part: p.part
      }))
      .sort((a, b) => {
        const critOrder = { 'Critique': 0, 'Haute': 1, 'Moyenne': 2, 'Faible': 3 };
        const critA = critOrder[a.criticite] ?? 4;
        const critB = critOrder[b.criticite] ?? 4;
        if (critA !== critB) return critA - critB;
        return b.missing - a.missing;
      });
  }, [productionList]);

  // Statistiques globales
  const stats = useMemo(() => {
    const insufficient = productionList.filter(p => !p.sufficient).length;
    const sufficient = productionList.filter(p => p.sufficient).length;
    const critical = productionList.filter(p => !p.sufficient && p.criticite?.toLowerCase() === 'critique').length;
    
    // Calculer le nombre total de pièces manquantes (pas équilibré avec les excédents)
    const totalMissing = productionList
      .filter(p => !p.sufficient)
      .reduce((sum, p) => sum + Math.abs(p.remaining), 0);
    
    // Stats pour les pièces manquantes
    const totalCost = missingParts.reduce((sum, p) => sum + p.totalCost, 0);
    const totalCAO = missingParts.reduce((sum, p) => sum + (p.caoTime * p.missing), 0);
    const delays = missingParts.map(p => p.delai).filter(d => d && !isNaN(d));
    const maxDelay = delays.length > 0 ? Math.max(...delays) : 0;

    return { insufficient, sufficient, critical, total: productionList.length, totalMissing, totalCost, totalCAO, maxDelay };
  }, [productionList, missingParts]);

  const getCriticalityBadge = (criticite) => {
    const level = criticite?.toLowerCase();
    if (level === 'critique') return 'bg-red-100 text-red-800 border-red-300';
    if (level === 'haute') return 'bg-orange-100 text-orange-800 border-orange-300';
    if (level === 'moyenne') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-green-100 text-green-800 border-green-300';
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="w-7 h-7 text-blue-600" />
            Planification Production
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Besoins en pièces pour la construction d'un avion complet
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-7 gap-3">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="text-xs text-blue-600 font-semibold mb-1">TOTAL PIÈCES</div>
            <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="text-xs text-green-600 font-semibold mb-1">SUFFISANT</div>
            <div className="text-2xl font-bold text-green-900">{stats.sufficient}</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
            <div className="text-xs text-orange-600 font-semibold mb-1">TYPES MANQUANTS</div>
            <div className="text-2xl font-bold text-orange-900">{stats.insufficient}</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
            <div className="text-xs text-red-600 font-semibold mb-1">QTÉ MANQUANTE</div>
            <div className="text-2xl font-bold text-red-900">{stats.totalMissing}</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
            <div className="text-xs text-purple-600 font-semibold mb-1">TEMPS CAO</div>
            <div className="text-xl font-bold text-purple-900">{stats.totalCAO.toFixed(0)}h</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <div className="text-xs text-yellow-600 font-semibold mb-1">DÉLAI MAX</div>
            <div className="text-xl font-bold text-yellow-900">{stats.maxDelay}j</div>
          </div>
          <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
            <div className="text-xs text-indigo-600 font-semibold mb-1">COÛT TOTAL</div>
            <div className="text-lg font-bold text-indigo-900">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', notation: 'compact' }).format(stats.totalCost)}
            </div>
          </div>
        </div>

        {stats.insufficient > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-700 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <strong>Attention :</strong> {stats.insufficient} type(s) de pièce(s) en quantité insuffisante ({stats.totalMissing} pièces au total). 
              {stats.critical > 0 && ` Dont ${stats.critical} type(s) critique(s).`}
            </div>
          </div>
        )}
      </div>

      {/* Table Vue d'ensemble */}
      <div className="p-4">
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">📊 Vue d'ensemble - Toutes les pièces</h2>
          </div>
          <div className="overflow-auto" style={{ maxHeight: '400px' }}>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Référence</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Désignation</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Requis</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Disponible</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Restant</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Criticité</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Utilisation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {productionList.map((item) => (
                  <tr 
                    key={item.reference} 
                    className={`hover:bg-gray-50 transition-colors ${
                      !item.sufficient ? 'bg-red-50' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      {item.sufficient ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">{item.reference}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedPart(item.part)}
                        className="font-semibold text-blue-600 hover:text-blue-800 text-left"
                      >
                        {item.designation}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-gray-800">{item.required}</td>
                    <td className="px-4 py-3 text-center font-semibold text-gray-800">{item.available}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-bold ${item.sufficient ? 'text-green-600' : 'text-red-600'}`}>
                        {item.remaining > 0 ? `+${item.remaining}` : item.remaining}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getCriticalityBadge(item.criticite)}`}>
                        {item.criticite}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.usedInStages.length} étape(s)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table Pièces manquantes */}
        {missingParts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <div className="text-xl font-bold text-green-800 mb-2">
              ✅ Toutes les pièces sont en stock suffisant !
            </div>
            <div className="text-gray-600">
              Aucune commande nécessaire pour la production.
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-red-100 px-4 py-3 border-b-2 border-red-300 flex items-center justify-between">
              <h2 className="text-lg font-bold text-red-800 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6" />
                ⚠️ Pièces Manquantes - À Commander
              </h2>
              <div className="text-sm font-semibold text-red-700">
                {stats.totalMissing} pièces manquantes
              </div>
            </div>
            <div className="overflow-auto" style={{ maxHeight: '500px' }}>
              <table className="w-full">
                <thead className="bg-red-50 border-b border-red-200 sticky top-0">
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
            </div>

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
        )}
      </div>

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

export default ProductionPlanning;
