import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem(
        "token",
        response.data.token
      );

      alert("Login Successful");

      navigate("/dashboard");
    } catch (error) {
  console.log(error.response?.data);

  alert(
    error.response?.data?.message ||
    "Login Failed"
  );
}}

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <br />

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
        </div>

        <br />

        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;