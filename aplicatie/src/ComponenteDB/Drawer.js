import React, { useEffect, useState, useRef } from 'react';
import './Drawer.css';
import Loading from './Loading';
import { axios } from '../axiosInstance';
import { nanoid } from 'nanoid';
import EditableRowDW from './Drawer/EditableRowDW';
import ReadOnlyRowDW from './Drawer/ReadOnlyRowDW';
import { Fragment } from 'react';


const Drawer = ({ onClose, isDrawerOpen, obiecte }) => {

    const url = 'http://dnndev.me/api/Mifix.Api/Furnizori/GetFiltered';
    const [loading, setLoading] = useState(false);
    const [furnizori, setFurnizori] = useState([]);
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

    useEffect(() => {
        if (isDrawerOpen) {
            setLoading(true);
            const postdata = {
                Pagination: { CurrentPage: currentPage, PageSize: pageSize }
            };

            const fetchData = async () => {
                try {
                    const res = await axios.post(url, postdata);
                    console.log(res);
                    const furnizori = res.data.Furnizori.map(furnizor => ({
                        Id: furnizor.Id,
                        id: nanoid(),
                        Nume: furnizor.Nume
                    }));
                    console.log("Furnizori primiți: ", furnizori);
                    console.log("Pagina Curentă: ", currentPage);
                    console.log("Mărimea Paginii: ", pageSize);
                    prevLastPageRef.current = lastPage;

                    setFurnizori(furnizori);
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
    }, [pageSize, currentPage]);

    useEffect(() => {
        if (itemDeleted) {
            setLoading(true);
            const postdata = {
                Pagination: { CurrentPage: currentPage, PageSize: pageSize }
            };

            const fetchData = async () => {
                try {
                    const res = await axios.post(url, postdata);
                    console.log(res);
                    const furnizori = res.data.Furnizori.map(furnizor => ({
                        Id: furnizor.Id,
                        id: nanoid(),
                        Nume: furnizor.Nume
                    }));
                    console.log("Furnizori primiți: ", furnizori);
                    console.log("Pagina Curentă: ", currentPage);
                    console.log("Mărimea Paginii: ", pageSize);
                    prevLastPageRef.current = lastPage;

                    setFurnizori(furnizori);
                    setLastPage(res.data.TotalPages);
                    if (lastPage > 0) {
                        console.log("Ultima Pagină: ", lastPage);
                    }
                    if (furnizori.length === 0 && currentPage > 1) {
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
                Pagination: { CurrentPage: currentPage, PageSize: pageSize }
            };

            const fetchData = async () => {
                try {
                    const res = await axios.post(url, postdata);
                    console.log(res);
                    const furnizori = res.data.Furnizori.map(furnizor => ({
                        Id: furnizor.Id,
                        id: nanoid(),
                        Nume: furnizor.Nume
                    }));
                    console.log("Furnizori primiți: ", furnizori);
                    console.log("Pagina Curentă: ", currentPage);
                    console.log("Mărimea Paginii: ", pageSize);
                    prevLastPageRef.current = lastPage;

                    setFurnizori(furnizori);
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
                Pagination: { CurrentPage: currentPage, PageSize: pageSize }
            };

            const fetchData = async () => {
                try {
                    const res = await axios.post(url, postdata);
                    console.log(res);
                    const furnizori = res.data.Furnizori.map(furnizor => ({
                        Id: furnizor.Id,
                        id: nanoid(),
                        Nume: furnizor.Nume
                    }));
                    console.log("Furnizori primiți: ", furnizori);
                    console.log("Pagina Curentă: ", currentPage);
                    console.log("Mărimea Paginii: ", pageSize);
                    prevLastPageRef.current = lastPage;

                    setFurnizori(furnizori);
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
                document.querySelector(".drawer-containeroi").classList.add("drawer-opening");
            }, 0);
        }
    }, [isDrawerOpen]);

    const handleClose = () => {
        document.body.classList.remove("no-scroll");
        document.querySelector(".drawer-containeroi").classList.add("drawer-closing");
        setTimeout(() => {
            onClose();
        }, 0);
    };

    const handleClickOutside = (event) => {
        const drawerContainer = document.querySelector(".drawer-containeroi");
        const drawerContent = document.querySelector(".drawer-contentoi");

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

    const [editFurnizorId, setEditFurnizorId] = useState(null);

    const handleEditFormChange = (event) => {
        event.preventDefault();

        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value;

        const newFormData = { ...editFormData };
        newFormData[fieldName] = fieldValue;

        setEditFormData(newFormData);

    }

    const handleEditClick = (event, furnizor) => {
        event.preventDefault();

        setEditFurnizorId(furnizor.id);

        const formValues = {
            Nume: furnizor.Nume
        }

        setEditFormData(formValues);
    };

    const handleCancelClick = () => {
        setEditFurnizorId(null);
    }

    const handleDeleteClick = (FurnizorDbId) => {
        setLoading(true);

        console.log("Se șterge obiectul cu ID-ul (din baza de date) :\n", FurnizorDbId);

        axios
            .delete(`http://dnndev.me/api/Mifix.Api/Furnizori/Delete?Id=${FurnizorDbId}`)
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
                    alert('A apărut o eroare la ștergerea furnizorului!');
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
            alert("Numele furnizorului nu poate fi lăsat liber!");
            setLoading(false);
            return;
        }

        if (editFormData.Nume.length > 200) {
            alert("Numele furnizorului nu poate depăși 200 de caractere!");
            setLoading(false);
            return;
        }

        console.log("Funizorul de trimis este:", editFormData);

        const editedFurnizor = {
            Nume: editFormData.Nume
        };

        const furnizorToEdit = furnizori.find((furnizor) => furnizor.id === editFurnizorId);
        const id = furnizorToEdit.Id;

        console.log("Id-ul comun este:", id);

        try {
            await axios.put(`http://dnndev.me/api/Mifix.Api/Furnizori/Edit?Id=${id}`, editedFurnizor);
            setEditFurnizorId(null);
            setItemEdited(true);
            setLoading(false);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 409) {
                alert(error.response.data.Message);
            } else {
                alert('A apărut o eroare la editarea furnizorului!');
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
            alert("Numele furnizorului nu poate fi lăsat liber!");
            setLoading(false);
            return;
        }

        if (addFormData.Nume.length > 200) {
            alert("Numele furnizorului nu poate depăși 200 de caractere!");
            setLoading(false);
            return;
        }

        const newPostObiect = {
            Nume: addFormData.Nume
        };

        console.log("Obiectul trimis:\n", newPostObiect);

        axios
            .post('http://dnndev.me/api/Mifix.Api/Furnizori/Insert', newPostObiect)
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
                    alert("Operația de adăugare a eșuat!");
                }
                setLoading(false);
            });
    };

    /* */

    return (
        <div className={`drawer-overlayoi ${isDrawerOpen ? 'drawer-open' : ''}`} onClick={handleClickOutside}>
            <div className={`drawer-containeroi ${isDrawerOpen ? 'drawer-open' : ''}`}>
                {<div style={{ display: 'block' }}><Loading loading={loading} /></div>}
                <div className="drawer-headeroi" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h2 style={{ flex: 1, textAlign: 'center' }}>Furnizor - Sugestii Autocompletare</h2>
                    <button type='button' onClick={handleClose}>X</button>
                </div>

                <div className="drawer-contentoi" style={{ textAlign: 'center' }}>
                    <form onSubmit={handleEditFormSubmit}>
                        <table className='drawer-table'>
                            <thead>
                                <tr>
                                    <th style={{ backgroundColor: "lightgrey" }}>Număr Sugestie</th>
                                    <th style={{ backgroundColor: "lightgrey" }}>Nume Sugestie</th>
                                    <th style={{ backgroundColor: "lightgrey" }}>Opțiuni</th>
                                </tr>
                            </thead>
                            <tbody>
                                {furnizori?.length > 0 ? (
                                    furnizori.map((furnizor, index) => {
                                        const actualPosition = (currentPage - 1) * pageSize + index;
                                        return (
                                            <Fragment key={furnizor.Id}>
                                                {editFurnizorId === furnizor.id ? (
                                                    <EditableRowDW
                                                        editFormData={editFormData}
                                                        handleEditFormChange={handleEditFormChange}
                                                        handleCancelClick={handleCancelClick}
                                                        index={actualPosition}
                                                    />
                                                ) : (
                                                    <ReadOnlyRowDW
                                                        furnizor={furnizor}
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
                                            Nu există furnizori salvați în baza de date!
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

                <h3 style={{ marginLeft: '10px', marginRight: '10px' }}>Adăugare Furnizori</h3>
                <br />
                <form onSubmit={handleAddFormSubmit} style={{ marginLeft: '10px', marginRight: '10px' }}>
                    <label>
                        Furnizor:
                    </label>
                    <br />
                    <input
                        type="text"
                        name="Nume"
                        placeholder="Furnizorul este ..."
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
};

export default Drawer;
