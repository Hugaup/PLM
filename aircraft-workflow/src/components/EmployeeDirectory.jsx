import React, { useState, useMemo } from 'react';
import { Search, Filter, X, Award, ShieldCheck, User as UserIcon } from 'lucide-react';
import EmployeeDetailModal from './EmployeeDetailModal';

const EmployeeDirectory = ({ employees }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filters, setFilters] = useState({
    qualification: '',
    experience: '',
    skill: '',
    skillLevel: '',
    habilitation: '',
    poste: '',
  });

  // Extraire toutes les compétences et habilitations uniques
  const allSkills = useMemo(() => {
    const skills = new Set();
    employees.forEach(emp => {
      if (emp.Compétences) {
        emp.Compétences.split(',').forEach(skill => {
          const match = skill.trim().match(/^(.+?)\s+Niveau\s+\d+$/);
          if (match) {
            skills.add(match[1]);
          }
        });
      }
    });
    return Array.from(skills).sort();
  }, [employees]);

  const allHabilitations = useMemo(() => {
    const habs = new Set();
    employees.forEach(emp => {
      if (emp.Habilitations) {
        emp.Habilitations.split(',').forEach(hab => {
          habs.add(hab.trim());
        });
      }
    });
    return Array.from(habs).sort();
  }, [employees]);

  const allQualifications = useMemo(() => {
    return [...new Set(employees.map(e => e.Qualification))].sort();
  }, [employees]);

  const allExperiences = useMemo(() => {
    return [...new Set(employees.map(e => e["Niveau d'expérience"]))].sort();
  }, [employees]);

  const allPostes = useMemo(() => {
    return [...new Set(employees.map(e => e['Poste de montage']))].sort((a, b) => {
      const numA = parseInt(a.replace('Poste ', ''));
      const numB = parseInt(b.replace('Poste ', ''));
      return numA - numB;
    });
  }, [employees]);

  const allLevels = [1, 2, 3, 4, 5];

  // Filtrer les employés
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      // Recherche textuelle
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        emp.Prénom.toLowerCase().includes(searchLower) ||
        emp.Nom.toLowerCase().includes(searchLower) ||
        emp.Matricule.toLowerCase().includes(searchLower);

      // Filtres
      const matchesQualification = !filters.qualification || emp.Qualification === filters.qualification;
      const matchesExperience = !filters.experience || emp["Niveau d'expérience"] === filters.experience;
      const matchesPoste = !filters.poste || emp['Poste de montage'] === filters.poste;
      
      const matchesSkill = !filters.skill || 
        (emp.Compétences && emp.Compétences.toLowerCase().includes(filters.skill.toLowerCase()));
      
      const matchesSkillLevel = !filters.skillLevel || 
        (emp.Compétences && emp.Compétences.includes(`Niveau ${filters.skillLevel}`));
      
      const matchesHabilitation = !filters.habilitation ||
        (emp.Habilitations && emp.Habilitations.toLowerCase().includes(filters.habilitation.toLowerCase()));

      return matchesSearch && matchesQualification && matchesExperience && 
             matchesSkill && matchesSkillLevel && matchesHabilitation && matchesPoste;
    });
  }, [employees, searchTerm, filters]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      qualification: '',
      experience: '',
      skill: '',
      skillLevel: '',
      habilitation: '',
      poste: '',
    });
  };

  const hasActiveFilters = searchTerm || Object.values(filters).some(f => f);

  const getSkillLevel = (skillsStr, skillName) => {
    if (!skillsStr) return null;
    const match = skillsStr.match(new RegExp(`${skillName}\\s+Niveau\\s+(\\d+)`, 'i'));
    return match ? parseInt(match[1]) : null;
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <UserIcon className="w-7 h-7" />
              Annuaire du Personnel
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {filteredEmployees.length} employé(s) {hasActiveFilters && `sur ${employees.length}`}
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

        {/* Barre de recherche */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom, matricule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filtres */}
        <div className="grid grid-cols-6 gap-3">
          <select
            value={filters.qualification}
            onChange={(e) => setFilters({ ...filters, qualification: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Toutes qualifications</option>
            {allQualifications.map(q => <option key={q} value={q}>{q}</option>)}
          </select>

          <select
            value={filters.experience}
            onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Toutes expériences</option>
            {allExperiences.map(e => <option key={e} value={e}>{e}</option>)}
          </select>

          <select
            value={filters.poste}
            onChange={(e) => setFilters({ ...filters, poste: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Tous les postes</option>
            {allPostes.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          <select
            value={filters.skill}
            onChange={(e) => setFilters({ ...filters, skill: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Toutes compétences</option>
            {allSkills.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            value={filters.skillLevel}
            onChange={(e) => setFilters({ ...filters, skillLevel: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Tous les niveaux</option>
            {allLevels.map(l => <option key={l} value={l}>Niveau {l}</option>)}
          </select>

          <select
            value={filters.habilitation}
            onChange={(e) => setFilters({ ...filters, habilitation: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Toutes habilitations</option>
            {allHabilitations.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-4">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Matricule</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nom</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Qualification</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Poste</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Expérience</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Compétences</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.map((emp) => (
                <tr key={emp.Matricule} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">{emp.Matricule}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-800">{emp.Prénom} {emp.Nom}</div>
                    <div className="text-xs text-gray-500">{emp.Âge} ans</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{emp.Qualification}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">{emp['Poste de montage']}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{emp["Niveau d'expérience"]}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(filters.skill || filters.skillLevel) && emp.Compétences && (
                        <>
                          {filters.skill && emp.Compétences.includes(filters.skill) && (
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-medium">
                              {filters.skill} Niv.{getSkillLevel(emp.Compétences, filters.skill)}
                            </span>
                          )}
                          {!filters.skill && filters.skillLevel && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                              Niveau {filters.skillLevel}
                            </span>
                          )}
                        </>
                      )}
                      {!filters.skill && !filters.skillLevel && (
                        <span className="text-xs text-gray-500">
                          {emp.Compétences?.split(',').length || 0} compétence(s)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedEmployee(emp)}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm font-medium transition-colors"
                    >
                      Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredEmployees.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <UserIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>Aucun employé trouvé</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de détails */}
      {selectedEmployee && (
        <EmployeeDetailModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
};

export default EmployeeDirectory;
