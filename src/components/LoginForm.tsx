import React, { useState } from "react";
import { createUser, validateLogin, LoginCredentials } from "../api/mockAPI";

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    rollNumber: "",
    name: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isRegistering) {
        const result = await createUser(credentials);

        if (result.success) {
          setIsRegistering(false);
          setError("Registration successful! Please login now.");
        } else {
          setError(result.message);
        }
      } else {
        const result = await validateLogin(credentials);

        if (result.success) {
          onLoginSuccess();
        } else {
          setError(result.message);
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError("");
  };

  return (
    <div className="login-form-container">
      <h2>{isRegistering ? "Register" : "Login"}</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="rollNumber">Roll Number:</label>
          <input
            type="text"
            id="rollNumber"
            name="rollNumber"
            value={credentials.rollNumber}
            onChange={handleChange}
            required
            data-testid="roll-number-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={credentials.name}
            onChange={handleChange}
            required
            data-testid="name-input"
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={isLoading}
            data-testid={isRegistering ? "register-button" : "login-button"}
          >
            {isLoading ? "Processing..." : isRegistering ? "Register" : "Login"}
          </button>

          <button
            type="button"
            onClick={toggleMode}
            className="toggle-button"
            data-testid="toggle-mode-button"
          >
            {isRegistering
              ? "Already have an account? Login"
              : "New user? Register"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
