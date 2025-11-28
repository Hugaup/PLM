import React, { useMemo, useState } from 'react';
import { Users, TrendingUp, Award, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

const RecommendationAffectation = ({ stages, employees }) => {
  const [selectedPoste, setSelectedPoste] = useState(null);
  const [expandedPoste, setExpandedPoste] = useState(null);

  // Créer un index des employés par matricule
  const employeesByMatricule = useMemo(() => {
    const index = {};
    employees.forEach(emp => {
      index[emp.Matricule] = emp;
    });
    return index;
  }, [employees]);

  // Calculer le niveau moyen de compétences d'un employé
  const calculateSkillLevel = (employee) => {
    if (!employee.Compétences) return 0;
    const skills = employee.Compétences.split(',').map(s => s.trim());
    let totalLevel = 0;
    let count = 0;
    
    skills.forEach(skill => {
      const match = skill.match(/Niveau (\d)/);
      if (match) {
        totalLevel += parseInt(match[1]);
        count++;
      }
    });
    
    return count > 0 ? totalLevel / count : 0;
  };

  // Calculer un score d'expérience basé sur l'âge et le niveau
  const calculateExperienceScore = (employee) => {
    const expMap = {
      'Expert': 5,
      'Confirmé': 4,
      'Intermédiaire': 3,
      'Junior': 2,
      'Débutant': 1
    };
    return expMap[employee["Niveau d'expérience"]] || 0;
  };

  // Extraire les compétences requises d'un poste basé sur les problèmes courants
  const getRequiredSkills = (poste) => {
    const skills = new Set();
    
    // Mapping des aléas vers compétences
    if (poste.aleas) {
      const aleas = poste.aleas.toLowerCase();
      if (aleas.includes('machine') || aleas.includes('outillage') || aleas.includes('équipement')) {
        skills.add('Maintenance');
        skills.add('Montage mécanique');
      }
      if (aleas.includes('soudure')) {
        skills.add('Soudure');
      }
      if (aleas.includes('électrique') || aleas.includes('électronique')) {
        skills.add('Montage électrique');
      }
      if (aleas.includes('qualité') || aleas.includes('contrôle')) {
        skills.add('Contrôle qualité');
      }
      if (aleas.includes('assemblage')) {
        skills.add('Assemblage');
      }
    }
    
    // Par défaut, compétences de base
    if (skills.size === 0) {
      skills.add('Assemblage');
      skills.add('Lecture plan');
    }
    
    return Array.from(skills);
  };

  // Calculer le score de compatibilité d'un employé pour un poste
  const calculateCompatibilityScore = (employee, poste, currentTeam) => {
    let score = 0;
    const details = [];

    // 1. Compétences (40 points max)
    const requiredSkills = getRequiredSkills(poste);
    const employeeSkills = employee.Compétences ? employee.Compétences.toLowerCase() : '';
    let skillMatches = 0;
    let totalSkillLevel = 0;

    requiredSkills.forEach(skill => {
      if (employeeSkills.includes(skill.toLowerCase())) {
        skillMatches++;
        // Extraire le niveau de cette compétence
        const regex = new RegExp(skill.toLowerCase() + '.*niveau (\\d)', 'i');
        const match = employeeSkills.match(regex);
        if (match) {
          totalSkillLevel += parseInt(match[1]);
        }
      }
    });

    const skillScore = requiredSkills.length > 0 
      ? (skillMatches / requiredSkills.length) * 25 + (totalSkillLevel / requiredSkills.length) * 3
      : 20;
    score += skillScore;
    details.push({
      category: 'Compétences',
      score: Math.round(skillScore),
      max: 40,
      description: `${skillMatches}/${requiredSkills.length} compétences requises`
    });

    // 2. Expérience (25 points max)
    const expScore = calculateExperienceScore(employee) * 5;
    score += expScore;
    details.push({
      category: 'Expérience',
      score: expScore,
      max: 25,
      description: employee["Niveau d'expérience"]
    });

    // 3. Niveau moyen de compétences (20 points max)
    const avgSkillLevel = calculateSkillLevel(employee);
    const levelScore = avgSkillLevel * 4;
    score += levelScore;
    details.push({
      category: 'Niveau moyen',
      score: Math.round(levelScore),
      max: 20,
      description: `${avgSkillLevel.toFixed(1)}/5`
    });

    // 4. Complémentarité avec l'équipe actuelle (15 points max)
    let teamScore = 10; // Score par défaut si pas d'équipe
    if (currentTeam && currentTeam.length > 0) {
      const teamLevels = currentTeam.map(m => calculateExperienceScore(employeesByMatricule[m.Matricule] || m));
      const avgTeamLevel = teamLevels.reduce((a, b) => a + b, 0) / teamLevels.length;
      const empLevel = calculateExperienceScore(employee);
      
      // Bonus si l'employé équilibre l'équipe (pas tous juniors, pas tous experts)
      const diff = Math.abs(empLevel - avgTeamLevel);
      if (diff <= 1) teamScore = 15; // Bon équilibre
      else if (diff === 2) teamScore = 10;
      else teamScore = 5;
    }
    score += teamScore;
    details.push({
      category: 'Équipe',
      score: teamScore,
      max: 15,
      description: currentTeam.length > 0 ? 'Équilibre équipe' : 'Nouvelle équipe'
    });

    return { score: Math.round(score), details };
  };

  // Analyser tous les postes et générer des recommandations
  const recommendations = useMemo(() => {
    const results = [];

    stages.forEach(stage => {
      stage.postes.forEach(poste => {
        const currentTeam = poste.employees || [];
        const requiredSkills = getRequiredSkills(poste);
        
        // Calculer le score pour tous les employés
        const candidates = employees.map(emp => {
          const { score, details } = calculateCompatibilityScore(emp, poste, currentTeam);
          return {
            employee: emp,
            score,
            details,
            isCurrentlyAssigned: currentTeam.some(m => m.Matricule === emp.Matricule)
          };
        }).sort((a, b) => b.score - a.score);

        // Top 5 recommandations
        const topCandidates = candidates.slice(0, 5);

        // Calculer le score moyen de l'équipe actuelle
        const currentTeamScores = currentTeam.map(member => {
          const emp = employeesByMatricule[member.Matricule];
          if (emp) {
            return calculateCompatibilityScore(emp, poste, currentTeam).score;
          }
          return 0;
        });
        const avgCurrentScore = currentTeamScores.length > 0
          ? currentTeamScores.reduce((a, b) => a + b, 0) / currentTeamScores.length
          : 0;

        results.push({
          posteId: poste.poste_id,
          stageName: stage.name,
          poste,
          requiredSkills,
          currentTeam,
          avgCurrentScore: Math.round(avgCurrentScore),
          recommendations: topCandidates,
          hasProblems: !!poste.aleas
        });
      });
    });

    return results.sort((a, b) => {
      // Prioriser les postes avec problèmes
      if (a.hasProblems && !b.hasProblems) return -1;
      if (!a.hasProblems && b.hasProblems) return 1;
      return a.posteId - b.posteId;
    });
  }, [stages, employees, employeesByMatricule]);

  const selectedRecommendation = selectedPoste 
    ? recommendations.find(r => r.posteId === selectedPoste)
    : null;

  return (
    <div className="h-full overflow-auto bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          🎯 Recommandations d'Affectation
        </h1>
        <p className="text-gray-600 mt-1">Suggestions d'équipes optimales par poste basées sur l'IA</p>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="text-3xl font-bold text-blue-900">{recommendations.length}</div>
          </div>
          <div className="text-sm font-semibold text-blue-700 mt-2">Postes analysés</div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
          <div className="flex items-center justify-between">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <div className="text-3xl font-bold text-red-900">
              {recommendations.filter(r => r.hasProblems).length}
            </div>
          </div>
          <div className="text-sm font-semibold text-red-700 mt-2">Avec aléas</div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
          <div className="flex items-center justify-between">
            <Award className="w-8 h-8 text-green-600" />
            <div className="text-3xl font-bold text-green-900">{employees.length}</div>
          </div>
          <div className="text-sm font-semibold text-green-700 mt-2">Candidats totaux</div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
          <div className="flex items-center justify-between">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <div className="text-3xl font-bold text-purple-900">
              {Math.round(recommendations.reduce((sum, r) => sum + r.avgCurrentScore, 0) / recommendations.length)}
            </div>
          </div>
          <div className="text-sm font-semibold text-purple-700 mt-2">Score moyen actuel</div>
        </div>
      </div>

      {/* Liste des postes */}
      <div className="grid grid-cols-2 gap-6">
        {/* Colonne gauche - Liste des postes */}
        <div className="bg-white rounded-lg shadow">
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">Postes à optimiser</h2>
            <p className="text-xs text-gray-600 mt-1">
              {recommendations.filter(r => r.hasProblems).length} postes avec aléas en priorité
            </p>
          </div>
          
          <div className="divide-y divide-gray-200 max-h-[600px] overflow-auto">
            {recommendations.map(rec => (
              <div
                key={rec.posteId}
                onClick={() => setSelectedPoste(rec.posteId)}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedPoste === rec.posteId 
                    ? 'bg-blue-50 border-l-4 border-blue-500' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900">Poste {rec.posteId}</span>
                      {rec.hasProblems && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-semibold">
                          Aléa
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-600 mb-2">{rec.stageName}</div>
                    
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-gray-500">
                        Équipe actuelle: {rec.currentTeam.length} personnes
                      </div>
                      <div className={`text-xs font-semibold ${
                        rec.avgCurrentScore >= 80 ? 'text-green-600' :
                        rec.avgCurrentScore >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        Score: {rec.avgCurrentScore}/100
                      </div>
                    </div>
                  </div>
                  
                  <CheckCircle className={`w-5 h-5 ${
                    selectedPoste === rec.posteId ? 'text-blue-600' : 'text-gray-300'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Colonne droite - Recommandations détaillées */}
        <div className="bg-white rounded-lg shadow">
          {selectedRecommendation ? (
            <>
              <div className="bg-blue-100 px-4 py-3 border-b border-blue-200">
                <h2 className="text-lg font-bold text-blue-900">
                  Recommandations - Poste {selectedRecommendation.posteId}
                </h2>
                <p className="text-xs text-blue-700 mt-1">{selectedRecommendation.stageName}</p>
              </div>

              {/* Compétences requises */}
              {selectedRecommendation.requiredSkills.length > 0 && (
                <div className="px-4 py-3 bg-yellow-50 border-b border-yellow-200">
                  <div className="text-sm font-semibold text-yellow-900 mb-2">
                    📋 Compétences recommandées :
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecommendation.requiredSkills.map(skill => (
                      <span key={skill} className="px-2 py-1 bg-yellow-200 text-yellow-900 text-xs rounded-full font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Top candidats */}
              <div className="divide-y divide-gray-200 max-h-[500px] overflow-auto">
                {selectedRecommendation.recommendations.map((candidate, index) => (
                  <div key={candidate.employee.Matricule} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-yellow-400 text-yellow-900' :
                          index === 1 ? 'bg-gray-300 text-gray-700' :
                          index === 2 ? 'bg-orange-300 text-orange-900' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">
                            {candidate.employee.Prénom} {candidate.employee.Nom}
                            {candidate.isCurrentlyAssigned && (
                              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                Actuel
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-600">
                            {candidate.employee.Qualification} • {candidate.employee["Niveau d'expérience"]}
                          </div>
                        </div>
                      </div>
                      
                      <div className={`text-2xl font-bold ${
                        candidate.score >= 80 ? 'text-green-600' :
                        candidate.score >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {candidate.score}
                      </div>
                    </div>

                    {/* Détails du score */}
                    <button
                      onClick={() => setExpandedPoste(expandedPoste === candidate.employee.Matricule ? null : candidate.employee.Matricule)}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mb-2"
                    >
                      {expandedPoste === candidate.employee.Matricule ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      Voir détails du score
                    </button>

                    {expandedPoste === candidate.employee.Matricule && (
                      <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
                        {candidate.details.map(detail => (
                          <div key={detail.category} className="flex items-center justify-between mb-2">
                            <div className="text-xs text-gray-700">{detail.category}</div>
                            <div className="flex items-center gap-2">
                              <div className="text-xs text-gray-500">{detail.description}</div>
                              <div className="text-xs font-bold">{detail.score}/{detail.max}</div>
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-500 rounded-full"
                                  style={{ width: `${(detail.score / detail.max) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">Sélectionnez un poste pour voir les recommandations</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Note méthodologique */}
      <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-bold text-blue-900 mb-2">ℹ️ Méthodologie de scoring</h3>
        <div className="text-xs text-blue-800 space-y-1">
          <p>• <strong>Compétences (40 pts)</strong> : Adéquation avec les compétences requises et niveau</p>
          <p>• <strong>Expérience (25 pts)</strong> : Niveau d'expérience (Débutant à Expert)</p>
          <p>• <strong>Niveau moyen (20 pts)</strong> : Moyenne des niveaux de compétences (1-5)</p>
          <p>• <strong>Équipe (15 pts)</strong> : Complémentarité et équilibre avec l'équipe actuelle</p>
          <p className="mt-2 text-blue-700">✨ Algorithme local, aucune API externe, calcul instantané</p>
        </div>
      </div>
    </div>
  );
};

export default RecommendationAffectation;
