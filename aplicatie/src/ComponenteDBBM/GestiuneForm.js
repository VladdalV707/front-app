import { React, useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import LoadingBM from './LoadingBM';
import { axios } from '../axiosInstance';
import { nanoid } from "nanoid";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import './GestiuneForm.css';
import SelectGestiuni from './SelectGestiuni';

const GestiuneForm = ({ isClicked, setIsClicked, setIsChosen, addFormData, setAddFormData }) => {

    const [selectedDepartament, setSelectedDepartament] = useState(null);


    /*Variabile Opțiuni*/

    const [showRows, setShowRows] = useState(false);

    const toggleRows = () => {
        setShowRows(!showRows);
    };

    const [filtruNumeDP, setFiltruNumeDP] = useState("");

    const [OptionsData, setOptionsData] = useState({
        filtruNumeDP: ''
    });

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

    const handleFiltruNumeDP = (event) => {
        event.preventDefault();

        const FiltruNumeDP = OptionsData.filtruNumeDP;

        setFiltruNumeDP(FiltruNumeDP);
    }

    const handleClearInputs = (event) => {
        event.preventDefault();

        setFiltruNumeDP('');

        setOptionsData({
            filtruNumeDP: ''
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


    /*Sfârșit Paginare*/

    const [loading, setLoading] = useState(false);
    const url = 'http://dnndev.me/api/Mifix.Api/Departamente/GetFiltered';
    const [departamente, setDepartamente] = useState([]);

    const prevLastPageRef = useRef();

    useEffect(() => {
        if (isClicked) {
            setLoading(true);
            const postdata = {
                Nume: filtruNumeDP || "",
                Pagination: { CurrentPage: currentPage, PageSize: pageSize }
            };

            const fetchData = async () => {
                try {
                    const res = await axios.post(url, postdata);
                    console.log(res);
                    let date = res.data.Departamente.map(data => ({
                        Id: data.Id,
                        id: nanoid(),
                        Nume: data.Nume,
                        Gestiuni: data.Gestiuni
                    }));
                    console.log("Datele primite sunt:\n", date);
                    console.log("Pagina Curentă: ", currentPage);
                    console.log("Mărimea Paginii: ", pageSize);
                    prevLastPageRef.current = lastPage;

                    setDepartamente(date);
                    setLastPage(res.data.TotalPages);
                    if (lastPage > 0) {
                        console.log("Ultima Pagină: ", lastPage);
                    }
                    setLoading(false);
                } catch (error) {
                    console.log(error);
                    setLoading(false);
                }
            };

            fetchData();
        }
        // eslint-disable-next-line
    }, [pageSize, currentPage, filtruNumeDP]);

    const handleSelectDepartament = (departament) => {
        setSelectedDepartament(departament);
        setShowGestiuni(true);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [filtruNumeDP]);

    const [showGestiuni, setShowGestiuni] = useState(false);

    return (
        <Modal
            ariaHideApp={false}
            isOpen={isClicked}
            onRequestClose={() => setIsClicked(false)}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 9998,
                },
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    border: 'none',
                    borderRadius: '10px',
                    maxWidth: '1200px',
                    width: '100%',
                    maxHeight: '95%',
                    backgroundColor: 'white',
                    overflow: 'none',
                },
            }}
        >
            <div className='modal-content-ges'>
                <div className="outer-wrapper" style={{ maxHeight: '100%' }}>
                    {<div style={{ display: 'block' }}><LoadingBM loading={loading} /></div>}
                    <div className="table-wrapper">
                        <table>

                            <thead>

                                <tr>
                                    <th style={{ fontSize: "30px", backgroundColor: "lightgrey", position: "static" }} colSpan="2">
                                        <FontAwesomeIcon icon={faGear} style={{ cursor: "pointer", marginRight: "5px", fontSize: "32px" }} onClick={toggleRows} title='Vedeți mai multe opțiuni!' />
                                        Tabel - Departamente Universitate
                                    </th>
                                </tr>

                                <tr style={{ display: showRows ? 'table-row' : 'none' }}>
                                    <th style={{ backgroundColor: "lightgrey" }} colSpan="1">Filtru - Nume Departament</th>
                                    <th style={{ backgroundColor: "lightgrey" }} colSpan="1">Opțiuni - Filtru</th>
                                </tr>

                                <tr style={{ display: showRows ? 'table-row' : 'none' }}>

                                    <th style={{ backgroundColor: "lightgrey" }} colSpan="1">
                                        <div className='input-container'>
                                            <input
                                                type="text"
                                                name="filtruNumeDP"
                                                placeholder="Filtru-Nume Departament"
                                                onChange={handleOptionsDataChange}
                                                value={OptionsData.filtruNumeDP}
                                            />
                                        </div>
                                    </th>

                                    <th style={{ backgroundColor: "lightgrey" }} colSpan="1">
                                        <button type='button' onClick={handleFiltruNumeDP} style={{ marginRight: '10px' }}>
                                            Adaugă Filtrul
                                        </button>
                                        <button type='button' onClick={handleClearInputs}>
                                            Șterge Filtrul
                                        </button>
                                    </th>

                                </tr>

                                <tr>
                                    <th style={{ backgroundColor: "lightgrey" }}>Denumire Departament</th>
                                    <th style={{ backgroundColor: "lightgrey" }}>Alegere Departament</th>
                                </tr>

                            </thead>

                            <tbody>
                                {departamente?.map((departament) => (
                                    <tr key={departament.Id}>
                                        <td>{departament.Nume}</td>
                                        <td>
                                            {departament.Gestiuni.length > 0 ? (
                                                <>
                                                    <button type="button" onClick={() => handleSelectDepartament(departament)}>Alegeți</button>
                                                    {showGestiuni && selectedDepartament === departament && (
                                                        <SelectGestiuni
                                                            showGestiuni={showGestiuni}
                                                            setShowGestiuni={setShowGestiuni}
                                                            setIsClicked={setIsClicked}
                                                            departament={departament}
                                                            setIsChosen={setIsChosen}
                                                            addFormData={addFormData}
                                                            setAddFormData={setAddFormData}
                                                        />
                                                    )}
                                                </>
                                            ) : (
                                                <div>Departamentul nu are gestiuni atribuite!</div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
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

                    <div className='message' style={{ marginTop: "10px", display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                        {lastPage === 0 && (
                            <div style={{ marginLeft: '10px', fontStyle: 'italic' }}>Nu există departamente care să fie vizualizate.</div>
                        )}
                        {currentPage > lastPage && (
                            <div style={{ marginLeft: '10px', fontStyle: 'italic' }}>Pagina nu este disponibilă.</div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default GestiuneForm;