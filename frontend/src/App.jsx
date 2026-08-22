import { useState } from "react";

import Home from "./pages/user/home";
import Login from "./pages/auth/Login";

function App() {
  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = () => {
    setShowLogin(false);
  };

  if (showLogin) {
    return (
      <Login
        onLogin={handleLogin}
      />
    );
  }

  return (
    <Home
      onLoginRequired={() => setShowLogin(true)}
    />
  );
}

export default App;