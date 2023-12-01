import '../Styles.css'
import React, {useState} from 'react';
import UserCities from './UserCities';
import UserManager from './Admin';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';


function Login() {
    const[user, setUser] = useState({username:'', password:''});
    const[isAuthenticated, setAuth] = useState(false);

    const onChange = (event) => {
        setUser({...user, [event.target.name] : event.target.value});
    }
    const login = () => {
        fetch('http://localhost:8080/login', {
            method:'POST',
            headers: {'Content-Type':'application/json' },
            body: JSON.stringify(user)
        })
        .then(res => { 
            const jwtToken = res.headers.get('Authorization');
            if (jwtToken !== null) {
                sessionStorage.setItem("jwt", jwtToken);
                fetchUserData(jwtToken)
                setAuth(true);
            }
        })
        .catch(err => console.log(err));
    }

    const fetchUserData = async (jwtToken) => {
        try {
            const response = await fetch('http://localhost:8080/user/' + user.username, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwtToken
                },
            });

            if(response.ok) {
                const user = await response.json();
                setUser(user);
            }else {
                console.error('Error fetching user', response.statusText);
            }
        }catch(error) {
            console.error('Error fetching user', error);
        }
    }

    if(isAuthenticated && user.role === 'user') {
        return (
            <div className="App">
                <BrowserRouter>
                    <UserCities user={user}/>
                </BrowserRouter>
            </div>
        );
    }else if(isAuthenticated && user.role === 'admin') {
        return (
            <div className="App">
                <BrowserRouter>
                    <UserManager user={user}/>
                </BrowserRouter>
            </div>
        );
    
    }else {
        return (
            <div className="login-container">
                <div className="login-form" >
                    <table>
                    <tbody>
                    <tr><td>
                    <label htmlFor="username">UserName</label>
                    </td><td>
                    <input type="text" name="username" value={user.username} onChange={onChange} />
                    </td></tr>
                    <tr><td>
                    <label htmlFor="password">Password</label>
                    </td><td>
                    <input type="text" name="password" value={user.password} onChange={onChange} />
                    </td></tr>
                    </tbody>
                    </table>
                
                    <br/>
                    <button id="submit" onClick={login}>Login</button>
                </div>
            </div>
        );
    }
}
export default Login;