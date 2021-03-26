import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { addAlert } from "../../actions/alert";
import PropTypes from "prop-types";
import Alert from "../layout/Alert";

export const Register = ({ addAlert }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData;
  const onChangeHandler = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== password2) {
      addAlert("Password don't match", "success");
    } else {
      console.log(formData);
    }
  };

  return (
    <section className="container">
      <h1 className="large text-primary">Sign Up</h1>
      <Alert />
      <p className="lead">
        <i className="fa fa-user"></i> Create Your Account
      </p>
      <form className="form" onSubmit={(e) => submitHandler(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => onChangeHandler(e)}
            name="name"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            value={email}
            onChange={(e) => onChangeHandler(e)}
            placeholder="Email Address"
            name="email"
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            value={password}
            onChange={(e) => onChangeHandler(e)}
            placeholder="Password"
            name="password"
            minLength="6"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            value={password2}
            onChange={(e) => onChangeHandler(e)}
            placeholder="Confirm Password"
            name="password2"
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </section>
  );
};

Register.prototype = {
  addAlert: PropTypes.func.isRequired,
};

export default connect(null, { addAlert })(Register);
