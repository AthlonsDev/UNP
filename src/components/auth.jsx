import { useState } from 'react'
import '../App.css'


export default function Auth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // Implement login logic here
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Implement logout logic here
    setIsLoggedIn(false);
  };

return (
    <div className="auth-container flex justify-center p-6 border border-gray-300 rounded-md bg-white">
        <form action="login" method="POST" className="flex flex-col space-y-4 w-64">
        <h2 className="text-center" >{isLoggedIn ? 'Logout' : 'Login'}</h2>
        <input type="text"
            placeholder="Username"
            name="username"
            disabled={isLoggedIn}
            hidden={isLoggedIn}
        />
        <input type="password"
            placeholder="Password"
            name="password"
            disabled={isLoggedIn}
            hidden={isLoggedIn}
        />
        <button type="submit"
            className="px-4 py-2 font-bold text-white rounded-md hover:opacity-80 transition-opacity hover:cursor-pointer hover:bg-sky-900 bg-sky-500"
            onClick={isLoggedIn ? handleLogout : handleLogin}>
            { isLoggedIn ? 'Logout' : 'Login' }
        </button>
        </form>
    </div>
  );
}

