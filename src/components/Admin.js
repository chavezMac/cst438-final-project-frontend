import React, { useState, useEffect, useCallback } from 'react';
import { SERVER_URL } from '../constants';
import '../Dashboard.css';


function UserManager() {
    const [users, setUsers] = useState([]);
    const [cities, setCities] = useState([]);
    const [message, setMessage] = useState('');
    const url = SERVER_URL + '/users';
    const cityurl = SERVER_URL + '/city';
    
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
    },[url]); 

    useEffect(() => {
        fetchCities();
    },[fetchCities]);


    function handleAddUser(newUser,password,role) {
        console.log(`Adding user: ${newUser}`);
    
        fetch(`${SERVER_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: sessionStorage.getItem('jwt'),
        },
        body: JSON.stringify({alias: newUser, password: password, role: role}),
        })
        .then((response) => {
            if (response.ok) {
            setMessage(`Added user: ${newUser}`);
            }
        }).then((responseData) => {
            console.log(responseData);
        }).catch((err) => console.error(err))
        .finally(() => {
            fetchUsers();
        });
    }

    function logout() {
        sessionStorage.removeItem('jwt');
        window.location.reload();
    }

    return (
        <div style={{ display: 'flex' }}>
          <div>
            <h3>Users</h3>
            <div className="message">{message}</div>
            <table>
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
          </div>
          <div style={{ marginLeft: '20px' }}>
            <h3>Cities</h3>
            <div className="message">{message}</div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Temperature</th>
                        <th>Max Temp</th>
                        <th>Min Temp</th>
                        <th>Weather</th>
                    </tr>
                </thead>
                <tbody>
                    {cities.map((city) => (
                        <tr key={city.id}>
                            <td>{city.timezone}</td>
                            <td>{city.temp}</td>
                            <td>{city.max}</td>
                            <td>{city.min}</td>
                            <td>{city.icon}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
            <button
                onClick={logout}
                style={{
                backgroundColor: "#00000080",
                color: '#ffffff',
                padding: '10px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '20px',
                }}
            >Logout</button>
            </div>
          </div>         
        </div>
      );
}

export default UserManager;
