import React, { useEffect, useState } from 'react';
import './SNPickerBM.css';
import ReactDOM from "react-dom";

const SNPickerBM = ({ toggleSN, showSN, quantity, obiect, handleObjectSelect, selectedObject, handleObjectReset }) => {

    const modalRoot = document.getElementById("modal-root");

    const [checkedBoxes, setCheckedBoxes] = useState([]);

    useEffect(() => {
        if (selectedObject?.selectedSN?.length > 0) {
            setCheckedBoxes(selectedObject.selectedSN);
        } else {
            setCheckedBoxes([]);
        }
        // eslint-disable-next-line 
    }, []);

    const handleReset = () => {
        handleObjectReset(selectedObject);
        setCheckedBoxes([]);
    }

    const handleCancel = () => {
        toggleSN();
    }

    const isSelectionComplete = (selectedSN, quantity) => {
        return selectedSN.length === quantity;
    }

    const handleSave = (event) => {
        if (isSelectionComplete(checkedBoxes, quantity)) {
            console.log("Array-ul cu Id-urile inițiale de după selecție: ", checkedBoxes);
            handleObjectSelect(obiect, quantity, checkedBoxes, event);
            toggleSN();
        } else {
            alert("Selectați toate seriile astfel încât cantitatea selectată să fie egală cu numărul casetelor bifate!");
        }
    }

    const handleCheckboxChange = (e, bucataId) => {
        if (e.target.checked) {
            setCheckedBoxes(prevCheckedBoxes => [...prevCheckedBoxes, bucataId]);
        } else {
            setCheckedBoxes(prevCheckedBoxes => prevCheckedBoxes.filter(id => id !== bucataId));
        }
    }

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (event.target.classList.contains("modal-overlay-sn")) {
                handleCancel();
            }
        };

        if (showSN) {
            document.addEventListener("click", handleOutsideClick);
        } else {
            document.removeEventListener("click", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
        // eslint-disable-next-line
    }, [showSN, toggleSN]);


    return ReactDOM.createPortal(
        <div className={`modal-overlay-sn ${showSN ? "show" : "hide"}`}>
            <div className="modal-content">
                <div className="custom-table">
                    <div className="thead">
                        <div className="tr">
                            <div className="th" style={{ backgroundColor: "lightgrey", display: "inline-block" }}>Cantitate Disponibilă</div>
                            <div className="td">{obiect.NrBucati}</div>
                        </div>
                        <div className="tr">
                            <div className="th" style={{ backgroundColor: "lightgrey", display: "inline-block" }}>Cantitate Selectată</div>
                            <div className="td">{quantity}</div>
                        </div>
                        <div className="tr">
                            <div className="th" style={{ backgroundColor: "lightgrey" }}>Număr Obiect</div>
                            <div className="th" style={{ backgroundColor: "lightgrey" }}>Seria</div>
                            <div className="th" style={{ backgroundColor: "lightgrey" }}>Selecție Serii</div>
                        </div>
                    </div>
                    <div className="tbody">
                        {obiect.SeriiBucati.map((bucata, index) => (
                            <React.Fragment key={bucata.Id}>
                                <div className="tr" key={index}>
                                    <div className="td">{index + 1}</div>
                                    <div className="td">{bucata.Serie}</div>
                                    <div className="td">
                                        <input
                                            type="checkbox"
                                            id={`bucata-${bucata.Id}`}
                                            name={`bucata-${bucata.Id}`}
                                            value={bucata.Id}
                                            disabled={checkedBoxes.length >= quantity && !checkedBoxes.includes(bucata.Id)}
                                            checked={checkedBoxes.includes(bucata.Id)}
                                            onChange={(e) => handleCheckboxChange(e, bucata.Id)}
                                        />
                                    </div>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div>
                    <button type='button' onClick={handleSave} style={{ marginRight: '10px' }}>Salvați</button>
                    <button type='button' onClick={handleReset}>Resetați</button>
                </div>
            </div>
        </div>,
        modalRoot
    );
}

export default SNPickerBM;