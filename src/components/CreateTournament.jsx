import React, { useState } from 'react';
import { X, Save, ArrowRight } from 'lucide-react';

const CreateTournament = ({ isOpen, onClose, onSave }) => {
  const [step, setStep] = useState(1); // Step 1: Name, Step 2: Team count, Step 3: Team details
  const [tournamentName, setTournamentName] = useState('');
  const [teamCount, setTeamCount] = useState('');
  const [teams, setTeams] = useState([]);
  const [errors, setErrors] = useState({});

  const handleNext = () => {
    if (step === 1) {
      if (!tournamentName.trim()) {
        alert('Please enter tournament name');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const count = parseInt(teamCount);
      if (!count || count < 1 || count > 12) {
        alert('Please enter a valid number between 1 and 12');
        return;
      }
      setTeams(Array(count).fill(null).map((_, i) => ({ 
        name: '', 
        value: '' 
      })));
      setStep(3);
      setErrors({});
    }
  };

  const handleBack = () => {
    if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
  };

  const handleTeamChange = (index, field, value) => {
    const newTeams = [...teams];
    newTeams[index][field] = value;
    setTeams(newTeams);
    
    // Clear error for this field
    if (errors[`team${index}_${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`team${index}_${field}`];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    teams.forEach((team, index) => {
      if (!team.name.trim()) {
        newErrors[`team${index}_name`] = 'Team name is required';
      }
      if (!team.value || parseFloat(team.value) <= 0) {
        newErrors[`team${index}_value`] = 'Valid budget is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      alert('Please fill all team details correctly');
      return;
    }

    const validTeams = teams.map(t => ({ 
      name: t.name.trim(), 
      value: parseFloat(t.value) 
    }));

    onSave({
      name: tournamentName.trim(),
      teams: validTeams
    });
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setStep(1);
    setTournamentName('');
    setTeamCount('');
    setTeams([]);
    setErrors({});
  };

  const handleClose = () => {
    if (step > 1 && window.confirm('Discard tournament creation?')) {
      handleReset();
      onClose();
    } else if (step === 1) {
      handleReset();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">Create Tournament</h2>
          <button 
            onClick={handleClose} 
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step 1: Tournament Name */}
        {step === 1 && (
          <div>
            <label className="block text-lg font-semibold mb-3 text-gray-700">
              Tournament Name
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Enter a name for your tournament (e.g., "Men's Tournament", "Women's League", "IPL 2024")
            </p>
            <input
              type="text"
              value={tournamentName}
              onChange={(e) => setTournamentName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg mb-4"
              placeholder="e.g., Men's Cricket Tournament"
            />
            <button
              onClick={handleNext}
              className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold flex items-center justify-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Select Team Count */}
        {step === 2 && (
          <div>
            <label className="block text-lg font-semibold mb-3 text-gray-700">
              Number of Teams
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Select how many teams will participate in "{tournamentName}" (1-12)
            </p>
            <div className="space-y-3">
              <input
                type="number"
                min="1"
                max="12"
                value={teamCount}
                onChange={(e) => setTeamCount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                placeholder="Enter number of teams"
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition duration-200 font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold flex items-center justify-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Enter Team Details */}
        {step === 3 && (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Enter details for {teams.length} team{teams.length !== 1 ? 's' : ''} in "{tournamentName}"
            </p>
            
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
              {teams.map((team, idx) => (
                <div 
                  key={idx} 
                  className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
                >
                  <h3 className="font-semibold mb-3 text-gray-700">
                    Team {idx + 1}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Team Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Team Name *
                      </label>
                      <input
                        type="text"
                        value={team.name}
                        onChange={(e) => handleTeamChange(idx, 'name', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[`team${idx}_name`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., Mumbai Indians"
                      />
                      {errors[`team${idx}_name`] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[`team${idx}_name`]}
                        </p>
                      )}
                    </div>

                    {/* Team Budget */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Budget (₹) *
                      </label>
                      <input
                        type="number"
                        value={team.value}
                        onChange={(e) => handleTeamChange(idx, 'value', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors[`team${idx}_value`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., 10000000"
                        min="0"
                      />
                      {errors[`team${idx}_value`] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[`team${idx}_value`]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleBack}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition duration-200 font-semibold"
              >
                Back
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-200 font-semibold flex items-center justify-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>Create Tournament</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTournament;