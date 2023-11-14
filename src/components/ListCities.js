import React, {useState, useEffect} from 'react';
import {SERVER_URL} from '../constants';
import {Link} from 'react-router-dom';
import {apikey} from '../constants';
import CitySelectionModal from './CitySelectionModal';

function ListCities(props) {

  const [cities, setCities] = useState([]);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
   // called once after intial render
   fetchCities();
  }, [] )
 
  const fetchCities = async () => {
    try {
      // const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=33.44&lon=-94.04&exclude=minutely,hourly,daily,alerts&units=imperial&appid=${apikey}`);
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=London&exclude=minutely,hourly,daily,alerts&units=imperial&appid=${apikey}`)
      const data = await response.json();
      console.log(data);

      setCities([{ name: 'London', data }]);
    } catch (error) {
      setMessage('Error retrieving cities');
    }
  };

  const handleAddCity = (newCity) => {
    // Implement logic to add the city
    console.log(`Adding city: ${newCity}`);
    // Make API call or update state as needed
    setIsModalOpen(false);
  };
  
  const headers = ['City', 'Temperature', '', ' ', ' ', ' '];

  return (
  
    <div>
      <h1>Weather Stats </h1>
      <button onClick={() => setIsModalOpen(true)}>Add City</button>
      {cities.length > 0 && (
        <div>
          <h2>{cities[0].name}</h2>
          <p>Temperature: {cities[0].data.main.temp} °F</p>
        </div>
      )}
      <br/>
      <br/>

      {isModalOpen && (
      <CitySelectionModal
        onClose={() => setIsModalOpen(false)}
        onCitySelect={handleAddCity}
      />
      )}
    </div>
  );
};

export default ListCities;
