import React, { useState, useEffect } from "react";
import { auth, provider, signInWithPopup, signInWithEmailAndPassword, signOut } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import './App.css'; // Include your custom CSS for styling

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Track authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Handle login with Google
  const handleLoginGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle email/password login
  const handleLoginEmailPassword = async (event) => {
    event.preventDefault();
    setError(""); // Clear previous errors

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      setEmail(""); // Clear the input fields
      setPassword("");
    } catch (error) {
      setError("Failed to log in. Please check your credentials.");
      console.error("Error during email login:", error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="App">
      {!user ? (
        <div className="login-form">
          <h2>Login</h2>
          <form onSubmit={handleLoginEmailPassword}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
          {error && <p className="error">{error}</p>} {/* Display error message */}
          <div className="google-login">
            <button onClick={handleLoginGoogle}>
              <img src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-icon-png-transparent-background-osteopathy-16.png" alt="Google logo" />
              Login with Google
            </button>
          </div>
          
        </div>
      ) : (
        <div className="welcome-screen">
          <h2>Welcome, {user.displayName || user.email}!</h2>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      )}
    </div>
  );
}

export default App;
