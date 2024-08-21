import React from 'react'
import { useState, useRef, useEffect } from 'react';
import { axios } from './axiosInstance';
import { nanoid } from 'nanoid';
import ReadOnlyRowDP from './ComponenteDepartamente/ReadOnlyRowDP';
import LoadingDP from './ComponenteDepartamente/LoadingDP';
import "./DataBaseDP.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';

const Departamente = () => {

    const [itemAdded, setItemAdded] = useState(false);
    const [itemDeleted, setItemDeleted] = useState(false);
    const [itemEdited, setItemEdited] = useState(false);

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

        if (!FiltruNumeDP) {
            alert("Filtrul numelui de departament nu poate fi lăsat liber!");
            return;
        }

        if (FiltruNumeDP.length > 200) {
            alert("Filtrul numelui de departament nu poate depăși 200 de caractere!");
            return;
        }

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
        let cancelTokenSource = axios.CancelToken.source();
        setLoading(true);
        const postdata = {
            Nume: filtruNumeDP || "",
            Pagination: { CurrentPage: currentPage, PageSize: pageSize }
        };

        const fetchData = async () => {
            try {
                const res = await axios.post(url, postdata, { cancelToken: cancelTokenSource.token });
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

        return () => {
            cancelTokenSource.cancel("Requestul de departamente a fost anulat!");
        };
        // eslint-disable-next-line
    }, [pageSize, currentPage, filtruNumeDP]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filtruNumeDP]);

    useEffect(() => {
        if (itemAdded) {
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
            setItemAdded(false);
        }
        // eslint-disable-next-line
    }, [itemAdded]);

    useEffect(() => {
        if (itemDeleted) {
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
            setItemDeleted(false);
        }
        // eslint-disable-next-line
    }, [itemDeleted]);

    useEffect(() => {
        if (itemEdited) {
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
            setItemEdited(false);
        }
        // eslint-disable-next-line
    }, [itemEdited]);

    return (
        <div className="outer-wrapper">
            {<div style={{ display: 'block' }}><LoadingDP loading={loading} /></div>}
            <div className="table-wrapper">
                <table>

                    <thead>

                        <tr>
                            <th style={{ fontSize: "30px", backgroundColor: "lightgrey", position: "static" }} colSpan="3">
                                <FontAwesomeIcon icon={faGear} style={{ cursor: "pointer", marginRight: "5px", fontSize: "32px" }} onClick={toggleRows} title='Vedeți mai multe opțiuni!' />
                                Tabel - Departamente Universitate
                            </th>
                        </tr>

                        <tr style={{ display: showRows ? 'table-row' : 'none' }}>
                            <th style={{ backgroundColor: "lightgrey" }} colSpan="2">Filtru - Nume Departament</th>
                            <th style={{ backgroundColor: "lightgrey" }} colSpan="1">Opțiuni - Filtru</th>
                        </tr>

                        <tr style={{ display: showRows ? 'table-row' : 'none' }}>

                            <th style={{ backgroundColor: "lightgrey" }} colSpan="2">
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
                            <th style={{ backgroundColor: "lightgrey" }}>Număr Gestiuni Departament</th>
                            <th style={{ backgroundColor: "lightgrey" }}>Opțiuni Gestiuni</th>
                        </tr>

                    </thead>

                    <tbody>

                        {departamente?.map((departament) => (
                            <ReadOnlyRowDP key={departament.Id} departament={departament} setItemAdded={setItemAdded} setItemDeleted={setItemDeleted} setItemEdited={setItemEdited} />
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
    )
}

export default Departamente;