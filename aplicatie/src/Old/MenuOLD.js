import React from 'react';
import './App.css';
import { useState } from 'react';
import Reworked from './Reworked';




function Menu() {
        const [isToggled, setIsToggled] = useState(false);
        const [isToggled1, setIsToggled1] = useState(false);
        const [isToggled2, setIsToggled2] = useState(false);
        return (
                <div class="btn-group">
                        <button type='button' class="button" onClick={() => setIsToggled(!isToggled)}>Bază de date</button>
                        <button type='button' class="button" onClick={() => setIsToggled1(!isToggled1)}>Bon de Mișcare-Obiecte de Inventar</button>
                        <button type='button' class="button" onClick={() => setIsToggled2(!isToggled2)}>Fișă Tehnico-Operativă-Evidență Obiecte de Inventar</button>
                        {isToggled && <Reworked />}
                </div>
        );
}

export default Menu;