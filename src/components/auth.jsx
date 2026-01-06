import { useState } from 'react'
import '../App.css'
import { authUser } from '../services/api'


export default function Auth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Implement login logic here
    const response = await authUser(username, password);
    if (response) {
      setIsLoggedIn(true);
      console.log("Login successful");
    } else {
      // Handle login failure (e.g., show error message)
        console.log("Login failed:", response.message);
    }
    console.log("Logging in with:", username, password);
  };

  const handleLogout = () => {
    // Implement logout logic here
    setIsLoggedIn(false);
  };

return (
    <div className="auth-container flex justify-center p-6 border border-gray-300 rounded-md bg-white">
        <input 
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="mr-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-accent focus:border-transparent"
        />
        <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="mr-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-accent focus:border-transparent"
         />

        <button onClick={handleLogin} className="mt-4 px-6 py-2 font-bold text-white rounded-md hover:opacity-80 transition-opacity hover:cursor-pointer hover:bg-sky-900 bg-sky-500">
            LogIn
        </button>
    </div>
  );
}

