import { useState } from "react";

import Home from "./pages/user/home";
import Login from "./pages/auth/Login";
import OwnerDashboard from "./pages/admin/OwnerDashboard";


function App() {

  const [user, setUser] = useState(() => {

    const savedUser = localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;

  });


  const [showLogin, setShowLogin] = useState(false);



  const handleLogin = (loggedInUser) => {

    setUser(loggedInUser);

    localStorage.setItem(
      "user",
      JSON.stringify(loggedInUser)
    );

    setShowLogin(false);

  };



  const handleLogout = () => {

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);

  };



  if (showLogin) {

    return (
      <Login
        onLogin={handleLogin}
      />
    );

  }



  // OWNER

  if (
    user &&
    user.role === "owner"
  ) {

    return (
      <OwnerDashboard
        onLogout={handleLogout}
      />
    );

  }



  // PUBLIC + MEMBER HOME

  return (

    <Home

      user={user}

      onLoginRequired={() =>
        setShowLogin(true)
      }

      onLogout={handleLogout}

    />

  );

}


export default App;