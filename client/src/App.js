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

function App() {
  
  const [crudCounter, setCrudCounter] = useState(0);
 
  const countCrudStatus = () =>{
    setCrudCounter(crudCounter + 1);
  }

  let rand = function() {
    return Math.random().toString(36).substr(2); // remove `0.`
  };
  
  let token = function() {
      return rand() + rand(); // to make it longer
  };

  const createSession = async (key) =>{
    
    console.log("Creating cookie with value "  + key);
    const response = await callApi(`${backendDomain}/create-session`, 'POST', { key: key });
    if (response.ok){
      console.log('Cookie with value ' + key + ' created!')
    }else{
        console.error("Couldn't create cookie");
    }
  };

  let cookieValue = null;
  const cookieName = 'session';
  useEffect(() => {
    // Generate a new cookie when the component mounts
  
    cookieValue = token() // Set your desired cookie value

    console.log("The created cookieValue is " + cookieValue);
    if (!Cookies.get(cookieName)) {
      console.log("Applying cookie value...");
      Cookies.set(cookieName, cookieValue, { expires: 7 }); // Set the cookie with a 7-day expiration
      createSession(cookieValue);
    }

  }, []);

  console.log("Verifying if React can get the session Cookie...")
  console.log(Cookies.get('session'))
  return (
    <div className="App">
        {}
          <BrowserRouter>
         <ProjectsNavBar sessionKey={Cookies.get('session')} updatedStatus={crudCounter}/>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/projects/:id' element={<MainBoard sessionKey={Cookies.get('session')} currentProjectId={selectedProjectId.value} onUpdate={() => countCrudStatus()}/>} />
          </Routes>
        </BrowserRouter>

    </div>
  );
}

export default App;
