import React, { useState, useRef, useEffect } from 'react';
import Modal from 'react-modal';
import axios, { CancelToken } from 'axios';
import './AddGestionar.css';

const AddGestionar = ({ showAdd, setShowAdd, gestionar, gestiune, setItemAdded, setShowModal }) => {

    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cancelTokenSource, setCancelTokenSource] = useState(null);
    const [hideOptions, setHideOptions] = useState(false);

    const inputRef = useRef(null);

    const [gestionarNou, setGestionarNou] = useState({
        IdGestiune: '',
        UsernameGestionar: '',
        UsernameTest: '',
        fullName: ''
    });

    const handleInputChange = async (event) => {
        if (cancelTokenSource) {
            cancelTokenSource.cancel("Utilizatorul a oprit procesul de request!");
        }

        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value;

        const newFormData = { ...gestionarNou };
        newFormData[fieldName] = fieldValue;

        setGestionarNou(newFormData);

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

        if (!gestionarNou.UsernameGestionar) {
            alert('Numele de utilizator (e-mail-ul) gestionarului nu a fost selectat corespunzător!');
            return;
        }

        if (gestionarNou.UsernameGestionar !== gestionarNou.UsernameTest) {
            alert('E-mail-ul introdus nu aparține nici unei persoane!');
            return;
        }

        try {
            const response = await axios.post(
                `http://dnndev.me/api/Mifix.Api/Gestiuni/AddGestionar?usernameGestionar=${gestionarNou.UsernameGestionar}&Id=${gestiune.Id}`
            );
            console.log(response.data);
            setItemAdded(true);
            setGestionarNou({
                IdGestiune: '',
                UsernameGestionar: '',
                UsernameTest: '',
                fullName: ''
            });
            setShowAdd(false);
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

        const newFormData = { ...gestionarNou };
        newFormData.UsernameGestionar = clickedOption;
        newFormData.UsernameTest = clickedOption;
        newFormData.fullName = fullName;

        setGestionarNou(newFormData);
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
            isOpen={showAdd}
            onRequestClose={() => setShowAdd(false)}
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
                    maxHeight: '100vh',
                }
            }}
        >

            <div className="modal-content-2"  >
                <h2 style={{ textAlign: 'center', marginBottom: '25px' }}>Formular de introducere a unui gestionar</h2>
                <form onSubmit={handleAddFormSubmit}>
                    <div className="form-section">
                        <div className='readonly'>
                            <label>
                                Gestiune aleasă:
                            </label>
                            <div className='input-with-tooltip' title={gestiune.Nume}>
                                <input
                                    className="input-outside-table"
                                    type="text"
                                    name="Gestiune"
                                    value={gestiune.Nume}
                                    readOnly
                                />
                            </div>
                            <label>
                                Numele Gestionarului:
                            </label>
                            <div className='input-with-tooltip'>
                                <input
                                    className="input-outside-table"
                                    type="text"
                                    name="NumeGestionar"
                                    value={
                                        gestionarNou.UsernameGestionar !== gestionarNou.UsernameTest && gestionarNou.UsernameGestionar !== ''
                                            ? "E-mail-ul introdus este invalid!"
                                            : gestionarNou.UsernameGestionar !== '' ? gestionarNou.fullName : "E-mail-ul nu a fost selectat!"
                                    }
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="autocomplete" ref={inputRef}>
                            <label>
                                E-mail-ul Gestionarului Nou:
                            </label>
                            <input
                                className="input-outside-table-g"
                                type="text"
                                name="UsernameGestionar"
                                placeholder="E-mail-ul gestionarului este ..."
                                onChange={handleInputChange}
                                onFocus={handleInputFocus}
                                value={gestionarNou.UsernameGestionar}
                            />
                            {!hideOptions && gestionarNou.UsernameGestionar.length > 0 && (
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

                    <div className="button-container">
                        <button type="submit">Adăugați</button>
                        <button type="button" onClick={() => setShowAdd(false)}>Anulați</button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}

export default AddGestionar