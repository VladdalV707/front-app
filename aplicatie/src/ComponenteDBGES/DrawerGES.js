import React, { useEffect, useState, useRef, Fragment } from 'react';
import './DrawerGES.css';
import LoadingGES from './LoadingGES';
import { axios } from '../axiosInstance';
import { nanoid } from 'nanoid';
import EditableRowDWGES from './DrawerGES/EditableRowDWGES';
import ReadOnlyRowDWGES from './DrawerGES/ReadOnlyRowDWGES';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';

const DrawerGES = ({ onClose, isDrawerOpen, gestiune, user }) => {

    const url = `http://dnndev.me/api/Mifix.Api/Subgestiuni/GetFiltered`;
    const [loading, setLoading] = useState(false);
    const [subgestiuni, setSubgestiuni] = useState([]);
    const prevLastPageRef = useRef();
    const [itemDeleted, setItemDeleted] = useState(false);
    const [itemAdded, setItemAdded] = useState(false);
    const [itemEdited, setItemEdited] = useState(false);

    /*Variabile Paginare*/
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [lastPage, setLastPage] = useState(0);
    const [inputPage, setInputPage] = useState('');
    /*--*/

    /*Paginare */

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

    /*Variabile Opțiuni*/
    const [showRows, setShowRows] = useState(false);

    const toggleRows = () => {
        setShowRows(!showRows);
    };

    const [filtrusubgestiune, setFiltruSubgestiune] = useState('');

    const [OptionsData, setOptionsData] = useState({
        FiltruSubgestiune: ''
    });

    const handleOptionsDataChange = (event) => {
        event.preventDefault();

        const fieldName = event.target.getAttribute('name');
        const fieldValue = event.target.value;

        const newOptionsData = { ...OptionsData };
        newOptionsData[fieldName] = fieldValue;

        setOptionsData(newOptionsData);
    }

    const handleClearSub = (event) => {
        event.preventDefault();

        setFiltruSubgestiune('');

        setOptionsData({
            FiltruSubgestiune: ''
        });

    };

    const handleFiltruSubgestiune = (event) => {
        event.preventDefault();

        const FiltruSubgestiune = OptionsData.FiltruSubgestiune;

        if (!FiltruSubgestiune) {
            alert("Filtrul subgestiunii nu poate fi lăsat liber!");
            return;
        }

        if (FiltruSubgestiune.length > 100) {
            alert("Filtrul subgestiunii nu poate depăși 100 de caractere!");
            return;
        }

        setFiltruSubgestiune(FiltruSubgestiune);
    }
    /*--*/

    useEffect(() => {
        if (isDrawerOpen) {
            setLoading(true);
            const postdata = {
                IdGestiune: gestiune.Id,
                Nume: filtrusubgestiune,
                Pagination: { CurrentPage: currentPage, PageSize: pageSize }
            };

            const fetchData = async () => {
                try {
                    const res = await axios.post(url, postdata);
                    console.log(res);
                    const subgestiuni = res.data.Subgestiuni.map(subgestiune => ({
                        Id: subgestiune.Id,
                        id: nanoid(),
                        Nume: subgestiune.Nume
                    }));
                    console.log("Subgestiuni primite: ", subgestiuni);
                    console.log("Pagina Curentă: ", currentPage);
                    console.log("Mărimea Paginii: ", pageSize);
                    prevLastPageRef.current = lastPage;

                    setSubgestiuni(subgestiuni);
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
    }, [pageSize, currentPage, filtrusubgestiune]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filtrusubgestiune]);

    useEffect(() => {
        if (itemDeleted) {
            setLoading(true);
            const postdata = {
                IdGestiune: gestiune.Id,
                Nume: filtrusubgestiune,
                Pagination: { CurrentPage: currentPage, PageSize: pageSize }
            };

            const fetchData = async () => {
                try {
                    const res = await axios.post(url, postdata);
                    console.log(res);
                    const subgestiuni = res.data.Subgestiuni.map(subgestiune => ({
                        Id: subgestiune.Id,
                        id: nanoid(),
                        Nume: subgestiune.Nume
                    }));
                    console.log("Subgestiuni primite: ", subgestiuni);
                    console.log("Pagina Curentă: ", currentPage);
                    console.log("Mărimea Paginii: ", pageSize);
                    prevLastPageRef.current = lastPage;

                    setSubgestiuni(subgestiuni);
                    setLastPage(res.data.TotalPages);
                    if (lastPage > 0) {
                        console.log("Ultima Pagină: ", lastPage);
                    }
                    if (subgestiuni.length === 0 && currentPage > 1) {
                        setCurrentPage(currentPage - 1);
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
        if (itemAdded) {
            setLoading(true);
            const postdata = {
                IdGestiune: gestiune.Id,
                Nume: filtrusubgestiune,
                Pagination: { CurrentPage: currentPage, PageSize: pageSize }
            };

            const fetchData = async () => {
                try {
                    const res = await axios.post(url, postdata);
                    console.log(res);
                    const subgestiuni = res.data.Subgestiuni.map(subgestiune => ({
                        Id: subgestiune.Id,
                        id: nanoid(),
                        Nume: subgestiune.Nume
                    }));
                    console.log("Subgestiuni primite: ", subgestiuni);
                    console.log("Pagina Curentă: ", currentPage);
                    console.log("Mărimea Paginii: ", pageSize);
                    prevLastPageRef.current = lastPage;

                    setSubgestiuni(subgestiuni);
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
        if (itemEdited) {
            setLoading(true);
            const postdata = {
                IdGestiune: gestiune.Id,
                Nume: filtrusubgestiune,
                Pagination: { CurrentPage: currentPage, PageSize: pageSize }
            };

            const fetchData = async () => {
                try {
                    const res = await axios.post(url, postdata);
                    console.log(res);
                    const subgestiuni = res.data.Subgestiuni.map(subgestiune => ({
                        Id: subgestiune.Id,
                        id: nanoid(),
                        Nume: subgestiune.Nume
                    }));
                    console.log("Subgestiuni primite: ", subgestiuni);
                    console.log("Pagina Curentă: ", currentPage);
                    console.log("Mărimea Paginii: ", pageSize);
                    prevLastPageRef.current = lastPage;

                    setSubgestiuni(subgestiuni);
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

    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.keyCode === 27) { // check if ESC key was pressed
                handleClose();
            }
        };
        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
        //eslint-disable-next-line    
    }, [onClose]);

    useEffect(() => {
        if (isDrawerOpen) {
            document.body.classList.add("no-scroll");
            setTimeout(() => {
                document.querySelector(".drawer-container").classList.add("drawer-opening");
            }, 0);
        }
    }, [isDrawerOpen]);

    const handleClose = () => {
        document.body.classList.remove("no-scroll");
        document.querySelector(".drawer-container").classList.add("drawer-closing");
        setTimeout(() => {
            onClose();
        }, 0);
    };

    const handleClickOutside = (event) => {
        const drawerContainer = document.querySelector(".drawer-container");
        const drawerContent = document.querySelector(".drawer-content");
        if (
            drawerContainer &&
            !drawerContainer.contains(event.target) &&
            !drawerContent.contains(event.target)
        ) {
            handleClose();
        }
    };

    /*Variabile + Funcții editare/ștergere */

    const [addFormData, setAddFormData] = useState({
        Nume: ''
    });

    const [editFormData, setEditFormData] = useState({
        Nume: ''
    });

    const [editSubgestiuneId, setEditSubgestiuneId] = useState(null);

    const handleEditFormChange = (event) => {
        event.preventDefault();

        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value;

        const newFormData = { ...editFormData };
        newFormData[fieldName] = fieldValue;

        setEditFormData(newFormData);

    }

    const handleEditClick = (event, subgestiune) => {
        event.preventDefault();

        setEditSubgestiuneId(subgestiune.id);

        const formValues = {
            Nume: subgestiune.Nume
        }

        setEditFormData(formValues);
    };

    const handleCancelClick = () => {
        setEditSubgestiuneId(null);
    }

    const handleDeleteClick = (SubgestiuneDbId) => {
        setLoading(true);

        console.log("Se șterge obiectul cu ID-ul (din baza de date) :\n", SubgestiuneDbId);

        axios
            .delete(`http://dnndev.me/api/Mifix.Api/Subgestiuni/Delete?Id=${SubgestiuneDbId}`)
            .then((response) => {
                console.log(response.data);
                setItemDeleted(true);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error.response.data);
                // Verificăm codul erorii
                if (error.response && error.response.status === 409) {
                    alert(error.response.data.Message);
                } else {
                    alert('A apărut o eroare la ștergerea subgestiunii!');
                }
                setLoading(false);
            });
    };

    useEffect(() => {
        console.log("Editarea schimbată", editFormData);

    }, [editFormData])

    const handleEditFormSubmit = async (event) => {

        setLoading(true);

        event.preventDefault();

        if (!editFormData.Nume) {
            alert("Numele subgestiunii nu poate fi lăsat liber!");
            setLoading(false);
            return;
        }

        if (editFormData.Nume.length > 100) {
            alert("Numele subgestiunii nu poate depăși 100 de caractere!");
            setLoading(false);
            return;
        }

        console.log("Subgestiunea de trimis este:", editFormData);

        const subgestiuneToEdit = subgestiuni.find((subgestiune) => subgestiune.id === editSubgestiuneId);
        const id = subgestiuneToEdit.Id;

        console.log("Id-ul comun este:", id);

        const editedSubgestiune = {
            Id: id,
            Nume: editFormData.Nume
        };

        try {
            await axios.put(`http://dnndev.me/api/Mifix.Api/Subgestiuni/Edit`, editedSubgestiune);
            setEditSubgestiuneId(null);
            setItemEdited(true);
            setLoading(false);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 409) {
                alert(error.response.data.Message);
            } else {
                alert('A apărut o eroare la editarea subgestiunii!');
            }
            setLoading(false);
        }
    };

    const handleAddFormChange = (event) => {
        event.preventDefault();

        const fieldName = event.target.getAttribute('name');
        const fieldValue = event.target.value;

        const newFormData = { ...addFormData };
        newFormData[fieldName] = fieldValue;

        setAddFormData(newFormData);
    }

    const handleAddFormSubmit = (event) => {

        setLoading(true);

        event.preventDefault();

        console.log("Obiectul de verificat:", addFormData);

        if (!addFormData.Nume) {
            alert("Numele subgestiunii nu poate fi lăsat liber!");
            setLoading(false);
            return;
        }

        if (addFormData.Nume.length > 100) {
            alert("Numele subgestiunii nu poate depăși 100 de caractere!");
            setLoading(false);
            return;
        }

        const newPostObiect = {
            IdGestiune: gestiune.Id,
            Nume: addFormData.Nume
        };

        console.log("Obiectul trimis:\n", newPostObiect);

        axios
            .post('http://dnndev.me/api/Mifix.Api/Subgestiuni/New', newPostObiect)
            .then((response) => {
                console.log(response.data);
                setItemAdded(true);

                // Resetăm fieldurile
                setAddFormData({
                    Nume: ''
                });
                document.getElementsByName('Nume')[0].value = '';

                setLoading(false);

            })
            .catch((error) => {
                console.error(error);
                if (error.response && error.response.status === 409) {
                    alert(error.response.data.Message);
                } else {
                    alert('A apărut o eroare la adăugarea subgestiunii!');
                }
                setLoading(false);
            });
    };

    /* */

    return (
        <div className={`drawer-overlay ${isDrawerOpen ? 'drawer-open' : ''}`} onClick={handleClickOutside}>
            <div className={`drawer-container ${isDrawerOpen ? 'drawer-open' : ''}`}>
                {<div style={{ display: 'block' }}><LoadingGES loading={loading} /></div>}
                <div className="drawer-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h5 style={{ margin: 0, padding: '5px', wordWrap: 'break-word', textAlign: 'center', maxWidth: '100%' }}>Subgestiuni - Gestiunea: {gestiune.Nume}</h5>
                    <button type='button' onClick={handleClose}>X</button>
                </div>

                <div className="drawer-content" style={{ textAlign: 'center' }}>
                    <form onSubmit={handleEditFormSubmit}>
                        <table className='drawer-table'>
                            <thead>
                                <tr>
                                    <th style={{ fontSize: "30px", backgroundColor: "lightgrey", position: "static" }} colSpan="3">
                                        <FontAwesomeIcon icon={faGear} style={{ cursor: "pointer", marginRight: "5px", fontSize: "32px" }} onClick={toggleRows} title='Vedeți mai multe opțiuni!' />
                                        Tabel - Evidență Subgestiuni
                                    </th>
                                </tr>
                                <tr style={{ display: showRows ? 'table-row' : 'none' }}>
                                    <th style={{ backgroundColor: "lightgrey" }} colSpan="2">Obiect-Filtru</th>
                                    <th style={{ backgroundColor: "lightgrey" }} colSpan="1">Opțiuni</th>
                                </tr>

                                <tr style={{ display: showRows ? 'table-row' : 'none' }}>

                                    <th style={{ backgroundColor: "lightgrey" }} colSpan="2">
                                        <div className='input-container'>
                                            <input
                                                type="text"
                                                name="FiltruSubgestiune"
                                                placeholder="Filtru-Nume Subgestiune"
                                                onChange={handleOptionsDataChange}
                                                value={OptionsData.FiltruSubgestiune}
                                            />
                                        </div>
                                    </th>


                                    <th style={{ backgroundColor: "lightgrey" }} colSpan="1">
                                        <button type='button' onClick={handleFiltruSubgestiune} style={{ marginBottom: '10px' }}>
                                            Adăugați Filtrul
                                        </button>
                                        <button type='button' onClick={handleClearSub}>
                                            Ștergeți Filtrul
                                        </button>
                                    </th>

                                </tr>
                                <tr>
                                    <th style={{ backgroundColor: "lightgrey" }}>Număr Subgestie</th>
                                    <th style={{ backgroundColor: "lightgrey" }}>Nume Subgestie</th>
                                    <th style={{ backgroundColor: "lightgrey" }}>Opțiuni</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subgestiuni?.length > 0 ? (
                                    subgestiuni.map((subgestiune, index) => {
                                        const actualPosition = (currentPage - 1) * pageSize + index;
                                        return (
                                            <Fragment key={subgestiune.Id}>
                                                {editSubgestiuneId === subgestiune.id ? (
                                                    <EditableRowDWGES
                                                        editFormData={editFormData}
                                                        handleEditFormChange={handleEditFormChange}
                                                        handleCancelClick={handleCancelClick}
                                                        index={actualPosition}
                                                    />
                                                ) : (
                                                    <ReadOnlyRowDWGES
                                                        subgestiune={subgestiune}
                                                        index={actualPosition}
                                                        handleEditClick={handleEditClick}
                                                        handleDeleteClick={handleDeleteClick}
                                                    />
                                                )}
                                            </Fragment>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={3} style={{ textAlign: 'center' }}>
                                            Această gestiune nu are subgestiuni atribuite!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </form>

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

                <br />
                <br />

                <h3 style={{ marginLeft: '10px', marginRight: '10px' }}>Adăugare Subgestiuni</h3>
                <br />
                <form onSubmit={handleAddFormSubmit} style={{ marginLeft: '10px', marginRight: '10px' }}>
                    <label>
                        Subgestiune:
                    </label>
                    <br />
                    <input
                        type="text"
                        name="Nume"
                        placeholder="Subgestiunea este ..."
                        onChange={handleAddFormChange}
                    />

                    <br />

                    <button type="submit" className="button" style={{ marginTop: '10px' }}>Adaugă</button>

                    <br />
                    <br />

                </form>

            </div>
        </div>
    );
}

export default DrawerGES