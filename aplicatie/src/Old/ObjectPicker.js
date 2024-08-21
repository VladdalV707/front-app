import React, { useState, useEffect } from 'react';
import '../ComponenteDBBM/ObjectPicker.css';
import ReactDOM from "react-dom";

const ObjectPicker = ({ objects, isOpen, toggle, onSelect }) => {

  const [selectedObjects, setSelectedObjects] = useState([]);

  const modalRoot = document.getElementById("modal-root");

  const handleObjectSelect = (object, quantity, event) => {

    //Convertirea cantității într-un număr și ștergerea de 0-uri care sunt în față
    quantity = parseInt(quantity, 10).toString();

    //Dacă cantitatea nu e un număr sau e goală, se convertește la 0
    if (isNaN(quantity) || quantity === '') {
      quantity = '0';
    }

    // Limităm cantitatea la un minim de 0
    quantity = Math.max(parseInt(quantity, 10), 0);

    // Limităm cantitatea la un maxim de object.NrBucati
    quantity = Math.min(quantity, object.NrBucati);

    // Preventim introducerea de mai multe 0-uri consecutive în input
    if (event.target.value.startsWith('00')) {
      event.target.value = '0';
    }

    // Actualizăm valoarea câmpului input
    event.target.value = quantity.toString();

    console.log("Cantitatea este:", quantity);

    //Verificăm dacă cantitatea este mai mare decât 0 înainte de a adăuga/șterge obiecte la/din selectedObjects
    if (quantity > 0) {
      const index = selectedObjects.findIndex(o => o.id === object.Id);

      if (index !== -1) {
        const newSelectedObjects = [...selectedObjects];
        newSelectedObjects[index].quantity = quantity;
        console.log("Noul obiect:", newSelectedObjects);
        setSelectedObjects(newSelectedObjects);

      } else {
        setSelectedObjects([...selectedObjects, { id: object.Id, quantity }]);
      }
    } else {
      const index = selectedObjects.findIndex(o => o.id === object.Id);

      if (index !== -1) {
        const newSelectedObjects = [...selectedObjects];
        newSelectedObjects.splice(index, 1);
        setSelectedObjects(newSelectedObjects);
      }
    }
  }

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.classList.contains("modal-overlay")) {
        toggle();
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen, toggle]);

  const handleSave = () => {
    onSelect(selectedObjects);
    console.log("Obiectele Selectate Au Fost: ", selectedObjects);
    toggle();
  };

  const handleCancel = () => {
    setSelectedObjects([]);
    toggle();
  };

  return ReactDOM.createPortal(
    <div className={`modal-overlay ${isOpen ? "show" : "hide"}`}>
      <div className="modal-content">
        <div className="outer-wrapper">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th style={{ backgroundColor: "lightgrey" }}>N.O. Obiect</th>
                  <th style={{ backgroundColor: "lightgrey" }}>Denumire Obiect</th>
                  <th style={{ backgroundColor: "lightgrey" }}>Cantitate Totală</th>
                  <th style={{ backgroundColor: "lightgrey" }}>Alegere Cantitate</th>
                </tr>
              </thead>
              <tbody>
                {objects.map(object => (
                  <tr key={object.Id}>
                    <td>{object.NumarDeOrdine}</td>
                    <td>{object.DenumireObiect}</td>
                    <td>{object.NrBucati}</td>
                    <td>
                      <div>
                        <button type='button'
                          onClick={(event) => {
                            const currentQuantity =
                              selectedObjects.find(o => o.id === object.Id)?.quantity || 0;
                            const newQuantity = currentQuantity > 0 ? currentQuantity - 1 : 0;
                            handleObjectSelect(object, newQuantity, event);
                          }}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={selectedObjects.find(o => o.id === object.Id)?.quantity || 0}
                          onChange={(event) => {
                            const newQuantity = parseInt(event.target.value) || 0;
                            handleObjectSelect(object, newQuantity, event);
                          }}
                        />
                        <button type='button'
                          onClick={(event) => {
                            const currentQuantity =
                              selectedObjects.find(o => o.id === object.Id)?.quantity || 0;
                            const newQuantity =
                              currentQuantity < object.NrBucati ? currentQuantity + 1 : object.NrBucati;
                            handleObjectSelect(object, newQuantity, event);
                          }}
                        >
                          +
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <button type='button' onClick={handleSave}>Salvați</button>
        <button type='button' onClick={handleCancel}>Anulați</button>
      </div>
    </div>,
    modalRoot
  );
};
export default ObjectPicker;
