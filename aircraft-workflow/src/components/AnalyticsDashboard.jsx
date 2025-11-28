import React, { useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, AlertTriangle, Users, Package, Clock, Euro } from 'lucide-react';

const AnalyticsDashboard = ({ stages, employees, parts, partsByReference }) => {
  // 1. Performance des Postes - Temps prévu vs réel
  const performanceData = useMemo(() => {
    const data = [];
    stages.forEach(stage => {
      stage.postes.forEach(poste => {
        const prevuMinutes = poste.temps_prevu ? 
          parseInt(poste.temps_prevu.split(':')[0]) * 60 + parseInt(poste.temps_prevu.split(':')[1]) : 0;
        const reelMinutes = poste.temps_reel ? 
          parseInt(poste.temps_reel.split(':')[0]) * 60 + parseInt(poste.temps_reel.split(':')[1]) : 0;
        
        if (prevuMinutes > 0) {
          const retard = ((reelMinutes - prevuMinutes) / prevuMinutes * 100).toFixed(1);
          data.push({
            name: `Poste ${poste.poste_id}`,
            prevu: prevuMinutes,
            reel: reelMinutes,
            retard: parseFloat(retard)
          });
        }
      });
    });
    return data.slice(0, 15); // Top 15 postes
  }, [stages]);

  // 2. Causes des problèmes
  const problemsData = useMemo(() => {
    const causes = {};
    stages.forEach(stage => {
      stage.postes.forEach(poste => {
        if (poste.aleas) {
          const key = poste.aleas;
          causes[key] = (causes[key] || 0) + 1;
        }
      });
    });
    
    return Object.entries(causes)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [stages]);

  // 3. Stock par criticité
  const stockByCriticality = useMemo(() => {
    const critical = { critique: 0, haute: 0, moyenne: 0, faible: 0 };
    const needs = {};
    
    // Calculer les besoins
    stages.forEach(stage => {
      stage.postes.forEach(poste => {
        if (poste.reference) {
          const refs = poste.reference.split(';').map(r => r.trim()).filter(r => r);
          refs.forEach(ref => {
            needs[ref] = (needs[ref] || 0) + 1;
          });
        }
      });
    });

    // Utiliser partsByReference pour matcher correctement
    Object.entries(needs).forEach(([ref, required]) => {
      const part = partsByReference[ref];
      if (part) {
        const level = part.Criticité?.toLowerCase();
        const available = part.Quantité || 0;
        const missing = Math.max(0, required - available);
        
        if (level in critical) {
          critical[level] += missing;
        }
      }
    });

    return [
      { name: 'Critique', value: critical.critique, color: '#ef4444' },
      { name: 'Haute', value: critical.haute, color: '#f97316' },
      { name: 'Moyenne', value: critical.moyenne, color: '#eab308' },
      { name: 'Faible', value: critical.faible, color: '#22c55e' }
    ].filter(d => d.value > 0);
  }, [stages, partsByReference]);

  // 4. Répartition des employés par qualification
  const employeesByQualification = useMemo(() => {
    const qualif = {};
    employees.forEach(emp => {
      const q = emp.Qualification || 'Non spécifié';
      qualif[q] = (qualif[q] || 0) + 1;
    });
    
    return Object.entries(qualif)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [employees]);

  // 5. KPIs globaux
  const kpis = useMemo(() => {
    let totalRetard = 0;
    let totalAleas = 0;
    let totalPostes = 0;
    let coutRetards = 0;

    // Créer un index des employés par matricule pour accès rapide
    const employeesByMatricule = {};
    employees.forEach(emp => {
      employeesByMatricule[emp.Matricule] = emp;
    });

    stages.forEach(stage => {
      stage.postes.forEach(poste => {
        totalPostes++;
        if (poste.aleas) totalAleas++;
        
        const prevuMinutes = poste.temps_prevu ? 
          parseInt(poste.temps_prevu.split(':')[0]) * 60 + parseInt(poste.temps_prevu.split(':')[1]) : 0;
        const reelMinutes = poste.temps_reel ? 
          parseInt(poste.temps_reel.split(':')[0]) * 60 + parseInt(poste.temps_reel.split(':')[1]) : 0;
        
        if (reelMinutes > prevuMinutes) {
          const retardMinutes = reelMinutes - prevuMinutes;
          totalRetard += retardMinutes;
          
          // Calculer le temps de retard majoré (arrondi à l'heure supérieure)
          const retardHeures = retardMinutes / 60;
          const retardMajore = Math.ceil(retardHeures); // 0.5h → 1h, 1.1h → 2h
          
          // Calculer le coût horaire total des employés sur ce poste
          let coutHorairePoste = 0;
          if (poste.employees && poste.employees.length > 0) {
            poste.employees.forEach(emp => {
              const employeeData = employeesByMatricule[emp.Matricule];
              if (employeeData && employeeData['Coût horaire (€)']) {
                coutHorairePoste += employeeData['Coût horaire (€)'];
              }
            });
          }
          
          // Coût du retard = temps majoré × coût horaire total du poste
          coutRetards += retardMajore * coutHorairePoste;
        }
      });
    });

    const tauxRetard = totalPostes > 0 ? ((totalAleas / totalPostes) * 100).toFixed(1) : 0;
    const piecesCritiques = stockByCriticality.find(d => d.name === 'Critique')?.value || 0;

    return {
      tauxRetard,
      totalAleas,
      coutRetards: Math.round(coutRetards),
      piecesCritiques,
      heuresRetard: Math.round(totalRetard / 60)
    };
  }, [stages, employees, stockByCriticality]);

  // 6. Coûts par fournisseur
  const costBySupplier = useMemo(() => {
    const suppliers = {};
    const needs = {};
    
    // Calculer les besoins
    stages.forEach(stage => {
      stage.postes.forEach(poste => {
        if (poste.reference) {
          const refs = poste.reference.split(';').map(r => r.trim()).filter(r => r);
          refs.forEach(ref => {
            needs[ref] = (needs[ref] || 0) + 1;
          });
        }
      });
    });

    // Utiliser partsByReference pour matcher correctement
    Object.entries(needs).forEach(([ref, required]) => {
      const part = partsByReference[ref];
      if (part) {
        const supplier = part.Fournisseur || 'Inconnu';
        const available = part.Quantité || 0;
        const missing = Math.max(0, required - available);
        const cost = missing * (part['Coût achat pièce (€)'] || 0);
        
        if (missing > 0) {
          if (!suppliers[supplier]) {
            suppliers[supplier] = { name: supplier, cout: 0, pieces: 0 };
          }
          suppliers[supplier].cout += cost;
          suppliers[supplier].pieces += missing;
        }
      }
    });

    return Object.values(suppliers)
      .filter(s => s.cout > 0)
      .sort((a, b) => b.cout - a.cout)
      .slice(0, 8);
  }, [stages, partsByReference]);

  const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  return (
    <div className="h-full overflow-auto bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          📊 Analyse & Indicateurs
        </h1>
        <p className="text-gray-600 mt-1">Tableaux de bord et statistiques de production</p>
      </div>

      {/* KPIs Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg shadow border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div className="text-3xl font-bold text-red-900">{kpis.tauxRetard}%</div>
          </div>
          <div className="text-sm font-semibold text-red-700">Taux de Problèmes</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg shadow border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
            <div className="text-3xl font-bold text-orange-900">{kpis.totalAleas}</div>
          </div>
          <div className="text-sm font-semibold text-orange-700">Aléas Détectés</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-blue-600" />
            <div className="text-3xl font-bold text-blue-900">{kpis.heuresRetard}h</div>
          </div>
          <div className="text-sm font-semibold text-blue-700">Retard Total</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg shadow border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Euro className="w-8 h-8 text-purple-600" />
            <div className="text-2xl font-bold text-purple-900">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', notation: 'compact' }).format(kpis.coutRetards)}
            </div>
          </div>
          <div className="text-sm font-semibold text-purple-700">Coût Retards</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg shadow border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 text-red-600" />
            <div className="text-3xl font-bold text-red-900">{kpis.piecesCritiques}</div>
          </div>
          <div className="text-sm font-semibold text-red-700">Pièces Critiques</div>
        </div>
      </div>

      {/* Row 1: Performance & Causes */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Performance des Postes */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Performance des Postes (Top 15)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="prevu" fill="#3b82f6" name="Temps Prévu" />
              <Bar dataKey="reel" fill="#ef4444" name="Temps Réel" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-gray-600 text-center">
            Comparaison des temps prévus et réels par poste
          </div>
        </div>

        {/* Causes des Problèmes */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            Top 6 Causes des Problèmes
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={problemsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name.substring(0, 20)}... (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {problemsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-gray-600 text-center">
            Répartition des aléas par type
          </div>
        </div>
      </div>

      {/* Row 2: Stock & Employés */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Stock par Criticité */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Package className="w-6 h-6 text-red-600" />
            Pièces Manquantes par Criticité
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stockByCriticality}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Quantité Manquante', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="value" name="Pièces Manquantes">
                {stockByCriticality.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-gray-600 text-center">
            Distribution des pièces manquantes selon leur criticité
          </div>
        </div>

        {/* Employés par Qualification */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-green-600" />
            Répartition par Qualification
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={employeesByQualification} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" name="Nombre d'employés" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-gray-600 text-center">
            Distribution des {employees.length} employés par niveau de qualification
          </div>
        </div>
      </div>

      {/* Row 3: Coûts par Fournisseur */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Euro className="w-6 h-6 text-purple-600" />
          Coût des Pièces Manquantes par Fournisseur
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={costBySupplier}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis label={{ value: 'Coût (€)', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)} />
            <Legend />
            <Bar dataKey="cout" fill="#8b5cf6" name="Coût Total" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-sm text-gray-600 text-center">
          Budget nécessaire pour combler les manques par fournisseur
        </div>
      </div>

      {/* Analyse détaillée */}
      <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-3">📈 Analyse Synthétique</h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <strong>Points critiques :</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>{kpis.totalAleas} aléas détectés sur l'ensemble du workflow</li>
              <li>{kpis.heuresRetard}h de retard cumulé (≈ {kpis.coutRetards.toLocaleString('fr-FR')}€)*</li>
              <li>{kpis.piecesCritiques} pièces critiques manquantes</li>
              <li className="text-xs text-gray-500 mt-2">* Coût du retard = temps majoré (arrondi heure sup.) × coût horaire des employés du poste</li>
            </ul>
          </div>
          <div>
            <strong>Recommandations :</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Prioriser la commande des pièces critiques</li>
              <li>Maintenance préventive sur les postes à retard récurrent</li>
              <li>Renforcer les équipes sur les qualifications sous-représentées</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
