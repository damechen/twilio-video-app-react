import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/functions';
import PulseLoader from 'react-spinners/PulseLoader';

import googleLogo from './assets/google.svg';
import fbLogo from './assets/fb.svg';
import twitterLogo from './assets/twitter.svg';
import githubLogo from './assets/github.png';

function SignUp(props) {
  const [data, setData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [showLogin, setShowLogin] = useState(props.isLogin || false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const onLogin = async e => {
    e.preventDefault();

    const { email, password } = data;

    setIsLoading(true);

    try {
      props.setShowLogin(false);

      const response = await firebase.auth().signInWithEmailAndPassword(email, password);

      toast.success("You've logged in successfully! 👋", {
        autoClose: 4000,
      });

      setIsLoading(false);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        toast.error('Sorry, user not found', {
          autoClose: 4000,
        });
      } else if (error.code === 'auth/invalid-password') {
        toast.error('Sorry, your password is invalid', {
          autoClose: 4000,
        });
      } else {
        toast.error('Sorry, some bad thing just happened.', {
          autoClose: 4000,
        });
      }
      setIsLoading(false);
    }
  };

  const onSignup = async e => {
    e.preventDefault();

    const { fullName, email, password, confirmPassword } = data;

    if (password !== confirmPassword) {
      toast.error('Sorry, passwords do not match.', {
        autoClose: 4000,
      });
      return;
    }

    setIsLoading(true);

    try {
      props.setShowLogin(false);

      const response = await firebase.auth().createUserWithEmailAndPassword(email, password);

      toast.success("You've signed up successfully! 👋", {
        autoClose: 4000,
      });

      if (response.additionalUserInfo.isNewUser) {
        const userUid = response.user.uid;
        const userObject = {
          avatar: 'https://iupac.org/wp-content/uploads/2018/05/default-avatar.png',
          email: email,
          uid: userUid,
          displayName: fullName,
          createdAt: Date.now(),
          signUpVia: 'email',
          notifications: {
            notifyNewComment: true,
            notifyNewFollower: true,
            notifyNewVideo: true,
          },
          role: 'admin',
          emailVerified: false,
        };

        await firebase
          .database()
          .ref('users')
          .child(userUid)
          .set(userObject);

        await firebase
          .database()
          .ref('new-members')
          .child(userUid)
          .set({
            displayName: fullName,
            avatar: 'https://iupac.org/wp-content/uploads/2018/05/default-avatar.png',
            email: email,
            uid: userUid,
            createdAt: Date.now(),
          });
      }

      setIsLoading(false);
    } catch (error) {
      if (error.code === 'auth/invalid-password') {
        toast.error('Sorry, your password is invalid', {
          autoClose: 4000,
        });
      } else {
        toast.error('Sorry, some bad thing just happened.', {
          autoClose: 4000,
        });
      }
    }
    setData({
      ...data,
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setIsLoading(false);
  };

  const showLoginForm = () => {
    setShowLogin(true);
    setData({ fullName: '', email: '', password: '', confirmPassword: '' });
  };

  const showSignupForm = () => {
    setShowLogin(false);
    setData({ fullName: '', email: '', password: '', confirmPassword: '' });
  };

  const onSocialAuth = async social => {
    var provider;
    if (social === 'facebook') {
      provider = new firebase.auth.FacebookAuthProvider();
    }
    if (social === 'google') {
      provider = new firebase.auth.GoogleAuthProvider();
    }
    if (social === 'twitter') {
      provider = new firebase.auth.TwitterAuthProvider();
    }
    if (social === 'github') {
      provider = new firebase.auth.GithubAuthProvider();
    }

    try {
      props.setShowLogin(false);

      const response = await firebase.auth().signInWithPopup(provider);

      if (response.additionalUserInfo.isNewUser) {
        const user = response.user;
        var userAvatar = user.photoURL;

        if (social === 'twitter') {
          userAvatar = user.photoURL.replace('_normal', ''); // get original size twitter avatar
        }

        if (social === 'facebook') {
          userAvatar = user.photoURL + '?height=500'; // get larger facebook profile avatar
        }

        const userObj = {
          avatar: userAvatar,
          email: user.email || '',
          emailVerified: false,
          uid: user.uid,
          displayName: user.displayName ? user.displayName : user.email.split('@')[0],
          createrAccess: false,
          signUpVia: social,
          notifications: {
            notifyNewComment: true,
            notifyNewFollower: true,
            notifyNewVideo: true,
          },
          subscribersNo: 0,
          createdAt: Date.now(),
        };

        await firebase
          .database()
          .ref('users')
          .child(user.uid)
          .set(userObj);

        await firebase
          .database()
          .ref('new-members')
          .child(user.uid)
          .set({
            displayName: user.displayName ? user.displayName : user.email.split('@')[0],
            avatar: userAvatar,
            email: user.email || '',
            uid: user.uid,
            createdAt: Date.now(),
          });

        // send email verification email
        // await response.user.sendEmailVerification();
      }
    } catch (error) {
      // Handle Errors here.
      var errorCode = error.code || '';
      // The email of the user's account used.
      var email = error.email || '';
      await firebase
        .database()
        .ref('errors')
        .push({
          where: 'onSocialAuth',
          error: error,
          errorCode: errorCode,
          email: email,
        });
    }
  };

  return (
    <div className="col-12 col-lg-7 p-4" style={{ height: '670px' }}>
      {!showLogin ? (
        <form className="form-sign py-5 p-lg-5">
          <div className="form-toggle text-muted small mr-3">
            Already a member?
            <Link onClick={showLoginForm}> Log in</Link>
          </div>
          <div className="mb-4">
            <h1 className="h2 mb-3 font-weight-bold">Sign up</h1>
          </div>
          <div className="form-row text-center">
            <div className="col-8" style={{ paddingRight: '15px' }}>
              <a className="btn btn-lg btn-primary btn-image-wrap" onClick={() => onSocialAuth('google')} role="button">
                <img src={googleLogo} className="btn-image" alt="Sign with Google" />
                Sign up with Google
              </a>
            </div>
            <div className="col-4">
              <div className="row justify-content-end">
                <button className="btn btn-lg btn-light btn-social" onClick={() => onSocialAuth('twitter')}>
                  <img src={twitterLogo} alt="Sign with Twitter" />
                </button>

                <button className="btn btn-lg btn-light btn-social" onClick={() => onSocialAuth('github')}>
                  <img src={githubLogo} alt="Sign with Github" />
                </button>

                <button className="btn btn-lg btn-light btn-social" onClick={() => onSocialAuth('facebook')}>
                  <img src={fbLogo} alt="Sign with Facebook" />
                </button>
              </div>
            </div>
          </div>
          <div className=" divider my-4 text-muted">Or</div>
          <div className="form-row">
            <div className="col">
              <label htmlFor="fullName">Your name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="form-control bg-light border-0"
                required
                value={data.fullName}
                onChange={handleInputChange}
                autoFocus
              />
            </div>
          </div>
          <div className="form-label-group mt-3">
            <label htmlFor="inputEmail">Email</label>
            <input
              type="email"
              id="inputEmail"
              name="email"
              className="form-control bg-light border-0"
              required
              value={data.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-label-group mt-3">
            <label htmlFor="inputPassword">Password</label>
            <input
              type="password"
              id="inputPassword"
              name="password"
              className="form-control bg-light border-0"
              placeholder=""
              required
              value={data.password}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-label-group mt-3">
            <label htmlFor="inputConfirmPassword">Confirm password</label>
            <input
              type="password"
              id="inputConfirmPassword"
              name="confirmPassword"
              className="form-control bg-light border-0"
              placeholder=""
              required
              value={data.confirmPassword}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-12 col-md-6 px-0 mt-4">
            <button
              className="btn btn-lg btn-danger btn-block"
              disabled={
                data.fullName === '' || data.email === '' || data.password === '' || data.confirmPassword === ''
              }
              onClick={onSignup}
            >
              {isLoading ? <PulseLoader sizeUnit={'px'} size={8} color={'#fff'} /> : 'Create account'}
            </button>
          </div>
        </form>
      ) : (
        <form className="form-sign py-5 p-lg-5">
          <div className="form-toggle text-muted small mr-3">
            Don't have an account?
            <Link onClick={showSignupForm}> Sign up</Link>
          </div>
          <div className="mb-4">
            <h1 className="h2 mb-3 font-weight-bold">Log in</h1>
          </div>

          <div className="form-row text-center">
            <div className="col-8" style={{ paddingRight: '15px' }}>
              <a className="btn btn-lg btn-primary btn-image-wrap" onClick={() => onSocialAuth('google')} role="button">
                <img src={googleLogo} className="btn-image" alt="Sign with Google" />
                Log in with Google
              </a>
            </div>
            <div className="col-4">
              <div className="row justify-content-end">
                <button className="btn btn-lg btn-light btn-social" onClick={() => onSocialAuth('twitter')}>
                  <img src={twitterLogo} alt="Sign with Twitter" />
                </button>

                <button className="btn btn-lg btn-light btn-social" onClick={() => onSocialAuth('github')}>
                  <img src={githubLogo} alt="Sign with Github" />
                </button>

                <button className="btn btn-lg btn-light btn-social" onClick={() => onSocialAuth('facebook')}>
                  <img src={fbLogo} alt="Sign with Facebook" />
                </button>
              </div>
            </div>
          </div>
          <div className=" divider my-4 text-muted">Or</div>

          <div className="form-label-group mt-3">
            <label htmlFor="inputEmail">Email Address</label>
            <input
              type="email"
              id="inputEmail"
              name="email"
              className="form-control bg-light"
              required
              value={data.email}
              onChange={handleInputChange}
              autoFocus
            />
          </div>

          <div className="form-label-group mt-3">
            <label htmlFor="inputPassword">Password</label>
            <input
              type="password"
              id="inputPassword"
              name="password"
              className="form-control bg-light"
              required
              value={data.password}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-12 col-md-6 px-0 mt-4">
            <button
              className="btn btn-lg btn-danger btn-block"
              disabled={data.email === '' || data.password === ''}
              onClick={onLogin}
            >
              {isLoading ? <PulseLoader sizeUnit={'px'} size={8} color={'#fff'} /> : 'Log in'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default SignUp;
