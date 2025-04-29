import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
import DynamicForm from "./components/DynamicForm";
import "./App.css";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };
  return (
    <div className="app-container">
      <header>
        <h1>Dynamic Form Application</h1>
      </header>

      <main>
        {!isLoggedIn ? (
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        ) : (
          <DynamicForm />
        )}
      </main>

      <footer>
        <p>© 2025 Student Form Application</p>
      </footer>
    </div>
  );
};

export default App;
