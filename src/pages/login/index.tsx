import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const loginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();
  const [loginError, setLoginError] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post('http://localhost:8080/users/login', data);
      if (response.status === 200) {
        const token = response.data.user.token;
        //id
        const idUser = response.data.user.id;
        Cookies.set('id', idUser);
        
        // Stocker le jeton dans un cookie
        Cookies.set('token', token);

        // Authentifié, redirection vers la page de profil
        router.push('/profile');
      } else {
        setLoginError(true);
      }
    } catch (error) {
      console.error(error);
      setLoginError(true);
    }
  };

  return (
    <div >
      <h1>Login</h1>
      {loginError && <p>Incorrect email or password</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-outline mb-40">
          <label className="form-label">Email</label>
          <input {...register('email', { required: true, pattern: /^\S+@\S+$/i })} />
          {errors.email && <p>Email is required</p>}
        </div>
        <div className="form-outline mb-40">
          <label className="form-label">Password</label>
          <input  {...register('password', { required: true })} />
          {errors.password && <p>Password is required</p>}
        </div>
        <button type="submit" className='btn btn-primary btn-block mb-4'>Login</button>
      </form>
      <p>Don't have an account? <a href="/sign-up" className='col'>Sign up</a></p>
    </div>
  );
};

export default loginForm;
