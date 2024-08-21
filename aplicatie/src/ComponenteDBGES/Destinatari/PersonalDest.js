import React, { useState, useRef, useEffect } from 'react';
import Modal from 'react-modal';
import axios, { CancelToken } from 'axios';
import '../PersonalDist.css'

const PersonalDest = ({ showPersonal, setShowPersonal, setShowDP, setDestinatar, setPostData }) => {

    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cancelTokenSource, setCancelTokenSource] = useState(null);
    const [hideOptions, setHideOptions] = useState(false);

    const inputRef = useRef(null);

    const [userTest, setUserTest] = useState({
        'fullName': '',
        'fullNameTest': ''

    });

    const [data, setData] = useState({
        user: null,
        nume: ''
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

        if (data.user === null || userTest.fullName === '') {
            alert('Numele de utilizator al destinatarului nu a fost selectat!');
            return;
        }

        if (userTest.fullName !== userTest.fullNameTest) {
            alert('Numele introdus nu aparține nici unui gestionar!');
            return;
        }

        setDestinatar(data.nume);
        setPostData({
            UsernamePersonal: data.user,
            UsernameStudent: null,
            IdSubgestiune: null
        });
        setShowPersonal(false);
        setShowDP(false);
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
        const newFormData = { ...data };
        newFormData.user = clickedOption;
        newFormData.nume = fullName;
        newFormData2.fullName = fullName;
        newFormData2.fullNameTest = fullName;

        setData(newFormData);
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
                        <div className="autocomplete" ref={inputRef}>
                            <label>
                                Numele Destinatarului:
                            </label>
                            <input
                                className="input-outside-table-g"
                                type="text"
                                name="fullName"
                                placeholder="Numele destinatarului este ..."
                                onChange={handleInputChange}
                                onFocus={handleInputFocus}
                                value={userTest.fullName}
                            />
                            {!hideOptions && userTest.fullName.length > 0 && (
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
                        <button type="submit">Adăugați</button>
                        <button type="button" onClick={() => setShowPersonal(false)}>Anulați</button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}

export default PersonalDest