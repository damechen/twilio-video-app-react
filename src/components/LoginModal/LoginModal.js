import React from 'react';
import { Sidebar } from './Sidebar';
import SignUp from './SignUp';
import './LoginModal.scss';

function LoginModal(props) {
  const { isLogin, setShowLogin } = props;
  return (
    <div className="wrapper">
      <div className="content">
        <div className="row mx-0">
          <Sidebar />
          <SignUp isLogin={isLogin} setShowLogin={setShowLogin} />
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
