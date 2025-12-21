import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';

const AddPlayerModal = ({ isOpen, onClose, onSave, teamBudget }) => {
  const initialState = {
    empId: '',
    playerName: '',
    type: '',
    bidAmount: ''
  };

  const [player, setPlayer] = useState(initialState);
  const [errors, setErrors] = useState({});

  const playerTypes = [
    'Batsman',
    'Bowler',
    'All-rounder',
    'Wicket-keeper'
  ];

  const handleChange = (field, value) => {
    setPlayer({ ...player, [field]: value });
    
    // Clear error for this field
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!player.empId.trim()) {
      newErrors.empId = 'Employee ID is required';
    }

    if (!player.playerName.trim()) {
      newErrors.playerName = 'Player name is required';
    }

    if (!player.type) {
      newErrors.type = 'Player type is required';
    }

    if (!player.bidAmount || parseFloat(player.bidAmount) <= 0) {
      newErrors.bidAmount = 'Valid bid amount is required';
    } else if (teamBudget && parseFloat(player.bidAmount) > teamBudget) {
      newErrors.bidAmount = `Bid amount exceeds team budget (₹${teamBudget.toLocaleString()})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({ 
        ...player, 
        bidAmount: parseFloat(player.bidAmount) 
      });
      handleReset();
      onClose();
    }
  };

  const handleReset = () => {
    setPlayer(initialState);
    setErrors({});
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div className="flex items-center space-x-2">
            <UserPlus className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Add Player</h2>
          </div>
          <button 
            onClick={handleClose} 
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Employee ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee ID *
            </label>
            <input
              type="text"
              value={player.empId}
              onChange={(e) => handleChange('empId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.empId ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., EMP001"
            />
            {errors.empId && (
              <p className="text-red-500 text-xs mt-1">{errors.empId}</p>
            )}
          </div>

          {/* Player Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Player Name *
            </label>
            <input
              type="text"
              value={player.playerName}
              onChange={(e) => handleChange('playerName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.playerName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Virat Kohli"
            />
            {errors.playerName && (
              <p className="text-red-500 text-xs mt-1">{errors.playerName}</p>
            )}
          </div>

          {/* Player Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Player Type *
            </label>
            <select
              value={player.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.type ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select type</option>
              {playerTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="text-red-500 text-xs mt-1">{errors.type}</p>
            )}
          </div>

          {/* Bid Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bid Amount (₹) *
            </label>
            <input
              type="number"
              value={player.bidAmount}
              onChange={(e) => handleChange('bidAmount', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.bidAmount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 5000000"
              min="0"
            />
            {errors.bidAmount && (
              <p className="text-red-500 text-xs mt-1">{errors.bidAmount}</p>
            )}
            {teamBudget && (
              <p className="text-xs text-gray-500 mt-1">
                Available budget: ₹{teamBudget.toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-6">
          <button
            onClick={handleClose}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition duration-200 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200 font-semibold flex items-center justify-center space-x-2"
          >
            <UserPlus className="w-5 h-5" />
            <span>Add Player</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPlayerModal;