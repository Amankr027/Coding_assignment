import React, { useState, useEffect } from "react";
import { auth, provider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import './App.css'; 
function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); 

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
    setError(""); 

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      setEmail(""); 
      setPassword("");
    } catch (error) {
      console.error("Error during email login:", error); 

      if (error.code === "auth/user-not-found") {
        setError("No user found with this email address. Would you like to register?");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else if (error.code === "auth/invalid-email") {
        setError("The email address is not valid.");
      } else {
        setError("Failed to log in. Please check your credentials.");
      }
    }
  };

  // Handle registration (create new user)
  const handleRegister = async (event) => {
    event.preventDefault();
    setError(""); 

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error during registration:", error);
      setError(error.message);
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
          <h2>{isRegistering ? "Register" : "Login"}</h2>
          <form onSubmit={isRegistering ? handleRegister : handleLoginEmailPassword}>
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
            <button type="submit">{isRegistering ? "Register" : "Login"}</button>
          </form>
          {error && <p className="error">{error}</p>} {/* Display error message */}
          <div className="google-login">
            <button onClick={handleLoginGoogle}>
              <img src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-icon-png-transparent-background-osteopathy-16.png" alt="Google logo" />
              Login with Google
            </button>
          </div>
          <p>
            {isRegistering
              ? "Already have an account? "
              : "Don't have an account? "}
            <span 
              className="clickable" 
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? "Login" : "Register"}
            </span>
          </p>
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
