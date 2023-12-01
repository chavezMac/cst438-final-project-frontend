import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../constants';

const CitySelectionModal = ({ onClose, onCitySelect, onDeleteCity, onChangeCity}) => {
  const [availableCities, setAvailableCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  
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
        console.log(sessionStorage.getItem('jwt'))
        setAvailableCities(responseData);
      })
      .catch((err) => console.error(err));
  }

  const handleCitySelect = (e) => {
   const selectedCity = e.target.value;
   setSelectedCity(selectedCity);

   if(onCitySelect) {
     onCitySelect(selectedCity);
   }
  }

  const handleCityDelete = () => {

    if(onDeleteCity && selectedCity) {
      console.log(selectedCity);
      onDeleteCity(selectedCity);
    }
  }
  
  return (
    <div className="modal">
      <h2>Select a City</h2>
        <select onChange={handleCitySelect}>
        <option value="">Select a city</option>
        {availableCities.map((city, index) => (
          <option key={index} value={city.name}>
            {city.timezone}
          </option>
        ))}
      </select>
      <button onClick={onClose}>Cancel</button>
      <button onClick={handleCityDelete}>Delete City</button>
    </div>
  );
};

export default CitySelectionModal;