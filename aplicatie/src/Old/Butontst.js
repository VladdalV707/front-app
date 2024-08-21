import React from 'react';
import './App.css';

function Buton() {


    const ObiectInventar = {
        "NumarDeOrdine": 2230001,
        "NrFactura": "34786",
        "Furnizor": "ELEC",
        "DenumireObiect": "jahshj",
        "NrBucati": 5
    }
    return (
        <div className="ButonTest">
            <button type='button' onClick={async () => {
                const response = await fetch("http://localhost:49176/api/obiect-inventar", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(ObiectInventar)
                });
                console.log(response);

            }}>Buton</button>


        </div>
    );


}
export default Buton;