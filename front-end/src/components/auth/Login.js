import React, { useState } from "react";
import { Link } from "react-router-dom";

export const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const onChangeHandler = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const submitHandler = (e) => {
    e.preventDefault();
    console.log(`Log in`);
  };
  return (
    <section className="container">
      <div className="alert alert-danger">Invalid credentials</div>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fa fa-user"></i> Sign into Your Account
      </p>
      <form className="form" onSubmit={(e) => submitHandler(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            onChange={(e) => onChangeHandler(e)}
            value={email}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            onChange={(e) => onChangeHandler(e)}
            value={password}
            placeholder="Password"
            name="password"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </section>
  );
};

export default Login;
