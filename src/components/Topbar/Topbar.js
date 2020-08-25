import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { Dropdown, Image, Icon } from 'semantic-ui-react';
import LoginModal from '../LoginModal/LoginModal';

function onAuthStateChange(callback) {
  return firebase.auth().onAuthStateChanged(async user => {
    if (user) {
      await firebase
        .database()
        .ref('users')
        .child(user.uid)
        .on('value', snapshot => {
          callback(snapshot.val());
        });
    } else {
      callback(null);
    }
  });
}

function Topbar(props) {
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(setCurrentUser);
    return () => {
      unsubscribe();
    };
  }, []);

  const userMenuTrigger = (
    <span>
      <Image avatar src={currentUser && currentUser.avatar} />
    </span>
  );

  const openSignOutModal = () => {
    setShowSignOut(true);
  };

  const goToIndielog = () => {
    window.open('https://indielog.com');
  };

  const userMenuOptions = [
    {
      key: 'home',
      text: 'Go to IndieLog',
      icon: 'home',
      onClick: goToIndielog,
    },
    {
      key: 'sign-out',
      text: 'Sign Out',
      icon: 'arrow alternate circle right outline',
      onClick: openSignOutModal,
    },
  ];

  const showSignOutForm = () => {
    return (
      <div className="row">
        <div className="col-6 text-center">
          <button
            className=" btn btn-danger px-5 py-2"
            onClick={() => {
              onSignOut();
            }}
            style={{ fontSize: '16px', fontWeight: 700 }}
          >
            Sign out
          </button>
        </div>
        <div className="col-6 text-center">
          <button
            className="btn btn-secondary px-5 py-2"
            onClick={() => setShowSignOut(false)}
            style={{ fontSize: '16px', fontWeight: 700 }}
          >
            Go back
          </button>
        </div>
      </div>
    );
  };

  const onSignOut = async () => {
    const userUid = currentUser.uid;
    try {
      await firebase.auth().signOut();
      setCurrentUser(null);
    } catch (error) {
      await firebase
        .database()
        .ref('errors')
        .push({
          where: 'onSignOut',
          error: error,
          userUid: userUid,
        });
    }
    setShowSignOut(false);
  };

  return (
    <div className="relative bg-white shadow">
      <Modal show={showLogin} onHide={() => setShowLogin(false)} centered size="lg">
        <Modal.Body style={{ padding: 0 }}>
          <LoginModal isLogin={isLogin} setShowLogin={setShowLogin} />
        </Modal.Body>
      </Modal>
      <Modal show={showSignOut} onHide={() => setShowSignOut(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Do you want to sign out?</Modal.Title>
        </Modal.Header>
        <Modal.Body>{showSignOutForm()}</Modal.Body>
      </Modal>
      <div className="max-w-full mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
          <div className="w-0 flex-1 flex">
            <a href="/" className="inline-flex">
              <img className="h-8 w-auto sm:h-10" src="/indielog-logo.png" alt="Workflow" />
            </a>
          </div>

          {!currentUser ? (
            <div className=" md:flex items-center justify-end space-x-8 md:flex-1 lg:w-0">
              <button
                onClick={() => {
                  setShowLogin(true);
                  setIsLogin(true);
                }}
                className="whitespace-no-wrap text-base leading-6 font-medium text-gray-500 hover:text-gray-900 transition ease-in-out duration-150"
              >
                Sign in
              </button>
              <span className="inline-flex rounded-md shadow-sm">
                <button
                  onClick={() => {
                    setShowLogin(true);
                    setIsLogin(false);
                  }}
                  className="whitespace-no-wrap inline-flex items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-red-600 hover:bg-red-500 hover:text-white focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-700 transition ease-in-out duration-150"
                >
                  Sign up
                </button>
              </span>
            </div>
          ) : (
            <Dropdown trigger={userMenuTrigger} options={userMenuOptions} pointing="top right" icon={null} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Topbar;
