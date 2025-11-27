import React, { useMemo, useState } from 'react';
import { AlertTriangle, ChevronRight, Filter, X } from 'lucide-react';

const IshikawaDashboard = ({ stages }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);

  // Mapping manuel des 56 aléas vers les 6M
  const problemMapping = {
    "Rupture outillage spécifique": "Matériel",
    "Dysfonctionnement machine soudure": "Matériel",
    "Problème température atelier": "Milieu",
    "Défaillance contrôle qualité": "Mesure",
    "Usure équipements serrage": "Matériel",
    "Incident logiciel robots": "Matériel",
    "Panne système ventilation": "Milieu",
    "Défaut synchronisation": "Méthode",
    "Interruption réseau": "Matériel",
    "Incident manutention": "Méthode",
    "Dérive calibration optique": "Mesure",
    "Usure gabarits": "Matériel",
    "Contamination zone": "Milieu",
    "Défaillance refroidissement": "Matériel",
    "Perte traçabilité": "Méthode",
    "Dysfonctionnement guidage": "Matériel",
    "Incident maintenance": "Matériel",
    "Problème lubrification": "Matériel",
    "Défaut communication": "Méthode",
    "Déformation supports": "Matériel",
    "Impact variations pression": "Milieu",
    "Incident ventilation": "Milieu",
    "Dérive calibration": "Mesure",
    "Contamination": "Milieu",
    "Dysfonctionnement transport": "Matériel",
    "Surchauffe critique": "Milieu",
    "Perte référencement": "Méthode",
    "Usure systèmes serrage": "Matériel",
    "Incident électrique": "Matériel",
    "Défaillance majeure systèmes": "Matériel",
    "Problème communication inter-systèmes": "Méthode",
    "Dysfonctionnement guidage automatisé": "Matériel",
    "Contamination zone travail sensible": "Milieu",
    "Défaillance critique système contrôle": "Mesure",
    "Usure prématurée outillages précision": "Matériel",
    "Impact variations thermiques": "Milieu",
    "Désynchronisation postes travail": "Méthode",
    "Incident ventilation affectant qualité": "Milieu",
    "Dérive calibration instruments": "Mesure",
    "Contamination zones critiques": "Milieu",
    "Dysfonctionnement transport pièces": "Matériel",
    "Défaillance protocoles sécurité industrielle": "Méthode",
    "Problème calibration systèmes": "Mesure",
    "Impact vibrations sur précision": "Milieu",
    "Perte traçabilité composants": "Méthode",
    "Dysfonctionnement systèmes guidage": "Matériel",
    "Contamination environnement production": "Milieu",
    "Défaillance critique contrôle qualité": "Mesure",
    "Dérive paramètres production": "Mesure",
    "Problème connectique électrique": "Matériel",
    "Défaut adhérence supports": "Matière",
    "Problème impression marquages": "Matériel",
    "Défaut positionnement étiquettes": "Méthode",
    "Instabilité processus marquage": "Méthode",
    "Erreur placement stickers": "Main d'œuvre"
  };

  // Collecter tous les problèmes avec leurs détails
  const allProblems = useMemo(() => {
    const problems = [];
    stages.forEach(stage => {
      stage.postes.forEach(poste => {
        if (poste.aleas) {
          const category = problemMapping[poste.aleas] || "Non classifié";
          problems.push({
            posteId: poste.poste_id,
            stage: stage.name,
            aleas: poste.aleas,
            cause: poste.cause,
            category: category,
            tempsPrevu: poste.temps_prevu,
            tempsReel: poste.temps_reel
          });
        }
      });
    });
    return problems;
  }, [stages]);

  // Statistiques par catégorie 6M
  const categoryStats = useMemo(() => {
    const stats = {
      "Matériel": { count: 0, problems: [], color: '#ef4444', icon: '🔧' },
      "Matière": { count: 0, problems: [], color: '#f97316', icon: '📦' },
      "Méthode": { count: 0, problems: [], color: '#eab308', icon: '📋' },
      "Main d'œuvre": { count: 0, problems: [], color: '#22c55e', icon: '👷' },
      "Milieu": { count: 0, problems: [], color: '#3b82f6', icon: '🌡️' },
      "Mesure": { count: 0, problems: [], color: '#8b5cf6', icon: '📏' }
    };

    allProblems.forEach(problem => {
      if (stats[problem.category]) {
        stats[problem.category].count++;
        stats[problem.category].problems.push(problem);
      }
    });

    return stats;
  }, [allProblems]);

  const totalProblems = allProblems.length;
  const filteredProblems = selectedCategory 
    ? categoryStats[selectedCategory]?.problems || []
    : allProblems;

  return (
    <div className="h-full overflow-auto bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          🐟 Analyse Ishikawa (6M)
        </h1>
        <p className="text-gray-600 mt-1">Diagramme en arêtes de poisson - Analyse des causes racines</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        {Object.entries(categoryStats).map(([category, data]) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
            className={`p-4 rounded-lg shadow transition-all transform hover:scale-105 ${
              selectedCategory === category 
                ? 'ring-4 ring-blue-400 scale-105' 
                : 'hover:shadow-lg'
            }`}
            style={{ backgroundColor: `${data.color}20`, borderLeft: `4px solid ${data.color}` }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">{data.icon}</span>
              <span className="text-3xl font-bold" style={{ color: data.color }}>
                {data.count}
              </span>
            </div>
            <div className="text-sm font-semibold text-gray-700">{category}</div>
            <div className="text-xs text-gray-500 mt-1">
              {((data.count / totalProblems) * 100).toFixed(1)}%
            </div>
          </button>
        ))}
      </div>

      {/* Filtre actif */}
      {selectedCategory && (
        <div className="mb-4 p-3 bg-blue-50 border-2 border-blue-300 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-700" />
            <span className="font-semibold text-blue-900">
              Filtre actif : {selectedCategory} ({filteredProblems.length} problèmes)
            </span>
          </div>
          <button
            onClick={() => setSelectedCategory(null)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Tout afficher
          </button>
        </div>
      )}

      {/* Diagramme Ishikawa visuel */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
          Diagramme en Arêtes de Poisson
        </h2>
        
        <div className="relative mx-auto" style={{ height: '500px', maxWidth: '1200px' }}>
          {/* Ligne centrale (arête principale) */}
          <div className="absolute left-0 right-20 top-1/2 h-0.5 bg-gray-800" style={{ transform: 'translateY(-50%)' }}></div>
          
          {/* Tête du poisson (Problème principal) */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
            <div className="bg-red-100 border-4 border-red-500 rounded-full w-28 h-28 flex items-center justify-center shadow-lg">
              <div className="text-center">
                <AlertTriangle className="w-7 h-7 text-red-600 mx-auto mb-1" />
                <div className="text-sm font-bold text-red-900">{totalProblems}</div>
                <div className="text-xs text-red-700">Problèmes</div>
              </div>
            </div>
          </div>

          {/* Arêtes supérieures */}
          <div className="absolute left-[6%] top-[20%]">
            <div className="relative">
              <div className="absolute h-0.5 bg-red-500 origin-left" style={{ width: '300px', transform: 'rotate(30deg)' }}></div>
              <div className="absolute left-0 bg-red-50 border-2 border-red-500 rounded-lg p-2.5 shadow-lg w-44 cursor-pointer hover:bg-red-100 transition-colors" style={{ top: '-56px' }}
                   onClick={() => setSelectedCategory('Matériel')}>
                <div className="text-2xl mb-1">{categoryStats['Matériel'].icon}</div>
                <div className="font-bold text-sm text-red-900">Matériel</div>
                <div className="text-xs text-red-700">{categoryStats['Matériel'].count} problèmes</div>
              </div>
            </div>
          </div>

          <div className="absolute left-[30%] top-[20%]">
            <div className="relative">
              <div className="absolute h-0.5 bg-orange-500 origin-left" style={{ width: '300px', transform: 'rotate(30deg)' }}></div>
              <div className="absolute left-0 bg-orange-50 border-2 border-orange-500 rounded-lg p-2.5 shadow-lg w-44 cursor-pointer hover:bg-orange-100 transition-colors" style={{ top: '-56px' }}
                   onClick={() => setSelectedCategory('Matière')}>
                <div className="text-2xl mb-1">{categoryStats['Matière'].icon}</div>
                <div className="font-bold text-sm text-orange-900">Matière</div>
                <div className="text-xs text-orange-700">{categoryStats['Matière'].count} problèmes</div>
              </div>
            </div>
          </div>

          <div className="absolute left-[54%] top-[20%]">
            <div className="relative">
              <div className="absolute h-0.5 bg-yellow-500 origin-left" style={{ width: '300px', transform: 'rotate(30deg)' }}></div>
              <div className="absolute left-0 bg-yellow-50 border-2 border-yellow-500 rounded-lg p-2.5 shadow-lg w-44 cursor-pointer hover:bg-yellow-100 transition-colors" style={{ top: '-56px' }}
                   onClick={() => setSelectedCategory('Méthode')}>
                <div className="text-2xl mb-1">{categoryStats['Méthode'].icon}</div>
                <div className="font-bold text-sm text-yellow-900">Méthode</div>
                <div className="text-xs text-yellow-700">{categoryStats['Méthode'].count} problèmes</div>
              </div>
            </div>
          </div>

          {/* Arêtes inférieures */}
          <div className="absolute left-[6%] bottom-[20%]">
            <div className="relative">
              <div className="absolute h-0.5 bg-green-500 origin-left" style={{ width: '300px', transform: 'rotate(-30deg)' }}></div>
              <div className="absolute left-0 bg-green-50 border-2 border-green-500 rounded-lg p-2.5 shadow-lg w-44 cursor-pointer hover:bg-green-100 transition-colors" style={{ bottom: '-56px' }}
                   onClick={() => setSelectedCategory('Main d\'œuvre')}>
                <div className="text-2xl mb-1">{categoryStats['Main d\'œuvre'].icon}</div>
                <div className="font-bold text-sm text-green-900">Main d'œuvre</div>
                <div className="text-xs text-green-700">{categoryStats['Main d\'œuvre'].count} problèmes</div>
              </div>
            </div>
          </div>

          <div className="absolute left-[30%] bottom-[20%]">
            <div className="relative">
              <div className="absolute h-0.5 bg-blue-500 origin-left" style={{ width: '300px', transform: 'rotate(-30deg)' }}></div>
              <div className="absolute left-0 bg-blue-50 border-2 border-blue-500 rounded-lg p-2.5 shadow-lg w-44 cursor-pointer hover:bg-blue-100 transition-colors" style={{ bottom: '-56px' }}
                   onClick={() => setSelectedCategory('Milieu')}>
                <div className="text-2xl mb-1">{categoryStats['Milieu'].icon}</div>
                <div className="font-bold text-sm text-blue-900">Milieu</div>
                <div className="text-xs text-blue-700">{categoryStats['Milieu'].count} problèmes</div>
              </div>
            </div>
          </div>

          <div className="absolute left-[54%] bottom-[20%]">
            <div className="relative">
              <div className="absolute h-0.5 bg-purple-500 origin-left" style={{ width: '300px', transform: 'rotate(-30deg)' }}></div>
              <div className="absolute left-0 bg-purple-50 border-2 border-purple-500 rounded-lg p-2.5 shadow-lg w-44 cursor-pointer hover:bg-purple-100 transition-colors" style={{ bottom: '-56px' }}
                   onClick={() => setSelectedCategory('Mesure')}>
                <div className="text-2xl mb-1">{categoryStats['Mesure'].icon}</div>
                <div className="font-bold text-sm text-purple-900">Mesure</div>
                <div className="text-xs text-purple-700">{categoryStats['Mesure'].count} problèmes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des problèmes */}
      <div className="bg-white rounded-lg shadow">
        <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {selectedCategory ? `Problèmes - ${selectedCategory}` : 'Tous les Problèmes'}
            <span className="text-gray-600 font-normal ml-2">({filteredProblems.length})</span>
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200 max-h-96 overflow-auto">
          {filteredProblems.map((problem, index) => (
            <div 
              key={index}
              className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => setSelectedProblem(selectedProblem === problem ? null : problem)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: categoryStats[problem.category]?.color }}
                    ></span>
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      {problem.category}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">Poste {problem.posteId}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{problem.stage}</span>
                  </div>
                  <div className="font-semibold text-gray-900 mb-1">{problem.aleas}</div>
                  {selectedProblem === problem && (
                    <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
                      <div className="text-sm text-gray-700 mb-2">
                        <strong>Cause :</strong> {problem.cause}
                      </div>
                      <div className="flex gap-4 text-xs text-gray-600">
                        <div>
                          <strong>Temps prévu :</strong> {problem.tempsPrevu}
                        </div>
                        <div>
                          <strong>Temps réel :</strong> {problem.tempsReel}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${selectedProblem === problem ? 'rotate-90' : ''}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analyse */}
      <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-3">📊 Analyse par Catégorie</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <strong className="text-blue-900">Catégorie dominante :</strong>
            <div className="mt-1">
              {Object.entries(categoryStats)
                .sort((a, b) => b[1].count - a[1].count)[0][0]} 
              ({Object.entries(categoryStats).sort((a, b) => b[1].count - a[1].count)[0][1].count} problèmes)
            </div>
          </div>
          <div>
            <strong className="text-blue-900">Total des aléas :</strong>
            <div className="mt-1">{totalProblems} problèmes identifiés</div>
          </div>
          <div>
            <strong className="text-blue-900">Recommandation :</strong>
            <div className="mt-1">Prioriser les actions sur la catégorie principale</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IshikawaDashboard;
