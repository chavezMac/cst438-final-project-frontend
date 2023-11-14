import React, {useState, useEffect} from 'react';
import {SERVER_URL} from '../constants';
import {Link} from 'react-router-dom';
import {apikey} from '../constants';

function ListCities(props) {

  const [cities, setCities] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
   // called once after intial render
   fetchCities();
  }, [] )
 
  const fetchCities = async () => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=33.44&lon=-94.04&exclude=minutely,hourly,daily,alerts&units=imperial&appid=${apikey}`);
      const data = await response.json();
      console.log(data);

      setCities([{ name: 'London', data }]);
    } catch (error) {
      setMessage('Error retrieving cities');
    }
  }
  
  
    const headers = ['City', 'Temperature', '', ' ', ' ', ' '];

    return (
    
      <div>
        <h1>Weather Stats for {cities.length > 0 ? cities[0].name : 'City'}</h1>
        {cities.length > 0 && (
          <div>
            <h2>{cities[0].name}</h2>
            <p>Temperature: {cities[0].data.current.temp} °F</p>
          </div>
        )}
      </div>
    );
  };

export default ListCities;