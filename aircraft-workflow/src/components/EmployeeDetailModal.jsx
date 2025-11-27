import React from 'react';
import { X, User, Award, ShieldCheck, Briefcase, Calendar, DollarSign } from 'lucide-react';

const EmployeeDetailModal = ({ employee, onClose }) => {
  if (!employee) return null;

  // Parser les compétences
  const parseSkills = (skillsStr) => {
    if (!skillsStr) return [];
    return skillsStr.split(',').map(skill => {
      const match = skill.trim().match(/^(.+?)\s+Niveau\s+(\d+)$/);
      if (match) {
        return { name: match[1], level: parseInt(match[2]) };
      }
      return { name: skill.trim(), level: null };
    });
  };

  // Parser les habilitations
  const parseHabilitations = (habStr) => {
    if (!habStr) return [];
    return habStr.split(',').map(h => h.trim()).filter(h => h);
  };

  const skills = parseSkills(employee.Compétences);
  const habilitations = parseHabilitations(employee.Habilitations);

  const getLevelColor = (level) => {
    if (level >= 4) return 'bg-green-100 text-green-800 border-green-300';
    if (level === 3) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (level === 2) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6 flex justify-between items-start z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <User className="w-8 h-8" />
              <h2 className="text-2xl font-bold">
                {employee.Prénom} {employee.Nom}
              </h2>
            </div>
            <div className="text-indigo-100 text-sm">
              {employee.Matricule} • {employee.Qualification}
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
                <Calendar className="w-4 h-4 text-gray-600" />
                <div className="text-xs font-semibold text-gray-600">ÂGE</div>
              </div>
              <div className="text-xl font-bold text-gray-800">{employee.Âge} ans</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-gray-600" />
                <div className="text-xs font-semibold text-gray-600">EXPÉRIENCE</div>
              </div>
              <div className="text-xl font-bold text-gray-800">{employee["Niveau d'expérience"]}</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-gray-600" />
                <div className="text-xs font-semibold text-gray-600">COÛT HORAIRE</div>
              </div>
              <div className="text-xl font-bold text-gray-800">{employee['Coût horaire (€)']} €</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-gray-600" />
                <div className="text-xs font-semibold text-gray-600">POSTE</div>
              </div>
              <div className="text-lg font-bold text-gray-800">{employee['Poste de montage']}</div>
            </div>
          </div>

          {/* Compétences */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-gray-800">Compétences</h3>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {skills.map((skill, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white border-2 rounded-lg">
                  <span className="font-medium text-gray-800">{skill.name}</span>
                  {skill.level && (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getLevelColor(skill.level)}`}>
                      Niveau {skill.level}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Habilitations */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-bold text-gray-800">Habilitations</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {habilitations.map((hab, idx) => (
                <span
                  key={idx}
                  className="px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium border border-green-300"
                >
                  {hab}
                </span>
              ))}
            </div>
          </div>

          {/* Commentaire de carrière */}
          {employee['Commentaire de Carrière'] && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Parcours professionnel</h3>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {employee['Commentaire de Carrière']}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailModal;
