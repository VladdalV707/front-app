import React, { useState, useRef, useEffect } from 'react';
import Modal from 'react-modal';
import axios, { CancelToken } from 'axios';
import '../SubgestiuneDist.css'

const SubgestiuneDest = ({ showSubgestiune, setShowSubgestiune, setShowGP, setShowDP, setDestinatar, setPostData, gestiune }) => {

    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cancelTokenSource, setCancelTokenSource] = useState(null);
    const [hideOptions, setHideOptions] = useState(false);

    const inputRef = useRef(null);

    const [name, setName] = useState({
        'Name': '',
        'NameTest': ''
    });

    const [data, setData] = useState({
        Id: null,
        nume: ''
    });

    const handleInputChange = async (event) => {
        if (cancelTokenSource) {
            cancelTokenSource.cancel("Utilizatorul a oprit procesul de request!");
        }

        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value;

        const newFormData = { ...name };
        newFormData[fieldName] = fieldValue;

        setName(newFormData);

        if (fieldValue.length > 0) {
            setIsLoading(true);

            const source = CancelToken.source();
            setCancelTokenSource(source);

            setTimeout(async () => {
                try {
                    const response = await axios.post(
                        `http://dnndev.me/api/Mifix.Api/Subgestiuni/GetFiltered`,
                        {
                            IdGestiune: gestiune.Id,
                            Nume: fieldValue,
                            Pagination: {
                                CurrentPage: 1,
                                PageSize: 5,
                            },
                        },
                        { cancelToken: source.token }
                    );
                    console.log("Datele pentru autocomplete sunt: ", response.data);
                    setOptions(response.data.Subgestiuni);
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

        if (data.Id === null || name.Name === '') {
            alert('Subgestiunea nu a fost selectată!');
            return;
        }

        if (name.Name !== name.NameTest) {
            alert('Numele introdus nu aparține nici unei subgestiuni!');
            return;
        }

        setDestinatar(data.nume);
        setPostData({
            UsernamePersonal: null,
            UsernameStudent: null,
            IdSubgestiune: data.Id
        });
        setShowSubgestiune(false);
        setShowGP(false);
        setShowDP(false);


    };

    const handleOptionClick = (event) => {
        const clickedOption = event.target.getAttribute('data-option');
        const selectedOption = options.find(option => option.Nume === clickedOption);
        const Id = `${selectedOption.Id}`;

        console.log("Ați selectat: ", clickedOption, ", cu id-ul: ", Id);

        if (cancelTokenSource) {
            cancelTokenSource.cancel("Utilizatorul a oprit procesul de request!");
        }

        const newFormData2 = { ...name }
        const newFormData = { ...data };
        newFormData.Id = Id;
        newFormData.nume = clickedOption;
        newFormData2.Name = clickedOption;
        newFormData2.NameTest = clickedOption;

        setData(newFormData);
        setName(newFormData2);
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
            isOpen={showSubgestiune}
            onRequestClose={() => setShowSubgestiune(false)}
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

            <div className="modal-content-sd" >
                <h2 style={{ textAlign: "center" }}>Formular de introducere - subgestiune</h2>
                <form onSubmit={handleAddFormSubmit}>
                    <div className="form-section">
                        <div className='readonly'>
                            <label>
                                Subgestiunea aleasă:
                            </label>
                            <div className='input-with-tooltip' title={`${gestiune.NrGestiune}. ${gestiune.Nume}`}>
                                <input
                                    className="input-outside-table"
                                    type="text"
                                    name="Subgestiune"
                                    value={`${gestiune.NrGestiune}. ${gestiune.Nume}`}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="autocomplete" ref={inputRef}>
                            <label>
                                Numele Subgestiunii:
                            </label>
                            <input
                                className="input-outside-table-g"
                                type="text"
                                name="Name"
                                placeholder="Numele subgestiunii este ..."
                                onChange={handleInputChange}
                                onFocus={handleInputFocus}
                                value={name.Name}
                            />
                            {!hideOptions && name.Name.length > 0 && (
                                <ul >
                                    {isLoading && <li>Se încarcă...</li>}
                                    {!isLoading && !hideOptions && options.map((option) => {
                                        return (
                                            <li key={option.Id} data-option={option.Nume} onClick={handleOptionClick}>
                                                {option.Nume}
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
                        <button type="button" onClick={() => setShowSubgestiune(false)}>Anulați</button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}

export default SubgestiuneDest