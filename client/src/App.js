import './global.scss';
import MainBoard from './pages/MainBoard';
import ProjectsNavBar from './containers/ProjectsNavBar';
import { BrowserRouter, Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import { selectedProjectId } from './global';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // Import js-cookie
import { backendDomain } from './global';
import { callApi } from './supports/Fetch/Fetch';
import EditButton from './buttons/EditButton';

function App() {
  const [theme, setTheme] = useState('dark'); // Default to light theme
  const [crudCounter, setCrudCounter] = useState(0); // Each time a component changes something, it has to tell it to the App component from counting each crud operation


  const countCrudStatus = () =>{
    setCrudCounter(crudCounter + 1);
  }

  const rand = () => {
      return Math.random().toString(36).substr(2); // remove `0.`
  };
  
  const token = () =>{
      return rand() + rand(); // to make it longer
  };

  const createSession = async (newSessionKey) =>{
    const response = await callApi(`${backendDomain}/create-session`, 'POST', { session_key: newSessionKey });
    if (response.ok){
    }else{
    }
  };

  let cookieValue = null;
  const cookieName = 'session';
  useEffect(() => {
    // Generate a new cookie when the component mounts
    cookieValue = token();
    if (!Cookies.get(cookieName)) {
      Cookies.set(cookieName, cookieValue, { expires: 7 }); // Set the cookie with a 7-day expiration
      createSession(cookieValue);
    }
    countCrudStatus();
  }, []);

  return (
    <body className={`App-${theme}`}>
      <div className="main-container">
          <div className={`theme-${theme}`}>
           <BrowserRouter>
          <ProjectsNavBar sessionKey={Cookies.get('session')} updatedStatus={crudCounter}/>
            <Routes>
              <Route path='/' element={<Home/>}/>
              <Route path='/projects/:id' element={<MainBoard onThemeUpdate={setTheme} sessionKey={Cookies.get('session')} currentProjectId={selectedProjectId.value} onUpdate={() => countCrudStatus()}/>} />
            </Routes>
          </BrowserRouter>
         <EditButton/>
        </div>
      </div>
    </body>
   
  );
}

export default App;
