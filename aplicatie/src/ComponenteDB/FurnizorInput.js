import React, { useState, useRef, useEffect } from 'react';
import axios, { CancelToken } from 'axios';
import './FurnizorInput.css';

const FurnizorInput = ({ addFormData, setAddFormData }) => {
    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cancelTokenSource, setCancelTokenSource] = useState(null);
    const [hideOptions, setHideOptions] = useState(false);

    const inputRef = useRef(null);


    const handleInputChange = async (event) => {
        if (cancelTokenSource) {
            cancelTokenSource.cancel("Utilizatorul a oprit procesul de request!");
        }

        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value;

        const newFormData = { ...addFormData };
        newFormData[fieldName] = fieldValue;

        setAddFormData(newFormData);

        if (fieldValue.length > 0) {
            setIsLoading(true);

            const source = CancelToken.source();
            setCancelTokenSource(source);

            setTimeout(async () => {
                try {
                    const response = await axios.post(
                        "http://dnndev.me/api/Mifix.Api/Furnizori/GetFiltered",
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
                    setOptions(response.data.Furnizori);
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


    const handleOptionClick = (event) => {
        const clickedOption = event.target.getAttribute('data-option');
        console.log("Ați selectat: ", clickedOption);

        if (cancelTokenSource) {
            cancelTokenSource.cancel("Utilizatorul a oprit procesul de request!");
        }

        const newFormData = { ...addFormData };
        newFormData.Furnizor = clickedOption;

        setAddFormData(newFormData);
        setOptions([]);
        setHideOptions(true);
    };


    const handleInputFocus = () => {
        setHideOptions(false);
        setOptions([]);
        setIsLoading(false);
    };

    return (
        <div className="autocomplete" ref={inputRef}>
            <label>Furnizor:</label>
            <br />
            <input
                className="input-outside-table-f"
                type="text"
                name="Furnizor"
                placeholder="Furnizorul este ..."
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                value={addFormData.Furnizor}
            />
            {!hideOptions && addFormData.Furnizor.length > 0 && (
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
    );

};

export default FurnizorInput;
