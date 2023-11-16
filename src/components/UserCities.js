import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../constants';
import '../Dashboard.css';
import { apikey } from '../constants';

function UserCities(props) {
  const [cities, setCities] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const url = SERVER_URL + '/city/' + props.user.user_id;

    const fetchUserCities = async () => {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: sessionStorage.getItem('jwt'),
          },
        });

        if (response.ok) {
          const cities = await response.json();
          setCities(cities);
        } else {
          console.error('Fails on first render, ignore this....', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching cities', error);
      }
    };

    fetchUserCities();
  }, [props.user.user_id]); 
  
    return (
        <div className="Dashboard">
            <h3>Cities</h3>
            <div className="card-container">
                {cities.map((city, index) => (
                    <div className="card" key={index}>
                        <h4>{city.timezone}</h4>
                        <p>Temperature: {city.temp}</p>
                        <p>Max Temp: {city.max}</p>
                        <p>Min Temp: {city.min}</p>
                        <p>Weather: {city.icon}</p>
                    </div>
                ))}
            </div>
            <div>{message}</div>
        </div>
    );
}

export default UserCities;
