import { SyntheticEvent, useState } from "react";
import { AuthService } from "../services/AuthService";
import { Navigate } from "react-router-dom";

type LoginProps = {
  authService: AuthService;
  setUserNameCb: (userName: string) => void;
};

export default function Login({ authService, setUserNameCb }: LoginProps) {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (userName && password) {
      const loginResponse = await authService.login(userName, password);
      const userName2 = authService.getUserName();
      if (userName2) {
        setUserNameCb(userName2);
      }

      if (loginResponse) {
        setLoginSuccess(true);
      } else {
        setErrorMessage("invalid credentials");
      }
    } else {
      setErrorMessage("UserName and password required!");
    }
  };

  function renderLoginResult() {
    if (errorMessage) {
      return <label>{errorMessage}</label>;
    }
  }

  return (
    <div role="main" className='min-h-screen flex flex-col justify-center items-center'>
      {loginSuccess && <Navigate to="/profile" replace={true} />}
      <h2 className='text-2xl'>Please login</h2>
      <form onSubmit={(e) => handleSubmit(e)} className='mt-5 mb-5 lg:w-1/3'>
        <div className='flex flex-col lg:flex-row lg:justify-center pt-2 pb-2'>
          <label className='lg:w-28'>User name</label>
          <input
            className='border-2 rounded-md border-slate-200 shadow-sm lg:w-52'
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className='flex flex-col lg:flex-row lg:justify-center pt-2 pb-2 '>
        <label className='lg:w-28'>Password</label>
        <input
          className='border-2 rounded-md border-slate-200 shadow-sm lg:w-52'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        </div>
        <div className='flex justify-center'>
          <input className='p-2 mt-5 w-1/3 bg-slate-400 text-white rounded-md' type="submit" value="Login" />
        </div>
      </form>
      {renderLoginResult()}
    </div>
  );
}
