import React, { useState, useEffect } from 'react';
import './ObjectPicker.css';
import ReactDOM from "react-dom";
import { axios } from '../axiosInstance';
import { nanoid } from 'nanoid';
import LoadingBM from './LoadingBM';
import SNPickerBM from './SNPickerBM';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faGear } from '@fortawesome/free-solid-svg-icons';

const IOPicker = ({ isOpen, toggle, onSelect, formSubmitted, setFormSubmitted,
  selectedObjects, setSelectedObjects, savedObjects, setSavedObjects, checkedBoxes, setCheckedBoxes
}) => {

  const modalRoot = document.getElementById("modal-root");
  const [loading, setLoading] = useState(false);

  /*Variabile Opțiuni*/
  const [showRows, setShowRows] = useState(false);

  const toggleRows = () => {
    setShowRows(!showRows);
  };

  const filtrufactura = "";
  const filtrufurnzior = "";
  const [filtruobiect, setFiltruobiect] = useState("");
  /*--*/

  /*Variabile Paginare*/
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [lastPage, setLastPage] = useState(0);
  const [inputPage, setInputPage] = useState('');


  const url = 'http://dnndev.me/api/Mifix.Api/ObiecteInventar/GetFilteredPentruBonuri';
  const [obiecte, setObiecte] = useState([]);

  /*--*/

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setLoading(true);

    console.log("Detalii Generale:\n");
    console.log("Pagina Curentă: ", currentPage);
    console.log("Mărimea Paginii: ", pageSize);
    if (lastPage > 0) {
      console.log("Ultima Pagină: ", lastPage);
    }

    const postdata = {
      Pagination: { CurrentPage: currentPage, PageSize: pageSize },
      FacturaSearch: filtrufactura || "",
      FurnizorSearch: filtrufurnzior || "",
      DenumireSearch: filtruobiect || ""
    };

    axios.post(url, postdata)
      .then(res => {
        console.log("Datele inițiale sunt:\n", res);

        const filteredData = res.data.TipuriObiecteInventar
          .map(data => {
            try {
              return {
                Id: data.Id,
                id: nanoid(),
                NumarDeOrdine: data.NumarDeOrdine,
                NrFactura: data.NrFactura,
                Furnizor: data.Furnizor,
                DenumireObiect: data.DenumireObiect,
                ContineSerii: data.ContineSerii,
                NrBucati: data.ObiecteInventarNedistribuite.length,
                SeriiBucati: data.ObiecteInventarNedistribuite

              };
            } catch (err) {
              console.log(err);
              return {
                Id: data.Id,
                id: nanoid(),
                NumarDeOrdine: data.NumarDeOrdine,
                NrFactura: data.NrFactura,
                Furnizor: data.Furnizor,
                DenumireObiect: data.DenumireObiect,
                ContineSerii: data.ContineSerii,
                NrBucati: 0,
                SeriiBucati: data.ObiecteInventarNedistribuite
              };
            }
          })

        setObiecte(filteredData);
        setLastPage(res.data.TotalPages);
        setLoading(false);
        console.log("Datele finale sunt:\n", filteredData);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
    // eslint-disable-next-line
  }, [pageSize, currentPage, filtruobiect]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filtruobiect]);

  /*Opțiuni*/

  const [OptionsData, setOptionsData] = useState({
    FiltruObiect: ''
  });

  const handleOptionsDataChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute('name');
    const fieldValue = event.target.value;

    const newOptionsData = { ...OptionsData };
    newOptionsData[fieldName] = fieldValue;

    setOptionsData(newOptionsData);
  }

  const handleClearObi = (event) => {
    event.preventDefault();

    setFiltruobiect('');

    setOptionsData({
      FiltruObiect: ''
    });

  };

  /*Filtre*/

  const handleFiltruObiect = (event) => {
    event.preventDefault();

    const FiltruObiect = OptionsData.FiltruObiect;

    if (!FiltruObiect) {
      alert("Filtrul obiectului nu poate fi lăsat liber!");
      return;
    }

    if (FiltruObiect.length > 100) {
      alert("Filtrul obiectului nu poate depăși 100 de caractere!");
      return;
    }

    setFiltruobiect(FiltruObiect);
  }

  /*Sfârșit Filtre*/
  /*Sfârșit Opțiuni*/

  /*SNPicker*/

  const [showSN, setShowSN] = useState(false);
  const [selectedSN, setSelectedSN] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const toggleSN = () => {

    setShowSN(!showSN);

  }

  const handleObjectReset = (currentObject) => {
    setSelectedObjects((prevSelectedObjects) => {
      // Find the index of the current object in the array
      const index = prevSelectedObjects.findIndex(
        (obj) => obj.IdTipObiectInventar === currentObject.IdTipObiectInventar
      );

      // Create a copy of the selected objects array with the modified object
      const updatedSelectedObjects = [...prevSelectedObjects];
      updatedSelectedObjects[index] = {
        ...updatedSelectedObjects[index],
        selectedSN: [],
      };

      // Return the updated selected objects array
      return updatedSelectedObjects;
    });
  };

  /*Sfârșit SNPicker */



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

  /*Selectare Obiecte*/

  useEffect(() => {
    if (formSubmitted) {
      setSelectedObjects([]);
    }
    setFormSubmitted(false);
    // eslint-disable-next-line
  }, [formSubmitted]);

  useEffect(() => {
    console.log("Selected Objects:", selectedObjects);
    // eslint-disable-next-line
  }, [selectedObjects]);

  const handleObjectSelect = (obiect, quantity, selectedSN, event) => {

    if (selectedSN) console.log("Array-ul primit:", selectedSN);

    //Convertirea cantității într-un număr și ștergerea de 0-uri care sunt în față
    quantity = parseInt(quantity, 10).toString();

    //Dacă cantitatea nu e un număr sau e goală, se convertește la 0
    if (isNaN(quantity) || quantity === '') {
      quantity = '0';
    }

    // Limităm cantitatea la un minim de 0
    quantity = Math.max(parseInt(quantity, 10), 0);

    // Limităm cantitatea la un maxim de obiect.NrBucati
    quantity = Math.min(quantity, obiect.NrBucati);

    // Preventim introducerea de mai multe 0-uri consecutive în input
    if (event.target.value.startsWith('00')) {
      event.target.value = '0';
    }

    // Actualizăm valoarea câmpului input
    event.target.value = quantity.toString();

    //Verificăm dacă cantitatea este mai mare decât 0 înainte de a adăuga/șterge obiecte la/din selectedObjects
    if (quantity > 0) {
      const index = selectedObjects.findIndex((o) => o.IdTipObiectInventar === obiect.Id);

      //Dacă indexul nu este -1, înseamnă că obiectul este deja în array
      // Dacă indexul este -1, înseamnă că obiectul nu este în array
      if (index !== -1) {
        const newSelectedObjects = [...selectedObjects];
        newSelectedObjects[index].NrObiecteInventar = quantity;
        newSelectedObjects[index].initialQuantity = quantity;
        if (!newSelectedObjects[index].ContineSerii) {
          const ids = obiect.SeriiBucati.slice(0, newSelectedObjects[index].NrObiecteInventar).map(o => o.Id);
          newSelectedObjects[index].selectedSN = ids;
        }
        else
          if (newSelectedObjects[index].ContineSerii) {
            newSelectedObjects[index].selectedSN = selectedSN || newSelectedObjects[index].selectedSN; // Dacă selectedSN e null, păstrăm valoarea anterioară
          }
        setSelectedObjects(newSelectedObjects);
      } else {
        const newObject = {
          IdTipObiectInventar: obiect.Id,
          NumarDeOrdine: obiect.NumarDeOrdine,
          NrFactura: obiect.NrFactura,
          Furnizor: obiect.Furnizor,
          DenumireObiect: obiect.DenumireObiect,
          ContineSerii: obiect.ContineSerii,
          NrObiecteInventar: quantity,
          initialQuantity: quantity,
          selectedSN: selectedSN || [] // Dacă selectedSN este null, îl setăm la un array gol
        };
        console.log("NEW OBJECT: ", newObject);
        console.log('newObject.selectedSN:', newObject.selectedSN);
        console.log('newObject.ContineSerii:', newObject.ContineSerii);
        if (!newObject.ContineSerii) {
          const ids = obiect.SeriiBucati.slice(0, newObject.NrObiecteInventar).map(o => o.Id);
          console.log("IDs: ", ids);
          newObject.selectedSN = ids;
        }
        setSelectedObjects([...selectedObjects, newObject]);
      }
    } else {
      //Dacă cantitatea e 0, ștergem obiectul din selectedObjects
      const index = selectedObjects.findIndex((o) => o.IdTipObiectInventar === obiect.Id);

      if (index !== -1) {
        const newSelectedObjects = [...selectedObjects];
        newSelectedObjects.splice(index, 1);
        setSelectedObjects(newSelectedObjects);
      }
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.classList.contains("modal-overlay-io")) {
        // setSelectedObjects(savedObjects.map(obj => ({
        //   ...obj,
        //   NrObiecteInventar: obj.initialQuantity // reset the quantity value to the initial value
        // })));
        toggle();
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
    // eslint-disable-next-line
  }, [isOpen, toggle]);

  const checkSelectedSN = (selectedObjects) => {
    for (const obj of selectedObjects) {
      if (obj.NrObiecteInventar !== obj.selectedSN.length) {
        return false;
      }
    }
    return true;
  }

  const handleSave = () => {
    if (checkSelectedSN(selectedObjects)) {
      const newSelectedObjects = selectedObjects.map(obj => ({
        ...obj,
        NrObiecteInventar: obj.initialQuantity // reset the quantity value to the initial value
      }));

      setSavedObjects([...newSelectedObjects]);
      onSelect(newSelectedObjects);
      toggle();
    } else {
      alert("Nu ați selectat seriile corespunzător pentru obiectele pe care le-ați adăugat!");
    }
  };


  const handleCancel = () => {
    setSelectedObjects(savedObjects.map(obj => ({
      ...obj,
      NrObiecteInventar: obj.initialQuantity // reset the quantity value to the initial value
    })));
    toggle();
  };

  /*Sfârșit Selectare Obiecte*/

  return ReactDOM.createPortal(
    <div className={`modal-overlay-io ${isOpen ? "show" : "hide"}`}>
      <div className="modal-content-io">
        {<div style={{ display: 'block' }}><LoadingBM loading={loading} /></div>}
        <div className="outer-wrapper" style={{ width: '100%', height: '80%' }}>
          <div className="table-wrapper" style={{ width: '100%' }}>
            <table>
              <thead>

                <tr>
                  <th style={{ fontSize: "30px", backgroundColor: "lightgrey", position: "static" }} colSpan="6">
                    <FontAwesomeIcon icon={faGear} style={{ cursor: "pointer", marginRight: "5px", fontSize: "32px" }} onClick={toggleRows} title='Vedeți mai multe opțiuni!' />
                    Tabel - Obiecte Disponibile
                  </th>
                </tr>
                <tr style={{ display: showRows ? 'table-row' : 'none' }}>
                  <th style={{ backgroundColor: "lightgrey" }} colSpan="3">Filtru- Denumire Obiect</th>
                  <th style={{ backgroundColor: "lightgrey" }} colSpan="3">Opțiuni - Filtru</th>
                </tr>
                <tr style={{ display: showRows ? 'table-row' : 'none' }}>
                  <th style={{ backgroundColor: "lightgrey" }} colSpan="3">
                    <div className='input-container'>
                      <input
                        type="text"
                        name="FiltruObiect"
                        placeholder="Filtru- Denumire Obiect"
                        onChange={handleOptionsDataChange}
                        value={OptionsData.FiltruObiect}
                      />
                    </div>
                  </th>
                  <th style={{ backgroundColor: "lightgrey" }} colSpan="3">
                    <button type='button' onClick={handleFiltruObiect} style={{ marginRight: '10px' }}>
                      Adaugă
                    </button>
                    <button type='button' onClick={handleClearObi}>
                      Șterge
                    </button>
                  </th>
                </tr>
                <tr>
                  <th style={{ backgroundColor: "lightgrey" }}>N.O. Obiect</th>
                  <th style={{ backgroundColor: "lightgrey" }}>Denumire Obiect</th>
                  <th style={{ backgroundColor: "lightgrey" }}>Bucăți Disponibile</th>
                  <th style={{ backgroundColor: "lightgrey" }}>Alegere Cantitate</th>
                  <th style={{ backgroundColor: "lightgrey" }}>Alegere Seriile</th>
                  <th style={{ backgroundColor: "lightgrey" }}>Serii Alese</th>
                </tr>
              </thead>
              <tbody>
                {obiecte.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ fontStyle: "italic" }}>Nu există obiecte adăugate în baza de date cu o cantitatate disponibilă mai mare decât 0! </td>
                  </tr>
                ) : (
                  obiecte?.map(obiect => (
                    <tr key={obiect.Id}>
                      <td>{obiect.NumarDeOrdine}</td>
                      <td>{obiect.DenumireObiect}</td>
                      <td>{obiect.NrBucati}</td>
                      <td style={{ whiteSpace: 'normal' }}>
                        <div>
                          <button
                            type='button'
                            onClick={(event) => {
                              const currentQuantity =
                                selectedObjects.find((o) => o.IdTipObiectInventar === obiect.Id)?.NrObiecteInventar || 0;
                              const newQuantity = currentQuantity > 0 ? currentQuantity - 1 : 0;
                              handleObjectSelect(obiect, newQuantity, [], event);
                            }}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={selectedObjects.find((o) => o.IdTipObiectInventar === obiect.Id)?.NrObiecteInventar || 0}
                            onChange={(event) => {
                              const newQuantity = parseInt(event.target.value) || 0;
                              handleObjectSelect(obiect, newQuantity, [], event);
                            }}
                          />
                          <button
                            type='button'
                            onClick={(event) => {
                              const currentQuantity =
                                selectedObjects.find((o) => o.IdTipObiectInventar === obiect.Id)?.NrObiecteInventar || 0;
                              const newQuantity =
                                currentQuantity < obiect.NrBucati ? currentQuantity + 1 : obiect.NrBucati;
                              handleObjectSelect(obiect, newQuantity, [], event);
                            }}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>
                        {selectedObjects.find((o) => o.IdTipObiectInventar === obiect.Id)?.NrObiecteInventar > 0 ?
                          (obiect.ContineSerii ?
                            <button type='button' onClick={() => {
                              setSelectedRowId(obiect.Id);
                              toggleSN();
                            }}>Selectează Seriile</button>
                            :
                            <span>Obiectul nu are atribuite serii!</span>
                          )
                          :
                          '-'
                        }
                      </td>
                      <td>
                        {selectedObjects.some((o) => o.IdTipObiectInventar === obiect.Id) ? (
                          selectedObjects.find((o) => o.IdTipObiectInventar === obiect.Id)?.ContineSerii === false ? (
                            <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green' }} />
                          ) : (
                            selectedObjects.find((o) => o.IdTipObiectInventar === obiect.Id)?.NrObiecteInventar === selectedObjects.find((o) => o.IdTipObiectInventar === obiect.Id)?.selectedSN.length ? (
                              <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green' }} />
                            ) : (
                              <FontAwesomeIcon icon={faTimesCircle} style={{ color: 'red' }} />
                            )
                          )
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))
                )}
                {showSN && (
                  <SNPickerBM
                    quantity={selectedObjects.find((o) => o.IdTipObiectInventar === selectedRowId)?.NrObiecteInventar || 0}
                    obiect={obiecte.find((o) => o.Id === selectedRowId)}
                    handleObjectSelect={handleObjectSelect}
                    selectedSN={selectedSN}
                    setSelectedSN={setSelectedSN}
                    showSN={showSN}
                    toggleSN={toggleSN}
                    selectedObject={
                      selectedObjects.find((o) => o.IdTipObiectInventar === selectedRowId) || {}
                    }
                    handleObjectReset={handleObjectReset}
                  />
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
        <div className="button-container" style={{ display: 'flex', justifyContent: 'center' }}>
          <button type='button' onClick={handleSave} style={{ marginRight: '10px' }}>Salvați</button>
          <button type='button' onClick={handleCancel}>Anulați</button>
        </div>
      </div>
    </div>,
    modalRoot
  );
}

export default IOPicker;