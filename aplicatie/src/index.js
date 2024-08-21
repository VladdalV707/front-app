import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
//Component Imports
import Menu from './Menu';//MenuNavComponent
import Menu2 from './Menu2';//Menu2NavComponent
import Menu3 from './Menu3';//Menu3NavComponent
import Menu4 from './Menu4';//Menu4NavComponent
// import MainMenu from './MainMenu'//MainPageComponent
import DataBase from './DataBase';//DBComponent
import DataBaseBM from './DataBaseBM';//DBBMComponent
import DatabaseGES from './DatabaseGES';//DBGESComponent
import DatabasePER from './DatabasePER';//DBPERComponent
import DatabaseSTU from './DatabaseSTU';//DBSTUComponent
import Departamente from './Departamente';
import DestinatariGES from './DestinatariGES';
import { axios } from './axiosInstance';

const App = () => {

  const [roles, setRoles] = useState([]);
  // eslint-disable-next-line
  const [username, setUsername] = useState('');
  // eslint-disable-next-line
  const [firstName, setFirstName] = useState('');
  // eslint-disable-next-line
  const [lastName, setLastName] = useState('');
  const [activeButton, setActiveButton] = useState('bazadedate');
  // eslint-disable-next-line
  const [role, setRole] = useState('');
  // eslint-disable-next-line
  const [user, setUser] = useState('');
  const [numereal, setNumeReal] = useState('');


  let content = null;
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://dnndev.me/api/Mifix.Api/Users/Info');
        const { Roles, Username, FirstName, LastName } = response.data;

        // Set the user information
        setRoles(Roles);
        setUsername(Username);
        setFirstName(FirstName);
        setLastName(LastName);

        // Determine the highest hierarchical role
        let highestRole = '';
        if (Roles.includes('ContabilGestiuni')) {
          highestRole = 'ContabilGestiuni';
        } else if (Roles.includes('Gestionar')) {
          highestRole = 'Gestionar';
        } else if (Roles.includes('Administrativ/Tesa')) {
          highestRole = 'Administrativ/Tesa';
        } else if (Roles.includes('Cadru Didactic')) {
          highestRole = 'Cadru Didactic';
        } else if (Roles.includes('Student')) {
          highestRole = 'Student';
        }

        // Set the role, user, and numereal based on the highest hierarchical role
        setRole(highestRole);
        setUser(Username);
        setNumeReal(`${LastName} ${FirstName}`);

        if (!['ContabilGestiuni', 'Gestionar', 'Administrativ/Tesa', 'Cadru Didactic', 'Student'].includes(highestRole)) {
          alert('Trebuie să aveți unul dintre următoarele roluri pentru a accesa aplicația: ContabilGestiuni, Gestionar, Administrativ/Tesa, Cadru Didactic, Student');
        }

      } catch (error) {
        console.error('Nu am putut accesa informațiile pentru user-ul curent!:', error);
      }
    };

    fetchUserInfo();
    // eslint-disable-next-line  
  }, []);

  if (roles.includes('ContabilGestiuni')) {
    content = (
      <>
        <Menu setActiveButton={setActiveButton} activeButton={activeButton} />
        {activeButton === 'bazadedate' && <DataBase />}
        {activeButton === 'bazadedatebonuri' && <DataBaseBM user={user} numereal={numereal} />}
        {activeButton === 'bazadedatedepartamente' && <Departamente />}
        {activeButton === 'inventarulmeu' && <DatabasePER user={user} setUser={setUser} />}
      </>
    );
  } else if (roles.includes('Gestionar')) {
    content = (
      <>
        <Menu2 activeButton={activeButton} setActiveButton={setActiveButton} />
        {activeButton === 'bazadedate' && <DatabaseGES user={user} setUser={setUser} />}
        {activeButton === 'destinatari' && <DestinatariGES user={user} setUser={setUser} />}
        {activeButton === 'inventarulmeu' && <DatabasePER user={user} setUser={setUser} />}
      </>
    );
  } else if (roles.includes('Administrativ/Tesa') || roles.includes('Cadru Didactic')) {
    content = (
      <>
        <Menu3 activeButton={activeButton} setActiveButton={setActiveButton} />
        {activeButton === 'bazadedate' && <DatabasePER user={user} setUser={setUser} />}
      </>
    );
  } else if (roles.includes('Student')) {
    content = (
      <>
        <Menu4 activeButton={activeButton} setActiveButton={setActiveButton} />
        {activeButton === 'bazadedate' && <DatabaseSTU user={user} setUser={setUser} />}
      </>
    );
  }





  return (
    <div className="main-container">
      {content}
    </div>
  );
}

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(
  <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

