import React, { useState, useEffect, useCallback } from 'react';
import { SERVER_URL } from '../constants';
import '../Dashboard.css';

function UserManager() {
    const [users, setUsers] = useState([]);
    const [cities, setCities] = useState([]);
    const [message, setMessage] = useState('');
    const [cityMessage, setCityMessage] = useState('');

    const url = SERVER_URL + '/users';
    const cityurl = SERVER_URL + '/city';
    const adminurl = SERVER_URL + '/admin';
    
    const fetchUsers = useCallback( async () => {
        try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            Authorization: sessionStorage.getItem('jwt'),
            },
        });
    
        if (response.ok) {
            const users = await response.json();
            setUsers(users);
        } else {
            console.error('Fails on first render, ignore this....', response.statusText);
        }
        } catch (error) {
        console.error('Error fetching users', error);
        }
    },[url]); 
    
    useEffect(() => {
        fetchUsers();
    },[fetchUsers]);
    
    const fetchCities = useCallback( async () => {
        try {
            const response = await fetch(cityurl, {
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
    },[cityurl]); 

    useEffect(() => {
        fetchCities();
    },[fetchCities]);

    function addNewUser() {
        const alias = prompt('Enter the alias of the new user:');
        const password = prompt('Enter the password of the new user:');
        const role = prompt('Enter the role of the new user:');

        fetch(`${SERVER_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: sessionStorage.getItem('jwt'),
            },
            body: JSON.stringify({alias: alias, password: password, role: role}),
            })
        .then((response) => {
            if (response.ok) {
                setMessage(`Added user: ${alias}`);
            }else {
                alert(`Error adding user: ${alias}`);
            }
        }).then((responseData) => {
            console.log(responseData);
        }).catch((err) => console.error(err))
        .finally(() => {
            fetchUsers();
        });
    }

    function deleteUser() {
        const alias = prompt('Enter the alias of the user to delete:');
        
        fetch(`${SERVER_URL}/users/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: sessionStorage.getItem('jwt'),
            },
            body: JSON.stringify({alias: alias}),
        }).then((response)=> {
            if(response.ok) {
                setMessage(`Deleted user: ${alias}`);
            }else {
                setMessage(`Error deleting user: ${alias}`);
            }
        }).then((responseData) => {
            console.log(responseData);
        }).catch((err) => console.error(err))
        .finally(() => {
            fetchUsers();
        })
    
    }

    function addNewCity() {
        const cityName = prompt('Enter the name of the new city:');

        if (cityName) {
            fetch(`${adminurl}/addCity?name=${cityName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: sessionStorage.getItem('jwt'),
            },
            })
            .then((response) => {
                if (response.ok) {
                    setCityMessage(`Added city: ${cityName}`);
                    console.log(response);
                }
            })
            .then((responseData) => {
                console.log(responseData);
            }) 
            .catch((err) => console.error(err))
            .finally(() => {
                fetchCities();
            })
        }
    }

    function deleteCity() {
        const cityName = prompt('Enter the name of the city to delete:');

        if (cityName) {
            fetch(`${adminurl}/delete?name=${cityName}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: sessionStorage.getItem('jwt'),
            },
            })
            .then((response) => {
                if (response.ok) {
                    setCityMessage(`Deleted city: ${cityName}`);
                }
            })
            .then((responseData) => {
                console.log(responseData);
            }) 
            .catch((err) => console.error(err))
            .finally(() => {
                fetchCities();
            })
        }
    }

    function logout() {
        sessionStorage.removeItem('jwt');
        window.location.reload();
    }

    const updateWeather = () => {
        cities.forEach((city) => {
            fetch(`${adminurl}/updateCities?name=${city.timezone}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: sessionStorage.getItem('jwt'),
              },
            })
              .then((response) => {
                if (response.ok) {
                  setCityMessage(`Refreshed weather for ${city.timezone}`);
                }
              })
              .then(() => fetchCities())
              .catch((err) => console.error(err));
          });
    };

    return (
        <div style={{ display: 'flex' }}>
          <div className="Dashboard">
            <h3 style={{color: 'white'}}>Users</h3>
            <div className="message">{message}</div>
            <table style={{color: 'white'}}>
                <thead>
                    <tr>
                        <th>Alias</th>
                        <th>Role</th>
                        <th>ID</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.user_id}>
                            <td>{user.alias}</td>
                            <td>{user.role}</td>
                            <td>{user.user_id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button className="button" onClick={addNewUser}>Add New User</button>
                <button className="button" onClick={deleteUser}>Delete User</button>
            </div>
          </div>
          <div className="Dashboard" style={{ marginLeft: '20px' }}>
            <h3 style={{color: 'white'}}>Cities</h3>
            <div className="message">{cityMessage}</div>
            <div className="cities-container">
                <table style={{color: 'white'}}>
                    <tbody>
                        {cities.map((city) => (
                            <tr key={city.id}>
                                <td>{city.timezone}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <button className="button" onClick={addNewCity}>Add New City</button>
                <button className="button" onClick={deleteCity}>Delete City</button>
                <button className="button" onClick={updateWeather}>Update Weather</button>
            </div>
            <div>
            <button className= "button" onClick={logout}>Logout</button>
            </div>
          </div>         
        </div>
      );
}

export default UserManager;
