import React, { useState, useMemo } from 'react';
import { Search, X, Package, TrendingUp } from 'lucide-react';
import PartDetailModal from './PartDetailModal';

const PartsDirectory = ({ parts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPart, setSelectedPart] = useState(null);
  const [filters, setFilters] = useState({
    fournisseur: '',
    criticite: '',
  });

  // Extraire les valeurs uniques pour les filtres
  const allFournisseurs = useMemo(() => {
    return [...new Set(parts.map(p => p.Fournisseur))].sort();
  }, [parts]);

  const allCriticites = useMemo(() => {
    return [...new Set(parts.map(p => p.Criticité))].sort();
  }, [parts]);

  // Filtrer les pièces
  const filteredParts = useMemo(() => {
    return parts.filter(part => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        part.Désignation.toLowerCase().includes(searchLower) ||
        part['Code / Référence'].toLowerCase().includes(searchLower) ||
        part.Fournisseur.toLowerCase().includes(searchLower);

      const matchesFournisseur = !filters.fournisseur || part.Fournisseur === filters.fournisseur;
      const matchesCriticite = !filters.criticite || part.Criticité === filters.criticite;

      return matchesSearch && matchesFournisseur && matchesCriticite;
    });
  }, [parts, searchTerm, filters]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      fournisseur: '',
      criticite: '',
    });
  };

  const hasActiveFilters = searchTerm || Object.values(filters).some(f => f);

  const getCriticalityColor = (criticite) => {
    const level = criticite?.toLowerCase();
    if (level === 'critique') return 'text-red-600';
    if (level === 'haute') return 'text-orange-600';
    if (level === 'moyenne') return 'text-yellow-600';
    return 'text-green-600';
  };

  const getCriticalityBadge = (criticite) => {
    const level = criticite?.toLowerCase();
    if (level === 'critique') return 'bg-red-100 text-red-800 border-red-300';
    if (level === 'haute') return 'bg-orange-100 text-orange-800 border-orange-300';
    if (level === 'moyenne') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-green-100 text-green-800 border-green-300';
  };

  // Calculer les statistiques
  const totalCost = filteredParts.reduce((sum, p) => sum + (p['Coût achat pièce (€)'] * p.Quantité), 0);
  const totalMass = filteredParts.reduce((sum, p) => sum + (p['Masse (kg)'] * p.Quantité), 0);
  const totalCAO = filteredParts.reduce((sum, p) => sum + p['Temps CAO (h)'], 0);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Package className="w-7 h-7" />
              Catalogue des Pièces
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {filteredParts.length} pièce(s) {hasActiveFilters && `sur ${parts.length}`}
            </p>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg flex items-center gap-2 transition-colors"
            >
              <X className="w-4 h-4" />
              Réinitialiser filtres
            </button>
          )}
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="text-xs text-blue-600 font-semibold mb-1">COÛT TOTAL</div>
            <div className="text-lg font-bold text-blue-900">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', notation: 'compact' }).format(totalCost)}
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="text-xs text-green-600 font-semibold mb-1">MASSE TOTALE</div>
            <div className="text-lg font-bold text-green-900">{totalMass.toFixed(0)} kg</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
            <div className="text-xs text-purple-600 font-semibold mb-1">TEMPS CAO</div>
            <div className="text-lg font-bold text-purple-900">{totalCAO} h</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
            <div className="text-xs text-orange-600 font-semibold mb-1">TYPES DE PIÈCES</div>
            <div className="text-lg font-bold text-orange-900">{filteredParts.length}</div>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par désignation, référence, fournisseur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filtres */}
        <div className="grid grid-cols-2 gap-3">
          <select
            value={filters.fournisseur}
            onChange={(e) => setFilters({ ...filters, fournisseur: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les fournisseurs</option>
            {allFournisseurs.map(f => <option key={f} value={f}>{f}</option>)}
          </select>

          <select
            value={filters.criticite}
            onChange={(e) => setFilters({ ...filters, criticite: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toutes les criticités</option>
            {allCriticites.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-4">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Référence</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Désignation</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Quantité</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Fournisseur</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Criticité</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Masse</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Coût Total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredParts.map((part) => (
                <tr key={part['Code / Référence']} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">{part['Code / Référence']}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-800">{part.Désignation}</div>
                    <div className="text-xs text-gray-500">{part['Temps CAO (h)']}h CAO</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                      {part.Quantité}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <div>{part.Fournisseur}</div>
                    <div className="text-xs text-gray-500">{part['Délai Approvisionnement']}j</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getCriticalityBadge(part.Criticité)}`}>
                      {part.Criticité}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {part['Masse (kg)']} kg
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', notation: 'compact' }).format(
                      part['Coût achat pièce (€)'] * part.Quantité
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedPart(part)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
                    >
                      Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredParts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>Aucune pièce trouvée</p>
            </div>
          )}
        </div>
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

export default PartsDirectory;
