import React, { useState } from 'react';

const CitySelectionModal = ({ onClose, onCitySelect }) => {
  const [selectedCity, setSelectedCity] = useState('');
  const availableCities = ['Seaside', 'Marina', 'Monterey', 'San Jose'];

  const handleCitySelect = () => {
    if (selectedCity) {
      onCitySelect(selectedCity);
      onClose();
    }
  };

  return (
    <div className="modal">
      <h2>Select a City</h2>
      <select onChange={(e) => setSelectedCity(e.target.value)} value={selectedCity}>
        <option value="">Select a city</option>
        {availableCities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
      <button onClick={handleCitySelect}>Add City</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default CitySelectionModal;
