import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../constants';
import ListCities from './ListCities';

const CitySelectionModal = ({ onClose, onCitySelect }) => {
  const [availableCities, setAvailableCities] = useState([]);
  
  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    console.log('fetching new cities');
    fetch(SERVER_URL + '/city', {
      headers: { Authorization: sessionStorage.getItem('jwt')},
    })
  
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        setAvailableCities(responseData);
      })
      .catch((err) => console.error(err));
  }

  return (
    <div className="modal">
      <h2>Select a City</h2>
      <select onChange={(e) => onCitySelect(e.target.value)}>
        <option value="">Select a city</option>
        {availableCities.map((city, index) => (
          <option key={index} value={city.name}>
            {city.timezone}
          </option>
        ))}
      </select>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};


export default CitySelectionModal;