import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { faTimes, faCheck, faInfoCircle, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import back from '../assets/sweets.jpg';

const USER_REG = /^[a-zA-Z0-9-_]{4,24}$/;
const PWD_REG = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$/;
const MOB_REG = /^0[0-9]{9}$/;
const NAME_REG = /^[a-zA-Z ]{4,24}$/;
const EMAIL_REG = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const ADDR_REG = /^[a-zA-Z0-9, ]{4,}$/;

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [validFullName, setValidFullName] = useState(false);
  const [fullNameFocus, setFullNameFocus] = useState(false);

  const [mobile, setMobile] = useState('');
  const [validMobile, setValidMobile] = useState(false);
  const [mobileFocus, setMobileFocus] = useState(false);

  const [username, setUsername] = useState(''); // Changed from userName to username
  const [validUsername, setValidUsername] = useState(false); // Changed from ValidUserName to validUsername
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [address, setAddress] = useState('');
  const [validAddr, setValidAddr] = useState(false);
  const [addrFocus, setAddrFocus] = useState(false);

  const [role, setRole] = useState('Buyer');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidFullName(NAME_REG.test(fullName));
  }, [fullName]);

  useEffect(() => {
    setValidUsername(USER_REG.test(username)); // Updated to username
  }, [username]);

  useEffect(() => {
    setValidMobile(MOB_REG.test(mobile));
  }, [mobile]);

  useEffect(() => {
    setValidPwd(PWD_REG.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setValidAddr(ADDR_REG.test(address));
  }, [address]);

  useEffect(() => {
    setValidEmail(EMAIL_REG.test(email));
  }, [email]);

  useEffect(() => {
    setErrMsg('');
  }, [username, pwd, matchPwd, fullName, mobile, email, address]); // Updated to username

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validUsername || !validFullName || !validMobile || !validPwd || !validMatch || !validAddr || !validEmail) { // Updated to validUsername
      setErrMsg('Please fill out the form correctly.');
      return;
    }

    const payload = {
      fullName,
      username, // Changed from userName to username
      mobile,
      email,
      address,
      password: pwd,
      role,
    };
    console.log('Sending payload:', payload); // Debug log

    try {
      const response = await axios.post('http://localhost:5000/api/users', payload);
      console.log('Registration response:', response.data); // Log response inside try block
      setSuccess(true);
      setErrMsg('');
      setFullName('');
      setUsername(''); // Updated to setUsername
      setMobile('');
      setEmail('');
      setAddress('');
      setPwd('');
      setMatchPwd('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Registration error:', error.response ? error.response.data : error);
      if (error.response) {
        setErrMsg(error.response.data.error);
      } else {
        setErrMsg('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div
      className='h-screen flex justify-center items-center bg-cover'
      style={{ backgroundImage: `url(${back})` }}
    >
      <div className="absolute h-screen inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>

      <div className='w-[30%] h-screen rounded-3xl backdrop-blur-2xl shadow-2xl py-6'>
        <p ref={errRef} className={errMsg ? 'errmsg text-red-500 text-center' : 'offscreen'} aria-live='assertive'>{errMsg}</p>
        {success ? (
          <div className="text-white text-center">
            <h1>Registration Successful!</h1>
            <p>Redirecting to login...</p>
          </div>
        ) : (
          <>
            <h1 className='flex gap-4 justify-center items-center text-2xl font-bold text-white'>
              <FontAwesomeIcon icon={faIdCard} />
              Register
            </h1>
            <form className='m-4 h-full' onSubmit={handleSubmit}>
              <div className='flex flex-col items-center gap-8 my-8 text-white'>
                <input
                  className="w-[90%] border-b-2 bg-transparent focus:outline-none focus:border-b-black"
                  type='text'
                  id='fullName'
                  placeholder='Full Name'
                  onChange={(e) => setFullName(e.target.value)}
                  value={fullName}
                  required
                  aria-invalid={validFullName ? 'false' : 'true'}
                  aria-describedby='namenote'
                  onFocus={() => setFullNameFocus(true)}
                  onBlur={() => setFullNameFocus(false)}
                />
                <p id="namenote" className={`${fullNameFocus && fullName && !validFullName ? 'text-white bg-slate-600 rounded-md w-[90%] p-2 text-sm' : 'hidden'}`}>
                  <FontAwesomeIcon icon={faInfoCircle} /> Minimum 4 characters. Allow only letters.
                </p>

                <input
                  className="w-[90%] border-b-2 bg-transparent focus:outline-none focus:border-b-black"
                  type='text'
                  id='username' // Updated to username
                  placeholder='Username'
                  ref={userRef}
                  autoComplete='off'
                  onChange={(e) => setUsername(e.target.value)} // Updated to setUsername
                  value={username} // Updated to username
                  required
                  aria-invalid={validUsername ? 'false' : 'true'} // Updated to validUsername
                  aria-describedby='uidnote'
                  onFocus={() => setUserFocus(true)}
                  onBlur={() => setUserFocus(false)}
                />
                <p id="uidnote" className={`${userFocus && username && !validUsername ? 'text-white bg-slate-600 rounded-md w-[90%] p-2 mt-1 text-sm' : 'hidden'}`}>
                  <FontAwesomeIcon icon={faInfoCircle} /> 4 to 24 characters. Must begin with a letter. Letters, numbers, underscores, hyphens allowed.
                </p>

                <input
                  className="w-[90%] border-b-2 bg-transparent focus:outline-none focus:border-b-black"
                  type='text'
                  id='mobile'
                  placeholder='Mobile Number'
                  onChange={(e) => setMobile(e.target.value)}
                  value={mobile}
                  required
                  aria-invalid={validMobile ? 'false' : 'true'}
                  aria-describedby='mobnote'
                  onFocus={() => setMobileFocus(true)}
                  onBlur={() => setMobileFocus(false)}
                />
                <p id="mobnote" className={`${mobileFocus && mobile && !validMobile ? 'text-white bg-slate-600 rounded-md w-[90%] p-2 mt-1 text-sm' : 'hidden'}`}>
                  <FontAwesomeIcon icon={faInfoCircle} /> Start with 0. Must have 10 numbers.
                </p>

                <input
                  type="email"
                  className="w-[90%] border-b-2 bg-transparent focus:outline-none focus:border-b-black"
                  id="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                  aria-invalid={validEmail ? 'false' : 'true'}
                  aria-describedby='emailnote'
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                />
                <p id="emailnote" className={`${emailFocus && email && !validEmail ? 'text-white bg-slate-600 rounded-md w-[90%] p-2 mt-1 text-sm' : 'hidden'}`}>
                  <FontAwesomeIcon icon={faInfoCircle} /> Enter a valid email address.
                </p>

                <input
                  type="text"
                  className="w-[90%] border-b-2 bg-transparent focus:outline-none focus:border-b-black"
                  id="address"
                  placeholder="Address"
                  onChange={(e) => setAddress(e.target.value)}
                  value={address}
                  required
                  aria-invalid={validAddr ? 'false' : 'true'}
                  aria-describedby='addrnote'
                  onFocus={() => setAddrFocus(true)}
                  onBlur={() => setAddrFocus(false)}
                />
                <p id="addrnote" className={`${addrFocus && address && !validAddr ? 'text-white bg-slate-600 rounded-md w-[90%] p-2 mt-1 text-sm' : 'hidden'}`}>
                  <FontAwesomeIcon icon={faInfoCircle} /> Minimum 4 characters. Allow letters, numbers, commas, and spaces.
                </p>

                <input
                  className="w-[90%] border-b-2 bg-transparent focus:outline-none focus:border-b-black"
                  type='password'
                  id='pwd'
                  placeholder='Password'
                  autoComplete='off'
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                  aria-invalid={validPwd ? 'false' : 'true'}
                  aria-describedby='pwdnote'
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)}
                />
                <p id="pwdnote" className={`${pwdFocus && pwd && !validPwd ? 'text-white bg-slate-600 rounded-md w-[90%] p-2 mt-1 text-sm' : 'hidden'}`}>
                  <FontAwesomeIcon icon={faInfoCircle} /> 8 to 24 characters. Must include uppercase, lowercase, number, and special character.
                </p>

                <input
                  className="w-[90%] border-b-2 bg-transparent focus:outline-none focus:border-b-black"
                  type='password'
                  id='matchPwd'
                  placeholder='Re-Enter Password'
                  autoComplete='off'
                  onChange={(e) => setMatchPwd(e.target.value)}
                  value={matchPwd}
                  required
                  aria-invalid={validMatch ? 'false' : 'true'}
                  aria-describedby='matchPwdnote'
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
                />
                <p id="matchPwdnote" className={`${matchFocus && matchPwd && !validMatch ? 'text-white bg-slate-600 rounded-md w-[90%] p-2 mt-1 text-sm' : 'hidden'}`}>
                  <FontAwesomeIcon icon={faInfoCircle} /> Passwords must match.
                </p>
              </div>

              <button className='w-[50%] border border-white bg-transparent rounded-md flex justify-center p-2 mt-3 mb-2 mx-auto font-bold text-white'>
                SIGN UP
              </button>

              <p className='mb-3 flex justify-center mx-auto text-gray-400'>
                Already signed up? <span className='font-semibold pl-4 text-white'><Link to="/login">Login</Link></span>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;