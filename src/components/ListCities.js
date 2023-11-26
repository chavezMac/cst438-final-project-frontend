import React, {useState, useEffect} from 'react';
import {SERVER_URL} from '../constants';
import {Link} from 'react-router-dom';
import {apikey} from '../constants';
import CitySelectionModal from './CitySelectionModal';

function ListCities({username}) {

  const [cities, setCities] = useState([]);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // called once after initial render
    fetchUserId(username);
  }, [username]);

  useEffect(() => {
    // called whenever userId changes
    if (userId !== '') {
      fetchCities();
    }
  }, [userId]);

  const fetchUserId = async (username) => {
    fetch(SERVER_URL + '/users/' + username, {
      headers: {'Authorization': sessionStorage.getItem('jwt')}
    })
    .then(response => response.text())
    .then((responseData) => {
      console.log(responseData);
      setUserId(parseInt(responseData, 10));
      return responseData;
    })
    .catch(err => console.error(err));
  }
 
  const fetchCities = async () => {
    console.log('fetching cities')
    fetch(`${SERVER_URL}/city/${userId}`, {
      headers: {'Authorization': sessionStorage.getItem('jwt')}
    })
    .then(response => response.json())
    .then((responseData) => {
      console.log(responseData);
      setCities(responseData);
      for(let i = 0; i < cities.length; i++) {
        console.log(cities[i].timezone);
      }

    })
    .catch(err => console.error(err));
  }

  const handleAddCity = (newCity) => {
    // Implement logic to add the city
    console.log(`Adding city: ${newCity}`);
    fetch(`${SERVER_URL}/city/${userId}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Authorization': sessionStorage.getItem('jwt')},
      body: JSON.stringify({name: newCity})
    })
    .then(response => {
      if (response.ok) {
        setMessage(`Added city: ${newCity}`);
        fetchCities();
      }
    })
    // Make API call or update state as needed
    setIsModalOpen(false);
  };
  
  return (
    <div className="App">
      <h3>Cities</h3>
      <button onClick={() => setIsModalOpen(true)}>Add City</button>

      <table>
        <tbody>
          <tr><th>Name</th><th>Temperature</th><th>Max Temp</th><th>Min Temp</th><th>Weather</th></tr>
          {
            cities.map((city, index) => 
              <tr key={index}>
                <td>{city.timezone}</td>
                <td>{city.temp}</td>
                <td>{city.max}</td>
                <td>{city.min}</td>
                <td>{city.icon}</td>
                <td><Link to={`/weather/${city.name}/${city.country}`}>Weather</Link></td>
              </tr>
            )
          }
        </tbody>
      </table>

      {isModalOpen && (
        <CitySelectionModal
          onClose={() => setIsModalOpen(false)}
          onCitySelect={handleAddCity}
        />
      )}
      <div>{message}</div>
    </div>
    
  );

  };

export default ListCities;
