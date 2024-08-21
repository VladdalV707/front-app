import React from 'react';

const MainMenu = ({ role, user, numereal }) => {
  return (
    <div style={{ textAlign: 'center', fontSize: '24px', marginTop: '30px' }}>
      {/* Rolul utilizatorului este: {role}<br />
      Numele de utilizator este: {user}<br /> */}
      Salut, {numereal}!
    </div>
  );
};

export default MainMenu;
