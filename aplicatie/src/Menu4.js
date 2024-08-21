import './ComponenteMenu/menu.css';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCube, faServer } from '@fortawesome/free-solid-svg-icons';

const Menu3 = ({ setActiveButton, activeButton }) => {
    return (
        <header>
            <nav>
                <div className='left-menu'>

                    <FontAwesomeIcon icon={faServer} />

                    <div className='title'>
                        <h1>Aplicație de Gestiune Inventar</h1>
                    </div>

                    <div className='data'>
                        <h2>Data: {new Date().toLocaleDateString('ro-RO')}</h2>
                    </div>

                </div>

                <ul className='right-menu'>

                    {/* <li onClick={() => setActiveButton("mainmenu")} className={activeButton === 'mainmenu' ? 'active' : ''}>
                        <span>
                            <FontAwesomeIcon icon={faComputer} />
                            Meniu Principal
                        </span>
                    </li> */}

                    <li onClick={() => setActiveButton("bazadedate")} className={activeButton === 'bazadedate' ? 'active' : ''}>
                        <span>
                            <FontAwesomeIcon icon={faCube} />
                            Inventarul Meu
                        </span>

                        {/* <ul className='submenu'>
                            <li onClick={() => setActiveButton("bazadedate")} className={activeButton === 'bazadedate' ? 'active' : ''}>
                                <FontAwesomeIcon icon={faDatabase} />
                                Bază de Date
                            </li>
                        </ul> */}
                    </li>

                </ul>
            </nav>
        </header>
    );
}

export default Menu3