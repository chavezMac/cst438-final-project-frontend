import React, { useState, useEffect, useCallback } from 'react';
import { SERVER_URL } from '../constants';
import '../Dashboard.css';
import CitySelectionModal from './CitySelectionModal';

function CityManager(props) {
  const [cities, setCities] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddCityClicked, setIsAddCityClicked] = useState(false);
  const [isDeleteCityClicked, setIsDeleteCityClicked] = useState(false)
  const url = SERVER_URL + '/city/' + props.user.user_id;

  const fetchUserCities = useCallback( async () => {
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
  },[url]);
  
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

  useEffect(() => {
    fetchUserCities();
  },[props.user.user_id, fetchUserCities]);
  
  function updateCity(newCity) {
    console.log(`Adding city: ${newCity}`);
    const data = new URLSearchParams();
    data.append('name', newCity);

    fetch(`${SERVER_URL}/admin/update?name=${newCity}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: sessionStorage.getItem('jwt'),
      },

    }).then((response) => {
      if(response.ok) {
        console.log("Udpated city info");
      }
    }).then((responseData) => {
      console.log(responseData);
    }).catch((err) => console.error(err))
    .finally(() => {
      setIsModalOpen(false);
      setIsAddCityClicked(false);
      fetchUserCities();
    })
  }

  function handleAddCity(newCity) {
    console.log(`Adding city: ${newCity}`);
    const data = new URLSearchParams();
    data.append('name', newCity);

    updateCity(newCity);

    fetch(`${SERVER_URL}/city/${props.user.user_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: sessionStorage.getItem('jwt'),
      },
      body: data,
    })
      .then((response) => {
        if (response.ok) {
          setMessage(`Added city: ${newCity}`);
        }
      }).then((responseData) => {
        console.log(responseData);
      }).catch((err) => console.error(err))
  }

  function handleDeleteCity(newCity) {
    console.log(`Deleting city: ${newCity}`);
    const data = new URLSearchParams();
    data.append('name', newCity);
    
    fetch(`${SERVER_URL}/city/${props.user.user_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: sessionStorage.getItem('jwt'),
      },
      body: data,
    })
      .then((response) => {
        if (response.ok) {
          setMessage(`Deleted city: ${newCity}`);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setIsModalOpen(false);
        setIsDeleteCityClicked(false);
        fetchUserCities();
      });
  }

  function handleChangeCity() {

    fetchCities();

    const newCity = prompt("Enter name of city you want to add:");
    if(newCity) {
      let city_id = 0;
      console.log(availableCities);
      console.log(newCity);
      let cityFound = false;

      for(let i = 0; i < availableCities.length; i++) {
        console.log("Printing avaiable cities");
        console.log(availableCities[i]);
      }

      if(availableCities.includes(newCity)) {
        const oldCity =  prompt("Enter name of city to replace:");
        if(cities.includes(oldCity)) {

          for(let i = 0; i < cities.length; i++) {
            if(cities[i].cityName === oldCity) {
              city_id = cities[i].city_id;
              console.log(city_id);
            }
          }
          const data = new URLSearchParams();
          data.append('name', newCity);
          data.append('city_id', city_id);

          fetch(`${SERVER_URL}/city/update/${props.user.user_id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: sessionStorage.getItem('jwt'),
            },
            body: data,
          }).then((response) => {
            if(response.ok) {
              setMessage(`City changed:${oldCity}`);
            }
          }).then((responseData) => {
            console.log(responseData);
          }).catch((err) => console.log(err))
          .finally(() => {

          })
        }
      }
    }

  };

  function logout() {
    sessionStorage.removeItem('jwt');
    window.location.reload();
  }

  return (
      <div className="Dashboard">
          <h3>Cities</h3>
          <button onClick={() => {setIsModalOpen(true); setIsAddCityClicked(true);}}>Add City</button>
          <button onClick={() => {setIsModalOpen(true); setIsDeleteCityClicked(true);}}>Delete City</button>
          <button onClick={() => handleChangeCity()}>Change City</button>
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
          {isModalOpen && (
            <CitySelectionModal
            onClose={() => setIsModalOpen(false)}
            onCitySelect={isAddCityClicked ? handleAddCity : undefined}
            onDeleteCity={isDeleteCityClicked ? handleDeleteCity : undefined}
          />
          )}
      <button onClick={logout}>Logout</button>
      </div>
  );
}

export default CityManager;