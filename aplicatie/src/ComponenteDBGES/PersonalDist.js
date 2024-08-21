import React, { useState, useRef, useEffect } from 'react';
import Modal from 'react-modal';
import axios, { CancelToken } from 'axios';
import './PersonalDist.css'

const PersonalDist = ({ user, obiect, showPersonal, setShowPersonal, setShowPicker, setShowUndistributed, setShowModal, gestiune }) => {

    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cancelTokenSource, setCancelTokenSource] = useState(null);
    const [hideOptions, setHideOptions] = useState(false);

    const inputRef = useRef(null);

    const [userTest, setUserTest] = useState({
        'fullName': '',
        'UserTest': ''

    });

    const [destinatar, setDestinatar] = useState({
        "IdObiectInventar": obiect.Id,
        "OptiuniDistribuire": {
            "UsernamePersonal": null,
            "UsernameStudent": null,
            "IdSubgestiune": null
        }
    });


    const handleInputChange = async (event) => {
        if (cancelTokenSource) {
            cancelTokenSource.cancel("Utilizatorul a oprit procesul de request!");
        }

        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value;

        const newFormData = { ...userTest };
        newFormData[fieldName] = fieldValue;

        setUserTest(newFormData);

        if (fieldValue.length > 0) {
            setIsLoading(true);

            const source = CancelToken.source();
            setCancelTokenSource(source);

            setTimeout(async () => {
                try {
                    const response = await axios.post(
                        "http://dnndev.me/api/Mifix.Api/Personal/GetFiltered",
                        {
                            Nume: fieldValue,
                            Pagination: {
                                CurrentPage: 1,
                                PageSize: 5,
                            },
                        },
                        { cancelToken: source.token }
                    );
                    console.log("Datele pentru autocomplete sunt: ", response.data);
                    setOptions(response.data.Personal);
                    setIsLoading(false);
                } catch (error) {
                    if (axios.isCancel(error)) {
                        console.log("Utilizatorul a oprit procesul de request!");
                    } else {
                        console.error(error);
                    }
                }
            }, 800);
        } else {
            setOptions([]);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setHideOptions(true);
                if (cancelTokenSource) {
                    cancelTokenSource.cancel("Utilizatorul a oprit procesul de request!");
                    setCancelTokenSource(null);
                }
            }
        };

        if (isLoading) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
        // eslint-disable-next-line
    }, [isLoading]);

    const handleAddFormSubmit = async (event) => {
        event.preventDefault();

        if (destinatar.OptiuniDistribuire.UsernamePersonal === null || userTest.UserTest === '') {
            alert('E-mail-ul destinatarului nu a fost selectat!');
            return;
        }

        if (userTest.UserTest !== destinatar.OptiuniDistribuire.UsernamePersonal) {
            alert('E-mail-ul introdus nu aparține nici unui destinatar!');
            return;
        }

        try {
            const response = await axios.post(
                `http://dnndev.me/api/Mifix.Api/ObiecteInventar/Distribuie`, destinatar
            );

            console.log(response.data);
            setDestinatar({
                "IdObiectInventar": obiect.Id,
                "OptiuniDistribuire": {
                    "UsernamePersonal": null,
                    "UsernameStudent": null,
                    "IdSubgestiune": null
                }
            });
            setShowPersonal(false);
            setShowPicker(false);
            setShowUndistributed(false);
            setShowModal(false);
        } catch (error) {
            console.log(error);
            if (error.response && error.response.status === 404) {
                alert("Operația de adăugare a eșuat pentru că nu există în baza de date un nume de utilizator corespunzător cu cel introdus!");
            } else {
                alert("Operația de adăugare a eșuat!");
            }
        }
    };

    const handleOptionClick = (event) => {
        const clickedOption = event.target.getAttribute('data-option');
        const selectedOption = options.find(option => option.Username === clickedOption);
        const fullName = `${selectedOption.Nume} ${selectedOption.Prenume}`;

        console.log("Ați selectat: ", clickedOption, ", cu numele: ", fullName);

        if (cancelTokenSource) {
            cancelTokenSource.cancel("Utilizatorul a oprit procesul de request!");
        }

        const newFormData2 = { ...userTest }
        const newFormData = { ...destinatar };
        newFormData.OptiuniDistribuire.UsernamePersonal = clickedOption;
        newFormData2.UserTest = clickedOption;
        newFormData2.fullName = fullName;


        setDestinatar(newFormData);
        setUserTest(newFormData2);
        setOptions([]);
        setHideOptions(true);
    };

    const handleInputFocus = () => {
        setHideOptions(false);
        setOptions([]);
        setIsLoading(false);
    };

    return (
        <Modal
            ariaHideApp={false}
            isOpen={showPersonal}
            onRequestClose={() => setShowPersonal(false)}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    zIndex: 9999,
                },
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    padding: '20px',
                    border: 'none',
                    borderRadius: '5px',
                    overflow: 'auto',
                    width: '100%',
                    maxWidth: '900px',
                    maxHeight: '80%',
                }
            }}
        >

            <div className="modal-content-pd" >
                <h2 style={{ textAlign: "center" }}>Formular de introducere - destinatar</h2>
                <form onSubmit={handleAddFormSubmit}>
                    <div className="form-section">
                        <div className='readonly'>
                            <label>
                                Seria obiectului ales:
                            </label>
                            <div className='input-with-tooltip' title={obiect.Serie}>
                                <input
                                    className="input-outside-table"
                                    type="text"
                                    name="Serie"
                                    value={obiect.Serie}
                                    readOnly
                                />
                            </div>
                            <label>
                                Numele Destinatarului:
                            </label>
                            <div className='input-with-tooltip'>
                                <input
                                    className="input-outside-table"
                                    type="text"
                                    name="NumeDestinatar"
                                    value={
                                        userTest.UserTest !== '' && userTest.UserTest !== destinatar.OptiuniDistribuire.UsernamePersonal
                                            ? "E-mail-ul introdus este invalid!"
                                            : userTest.UserTest !== '' ? userTest.fullName : "E-mail-ul nu a fost selectat!"
                                    }
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="autocomplete" ref={inputRef}>
                            <label>
                                E-mail-ul Destinatarului:
                            </label>
                            <input
                                className="input-outside-table-g"
                                type="text"
                                name="UserTest"
                                placeholder="Numele destinatarului este ..."
                                onChange={handleInputChange}
                                onFocus={handleInputFocus}
                                value={userTest.UserTest}
                            />
                            {!hideOptions && userTest.UserTest.length > 0 && (
                                <ul >
                                    {isLoading && <li>Se încarcă...</li>}
                                    {!isLoading && !hideOptions && options.map((option) => {
                                        return (
                                            <li key={option.Username} data-option={option.Username} onClick={handleOptionClick}>
                                                {option.Username}
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    </div>
                    <br />

                    <div className="button-container">
                        <button type="submit">Distribuiți</button>
                        <button type="button" onClick={() => setShowPersonal(false)}>Anulați</button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}

export default PersonalDist