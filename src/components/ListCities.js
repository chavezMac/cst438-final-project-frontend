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
    fetch(SERVER_URL + '/city', {
      headers: {'Authorization': sessionStorage.getItem('jwt')}
    })
    .then(response => response.json())
    //console log data
    .then((responseData) => {
      console.log(responseData);
      //Use the information in responseData to update the return statement
      setCities(responseData);
      for(let i = 0; i < cities.length; i++) {
        console.log(cities[i].timezone);
      }

    })
    .catch(err => console.error(err));
  }
  
  return (
    <div className="App">
      <h3>Cities</h3>
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
      <div>{message}</div>
    </div>
    
  );

  };

export default ListCities;