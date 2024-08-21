import React, { useState, useEffect } from 'react'
import './DatabasePER.css';
import LoadingGES from './ComponenteDBGES/LoadingGES';
import { axios } from './axiosInstance';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';

const DestinatariGES = ({ user, setUser }) => {

    const [obiecte, setObiecte] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filtru, setFiltru] = useState("");
    const [filtruNO, setFiltruNO] = useState("");
    const [filtruSe, setFiltruSe] = useState("");
    const [filtruDenOB, setFiltruDenOB] = useState("");
    const [OptionsData, setOptionsData] = useState({
        filtruNume: '',
        filtruNrOrd: '',
        filtruSerie: '',
        filtruDenumireOb: ''
    });
    const [nrOpt, setNrOpt] = useState(null);

    /*Variabile Opțiuni*/
    const [showRows, setShowRows] = useState(false);

    const toggleRows = () => {
        setShowRows(!showRows);
    };

    /*--*/

    /*Funcții Opțiuni*/

    const handleOptionsDataChange = (event) => {
        event.preventDefault();

        const fieldName = event.target.getAttribute('name');
        const fieldValue = event.target.value;

        const newOptionsData = { ...OptionsData };
        newOptionsData[fieldName] = fieldValue;

        setOptionsData(newOptionsData);
    }

    const handleClearNO = (event) => {
        event.preventDefault();

        setFiltruNO('');

        setOptionsData({
            filtruNrOrd: ''
        });

    };

    const handleClearSerie = (event) => {
        event.preventDefault();

        setFiltruSe('');

        setOptionsData({
            filtruSerie: ''
        });
    };

    const handleClearDenOb = (event) => {
        event.preventDefault();

        setFiltruDenOB('');

        setOptionsData({
            filtruDenumireOb: ''
        });

    };

    const handleClearNume = (event) => {
        event.preventDefault();

        setFiltru('');

        setOptionsData({
            filtruNume: ''
        });

    };

    const handleFiltruNO = (event) => {

        event.preventDefault();

        const FiltruNO = OptionsData.filtruNrOrd;

        if (!FiltruNO) {
            alert("Filtrul numărului de ordine nu poate fi lăsat liber!");
            return;
        }

        if (isNaN(FiltruNO)) {
            alert("Filtrul numărului de ordine poate conține doar caractere numerice!");
            return;
        }

        setFiltruNO(FiltruNO);
    }

    const handleFiltruSerie = (event) => {

        event.preventDefault();

        const FiltruSerie = OptionsData.filtruSerie;

        if (!FiltruSerie) {
            alert("Filtrul seriei obiectului nu poate fi lăsat liber!");
            return;
        }

        if (FiltruSerie.length > 200) {
            alert("Filtrul seriei obiectului nu poate depăși 200 de caractere!");
            return;
        }

        setFiltruSe(FiltruSerie);
    }

    const handleFiltruDenOb = (event) => {

        event.preventDefault();

        const FiltruDenumireObiect = OptionsData.filtruDenumireOb;

        if (!FiltruDenumireObiect) {
            alert("Filtrul denumirii obiectului nu poate fi lăsat liber!");
            return;
        }

        if (FiltruDenumireObiect.length > 200) {
            alert("Filtrul denumirii obiectului nu poate depăși 200 de caractere!");
            return;
        }

        setFiltruDenOB(FiltruDenumireObiect);
    }

    const handleFiltruNume = (event) => {

        event.preventDefault();

        const FiltruNumeDestinatar = OptionsData.filtruNume;

        if (!FiltruNumeDestinatar) {
            alert("Filtrul numelui destinatarului nu poate fi lăsat liber!");
            return;
        }

        if (FiltruNumeDestinatar.length > 200) {
            alert("Filtrul numelui destinatarului nu poate depăși 200 de caractere!");
            return;
        }

        setFiltru(FiltruNumeDestinatar);
    }

    const handleClearInputs = (event) => {
        event.preventDefault();

        setFiltruNO('');
        setFiltruSe('');
        setFiltruDenOB('');
        setFiltru('');

        setOptionsData({
            filtruNume: '',
            filtruNrOrd: '',
            filtruSerie: '',
            filtruDenumireOb: ''
        });

    };

    /*--*/

    /*Variabile Paginare*/
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [lastPage, setLastPage] = useState(0);
    const [inputPage, setInputPage] = useState('');
    /*--*/

    /*Funcții Paginare */

    const handlePageSizeChange = (event) => {
        setPageSize(parseInt(event.target.value));
        setCurrentPage(1);
    };

    const handlePrevClick = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextClick = () => {
        if (currentPage < lastPage) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);;
    };

    const handleInputPageChange = (event) => {
        const value = parseInt(event.target.value);
        setInputPage(isNaN(value) ? '' : value);
    };

    const handleGoToPage = () => {
        if (inputPage !== "") {
            const pageNumber = parseInt(inputPage);
            if (pageNumber >= 1) {
                const lastPossiblePage = Math.min(pageNumber, lastPage);
                setCurrentPage(lastPossiblePage);
                setInputPage("");
            } else if (pageNumber === 0) {
                alert('Introduceți o pagină mai mare decât 0!');
            }
        }
    };

    const handleRadioButtonChange = (option) => {
        if (nrOpt === option) {
            setNrOpt(null); // Uncheck the selected radio button
            setObiecte([]); // Clear the table
        } else {
            setNrOpt(option); // Check the selected radio button
        }
    };


    /*Sfârșit Paginare*/

    const postdata = {
        NumeDestinatar: filtru || "",
        NrDeOrdine: filtruNO || "",
        Serie: filtruSe || "",
        Denumire: filtruDenOB || "",
        Pagination: { CurrentPage: currentPage, PageSize: pageSize }
    };

    useEffect(() => {
        if (nrOpt !== null) {
            setLoading(true);
            const url = `http://dnndev.me/api/Mifix.Api/ObiecteInventar/GetFilteredPentruGestionar?optiuniDistribuire=${nrOpt}`;
            const fetchData = async () => {
                try {
                    const res = await axios.post(url, postdata);
                    console.log(res);
                    let date = res.data.ObiecteInventar.map((data) => {
                        let commonData = {
                            Id: data.Id,
                            NumarDeOrdine: data.NrDeOrdine,
                            Nume: data.Nume,
                            Serie: data.Serie,
                            DataPrimirii: data.DataPrimirii,
                            Gestiune: {
                                Id: data.Gestiune.Id,
                                Nume: data.Gestiune.Nume,
                                NrGestiune: data.Gestiune.NrGestiune
                            }
                        };

                        switch (nrOpt) {
                            case 1:
                                return {
                                    ...commonData,
                                    Student: {
                                        NumeIntreg: data.Student.NumeIntreg,
                                        Username: data.Student.Username
                                    }
                                };
                            case 2:
                                return {
                                    ...commonData,
                                    Personal: {
                                        Prenume: data.Personal.Prenume,
                                        Nume: data.Personal.Nume,
                                        Username: data.Personal.Username
                                    }
                                };
                            case 3:
                                return {
                                    ...commonData,
                                    Subgestiune: {
                                        Id: data.Subgestiune.Id,
                                        Nume: data.Subgestiune.Nume
                                    }
                                };
                            default:
                                return commonData;
                        }
                    });

                    console.log("Datele primite sunt:\n", date);
                    setObiecte(date);
                    setLastPage(res.data.TotalPages);
                    setLoading(false);
                } catch (error) {
                    console.log(error);
                    setLoading(false);
                }
            };

            fetchData();
        }
        // eslint-disable-next-line    
    }, [nrOpt, filtru, filtruNO, filtruSe, filtruDenOB]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filtru, filtruNO, filtruSe, filtruDenOB]);


    return (
        <div className="outer-wrapper">
            {loading && <div style={{ display: 'block' }}><LoadingGES loading={loading} /></div>}
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th style={{ fontSize: "30px", backgroundColor: "lightgrey", position: "static" }} colSpan="6">
                                <FontAwesomeIcon icon={faGear} style={{ cursor: "pointer", marginRight: "5px", fontSize: "32px" }} onClick={toggleRows} title='Vedeți mai multe opțiuni!' />
                                Tabel - Evidență Obiecte Destinatari
                            </th>
                        </tr>
                        <tr style={{ display: showRows ? "table-row" : "none" }}>
                            <th style={{ backgroundColor: "lightgrey" }} colSpan="2">
                                Filtru - Studenți:
                                <input
                                    type="radio"
                                    name="filterOption"
                                    value={1}
                                    checked={nrOpt === 1}
                                    onChange={() => handleRadioButtonChange(1)}
                                />
                            </th>
                            <th style={{ backgroundColor: "lightgrey" }} colSpan="2">
                                Filtru - Personal:
                                <input
                                    type="radio"
                                    name="filterOption"
                                    value={2}
                                    checked={nrOpt === 2}
                                    onChange={() => handleRadioButtonChange(2)}
                                />
                            </th>
                            <th style={{ backgroundColor: "lightgrey" }} colSpan="2">
                                Filtru - Subgestiuni:
                                <input
                                    type="radio"
                                    name="filterOption"
                                    value={3}
                                    checked={nrOpt === 3}
                                    onChange={() => handleRadioButtonChange(3)}
                                />
                            </th>
                        </tr>
                        {nrOpt && (
                            <>
                                <tr style={{ display: showRows ? 'table-row' : 'none' }}>
                                    <th style={{ backgroundColor: 'lightgrey' }} colSpan="1">
                                        Filtru - N.O.
                                    </th>
                                    <th style={{ backgroundColor: 'lightgrey' }} colSpan="1">
                                        Filtru - Serie
                                    </th>
                                    <th style={{ backgroundColor: 'lightgrey' }} colSpan="2">
                                        Filtru - Denumire Obiect
                                    </th>
                                    <th style={{ backgroundColor: 'lightgrey' }} colSpan="1" title={`Filtrul pentru numele ${nrOpt === 1 ? 'studentului' : nrOpt === 2 ? 'membrului din cadrul personalului universitar' : 'subgestiunii'}`}>
                                        Filtru - Nume
                                    </th>
                                    <th style={{ backgroundColor: 'lightgrey' }} colSpan="1">
                                        Opțiuni
                                    </th>
                                </tr>
                                <tr style={{ display: showRows ? 'table-row' : 'none' }}>
                                    <th style={{ backgroundColor: 'lightgrey' }} colSpan="1">
                                        <div className="input-container">
                                            <input
                                                type="text"
                                                name="filtruNrOrd"
                                                placeholder="Filtru - N.O."
                                                onChange={handleOptionsDataChange}
                                                value={OptionsData.filtruNrOrd}
                                            />
                                        </div>
                                        <button type="button" onClick={handleFiltruNO} style={{ marginRight: '10px' }}>
                                            Adaugă
                                        </button>
                                        <button type="button" onClick={handleClearNO}>
                                            Șterge
                                        </button>
                                    </th>
                                    <th style={{ backgroundColor: 'lightgrey' }} colSpan="1">
                                        <div className="input-container">
                                            <input
                                                type="text"
                                                name="filtruSerie"
                                                placeholder="Filtru - Serie"
                                                onChange={handleOptionsDataChange}
                                                value={OptionsData.filtruSerie}
                                            />
                                        </div>
                                        <button type="button" onClick={handleFiltruSerie} style={{ marginRight: '10px' }}>
                                            Adaugă
                                        </button>
                                        <button type="button" onClick={handleClearSerie}>
                                            Șterge
                                        </button>
                                    </th>
                                    <th style={{ backgroundColor: 'lightgrey' }} colSpan="2">
                                        <div className="input-container">
                                            <input
                                                type="text"
                                                name="filtruDenumireOb"
                                                placeholder="Filtru - Denumire Obiect"
                                                onChange={handleOptionsDataChange}
                                                value={OptionsData.filtruDenumireOb}
                                            />
                                        </div>
                                        <button type="button" onClick={handleFiltruDenOb} style={{ marginRight: '10px' }}>
                                            Adaugă
                                        </button>
                                        <button type="button" onClick={handleClearDenOb}>
                                            Șterge
                                        </button>
                                    </th>
                                    <th style={{ backgroundColor: 'lightgrey' }} colSpan="1">
                                        <div className="input-container">
                                            <input
                                                type="text"
                                                name="filtruNume"
                                                placeholder="Filtru - Nume"
                                                onChange={handleOptionsDataChange}
                                                value={OptionsData.filtruNume}
                                            />
                                        </div>
                                        <button type="button" onClick={handleFiltruNume} style={{ marginRight: '10px' }}>
                                            Adaugă
                                        </button>
                                        <button type="button" onClick={handleClearNume}>
                                            Șterge
                                        </button>
                                    </th>
                                    <th style={{ backgroundColor: "lightgrey" }} colSpan="1">
                                        <button type='button' onClick={handleClearInputs}>
                                            Șterge Filtrele
                                        </button>
                                    </th>
                                </tr>
                            </>
                        )}
                        <tr>
                            <th style={{ backgroundColor: "lightgrey" }}>N.O.</th>
                            <th style={{ backgroundColor: "lightgrey" }}>Denumire Obiect</th>
                            <th style={{ backgroundColor: "lightgrey" }}>Serie</th>
                            <th style={{ backgroundColor: "lightgrey" }}>Data Primirii</th>
                            <th style={{ backgroundColor: "lightgrey" }}>Gestiune</th>
                            <th style={{ backgroundColor: "lightgrey" }}>Destinatar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {obiecte.length > 0 ? (
                            obiecte.map((obiect) => (
                                <tr key={obiect.Id}>
                                    <td>{obiect.NumarDeOrdine}</td>
                                    <td>{obiect.Nume}</td>
                                    <td>{obiect.Serie ? obiect.Serie : "Acestă bucată nu are serie!"}</td>
                                    <td>{moment(obiect.DataPrimirii, 'YYYY-MM-DDTHH:mm:ss').format('DD.MM.YYYY')}</td>
                                    <td>{`${obiect.Gestiune.NrGestiune}. ${obiect.Gestiune.Nume}`}</td>
                                    <td>
                                        {nrOpt === 1 && obiect && obiect.Student && (
                                            <span title={obiect.Student.Username}>
                                                {obiect.Student.NumeIntreg}
                                            </span>
                                        )}
                                        {nrOpt === 2 && obiect && obiect.Personal && (
                                            <span title={obiect.Personal.Username}>
                                                {obiect.Personal.Nume} {obiect.Personal.Prenume}
                                            </span>
                                        )}
                                        {nrOpt === 3 && obiect && obiect.Subgestiune && (
                                            <span title={obiect.Subgestiune.Nume}>
                                                {obiect.Subgestiune.Nume}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">
                                    {nrOpt ? "Nu există obiecte primite pentru destinatarii selectați!" : "Nu ați selectat nici un destinatar!"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="pagination" style={{ marginTop: "25px", display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '25px' }}>
                <select value={pageSize} onChange={handlePageSizeChange} className="select-page-size" style={{ marginRight: '10px' }}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>

                <button type='button' disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>&lt;&lt;</button>
                <button type='button' disabled={currentPage === 1} onClick={handlePrevClick}>&lt;</button>

                {/* Display the first page */}
                <button type='button' style={{ fontWeight: currentPage === 1 ? "bold" : "normal" }} onClick={() => handlePageClick(1)}>1</button>

                {/* Display dots if there are more than 3 pages and the current page is not within the first 2 pages */}
                {lastPage > 3 && currentPage > 3 && <span>...</span>}

                {/* Display the current page */}
                {currentPage !== 1 && (
                    <button type='button' style={{ fontWeight: "bold" }} onClick={() => handlePageClick(currentPage)}>{currentPage}</button>
                )}

                {/* Display dots if there are more than 3 pages and the current page is not within the last 2 pages */}
                {lastPage > 3 && currentPage < lastPage - 2 && <span>...</span>}

                {/* Display the last page if the current page is not the last page */}
                {currentPage !== lastPage && lastPage > 1 && (
                    <button type='button' style={{ fontWeight: currentPage === lastPage ? "bold" : "normal" }} onClick={() => handlePageClick(lastPage)}>{lastPage}</button>
                )}

                <button type='button' disabled={currentPage === lastPage} onClick={handleNextClick}>&gt;</button>
                <button type='button' disabled={currentPage === lastPage} onClick={() => setCurrentPage(lastPage)}>&gt;&gt;</button>

                <input
                    type="number"
                    min="1"
                    max={lastPage}
                    value={inputPage}
                    onChange={handleInputPageChange}
                    onKeyDown={(event) => {
                        if (
                            !/[0-9]/.test(event.key) && // Allow numeric characters
                            event.key !== 'Backspace' // Allow the "Backspace" key for deleting
                        ) {
                            event.preventDefault();
                        }
                    }}
                    style={{ width: '100px', margin: '0 5px' }}
                />
                <button type="button" onClick={handleGoToPage}>Selectați</button>
            </div>
        </div>




    )
}

export default DestinatariGES