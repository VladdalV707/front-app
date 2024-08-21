import React, { useEffect } from 'react';
import './SNPicker.css';

const SNPicker = ({ NrBucati, onSerialNumbersChange, serialNumbers, setSerialNumbers, currentIndex, setCurrentIndex, setAddFromData, addFormData }) => {

    useEffect(() => {
        if (serialNumbers.length > NrBucati) {
            handleReset();
        }
        // eslint-disable-next-line   
    }, []);

    // useEffect(() => {
    //     console.log("Initial serial numbers:", serialNumbers);
    //     console.log("Bucati procesate:", NrBucati);
    //     // eslint-disable-next-line
    // }, []);

    // useEffect(() => {
    //     console.log("Updated serial numbers:", serialNumbers);
    // }, [serialNumbers]);

    const handleRemoveSerialNumber = (index) => {
        const newSerialNumbers = [...serialNumbers];
        newSerialNumbers[index] = "";
        setSerialNumbers(newSerialNumbers);
    };

    const handleSaveSerialNumbers = () => {

        onSerialNumbersChange(serialNumbers);

    };

    const handleReset = () => {
        setSerialNumbers(['']);
        setCurrentIndex(0);
        const newFormData = {
            ...addFormData,
            NrBucati: NrBucati,
            SeriiObiecte: [],
            showSerialButton: true,
        };

        setAddFromData(newFormData);
        console.log("Am resetat selectorul de serii cu succes!");
    };

    const handleClose = () => {

        onSerialNumbersChange(serialNumbers);

    };

    const handleTableClick = (e) => {
        e.stopPropagation();
    };

    const handleAddSerialNumber = () => {
        const nextIndex = serialNumbers.indexOf("");
        if (serialNumbers.length < NrBucati) {
            if (nextIndex === -1) {
                // if there is no empty string, add a new one at the end of the array
                setCurrentIndex(serialNumbers.length);
                setSerialNumbers([...serialNumbers, ""]);
            } else {
                // if there is an empty string, replace it with a new one
                const newSerialNumbers = [...serialNumbers];
                newSerialNumbers.splice(nextIndex, 1, "");
                setCurrentIndex(nextIndex);
                setSerialNumbers(newSerialNumbers);
            }
        } else {
            alert("S-au adăugat toate seriile, nu se mai pot adăuga altele (le mai puteți modifica dacă doriți)");
        }
    };

    return (
        <div className="sn-picker-modal" onClick={handleClose}>
            <div className="sn-picker" onClick={handleTableClick}>
                <h1 style={{ textAlign: "center", marginBottom: "15px" }}>
                    Introduceți Seriile
                </h1>
                <table>
                    <thead>
                        <tr>
                            <th style={{ backgroundColor: "lightgrey" }}>Număr Obiect</th>
                            <th style={{ backgroundColor: "lightgrey" }}>
                                Introduceți Datele
                            </th>
                            <th style={{ backgroundColor: "lightgrey" }}>Opțiuni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {serialNumbers.map((sn, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                    {index <= currentIndex ? (
                                        <input
                                            id={`serial-number-${index}`}
                                            type="text"
                                            placeholder="Introduceți Seria"
                                            value={sn}
                                            onChange={(e) => {
                                                const newSerialNumbers = [...serialNumbers];
                                                newSerialNumbers[index] = e.target.value;
                                                setSerialNumbers(newSerialNumbers);
                                            }}
                                        />
                                    ) : null}
                                </td>
                                <td>
                                    {sn && serialNumbers.slice(index + 1).every(num => num === undefined) && index !== NrBucati - 1 && (


                                        <button type="button" style={{ marginRight: "10px" }} onClick={handleAddSerialNumber}>
                                            Adaugă
                                        </button>


                                    )}
                                    {sn && (
                                        <button type="button" onClick={() => handleRemoveSerialNumber(index)}>Șterge </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="sn-picker-buttons">
                    <button type="button" onClick={handleSaveSerialNumbers}>Salvați</button>
                    <button type="button" onClick={handleReset}>Resetați</button>
                </div>
            </div>
        </div>
    );
};

export default SNPicker;
