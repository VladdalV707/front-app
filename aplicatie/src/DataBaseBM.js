import { React, useState, useEffect, Fragment, useRef } from 'react';
import './DataBaseBM.css';
import { axios } from './axiosInstance';
import { nanoid } from "nanoid";
import ReadOnlyRowBM from './ComponenteDBBM/ReadOnlyRowBM';
import CustomDatePicker from './ComponenteDBBM/DatePicker';
import GestiuneForm from './ComponenteDBBM/GestiuneForm';
import IOPicker from './ComponenteDBBM/IOPicker';
import LoadingBM from './ComponenteDBBM/LoadingBM';
import CalendarPicker from './ComponenteDBBM/CalendarPicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faTimes, faGear } from '@fortawesome/free-solid-svg-icons';


const DataBaseBM = ({ user, numereal }) => {

  const [loading, setLoading] = useState(false);
  const [itemDeleted, setItemDeleted] = useState(false);
  const [itemAdded, setItemAdded] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmitted2, setFormSubmitted2] = useState(false);
  const [dateNotFormatted, setDateNotFormatted] = useState(true);
  const [selectedObjects, setSelectedObjects] = useState([]);
  const [savedObjects, setSavedObjects] = useState([]);

  /*Variabile Opțiuni*/
  const [showRows, setShowRows] = useState(false);

  const toggleRows = () => {
    setShowRows(!showRows);
  };

  const [filtruGestiune, setFiltruGestiune] = useState("");
  const [filtruNrBon, setFiltruNrBon] = useState("");
  const [filtruEliberator, setFiltruEliberator] = useState("");
  const [filtruPrimitor, setFiltruPrimitor] = useState("");

  const [OptionsData, setOptionsData] = useState({
    FiltruNrBon: '',
    FiltruGestiune: '',
    FiltruEliberator: '',
    FiltruPrimitor: ''
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

  const handleClearInputs = (event) => {
    event.preventDefault();

    setFiltruNrBon('');
    setFiltruGestiune('');
    setFiltruEliberator('');
    setFiltruPrimitor('');

    setOptionsData({
      FiltruNrBon: '',
      FiltruGestiune: '',
      FiltruEliberator: '',
      FiltruPrimitor: ''
    });

  };

  /*Filtre*/

  const handleClearFiltruNrBon = (event) => {
    event.preventDefault();

    setFiltruNrBon('');

    setOptionsData({
      FiltruNrBon: ''
    });

  };

  const handleClearFiltruGestiune = (event) => {
    event.preventDefault();

    setFiltruGestiune('');

    setOptionsData({
      FiltruGestiune: ''
    });

  };

  const handleClearFiltruEliberator = (event) => {
    event.preventDefault();

    setFiltruEliberator('');

    setOptionsData({
      FiltruEliberator: ''
    });

  };

  const handleClearFiltruPrimitor = (event) => {
    event.preventDefault();

    setFiltruPrimitor('');

    setOptionsData({
      FiltruPrimitor: ''
    });

  };

  const handleFiltruNrBon = (event) => {

    event.preventDefault();

    const FiltruNrBon = OptionsData.FiltruNrBon;

    if (!FiltruNrBon) {
      alert("Filtrul numărului de bon nu poate fi lăsat liber!");
      return;
    }

    if (isNaN(FiltruNrBon)) {
      alert("Filtrul numărului de bon poate conține doar caractere numerice!");
      return;
    }

    setFiltruNrBon(FiltruNrBon);
  }

  const handleFiltruGestiune = (event) => {
    event.preventDefault();

    const FiltruGestiune = OptionsData.FiltruGestiune;

    if (!FiltruGestiune) {
      alert("Filtrul gestiunii poate fi lăsată liber!");
      return;
    }

    if (FiltruGestiune.length > 200) {
      alert("Filtrul gestiunii nu poate depăși 200 de caractere!");
      return;
    }

    setFiltruGestiune(FiltruGestiune);
  }

  const handleFiltruEliberator = (event) => {
    event.preventDefault();

    const FiltruEliberator = OptionsData.FiltruEliberator;

    if (!FiltruEliberator) {
      alert("Filtrul eliberatorului nu poate fi lăsat liber!");
      return;
    }

    if (FiltruEliberator.length > 100) {
      alert("Filtrul eliberatorului nu poate depăși 100 de caractere!");
      return;
    }

    setFiltruEliberator(FiltruEliberator);
  }

  const handleFiltruPrimitor = (event) => {
    event.preventDefault();

    const FiltruPrimitor = OptionsData.FiltruPrimitor;

    if (!FiltruPrimitor) {
      alert("Filtrul primitorului nu poate fi lăsat liber!");
      return;
    }

    if (FiltruPrimitor.length > 100) {
      alert("Filtrul primitorului nu poate depăși 100 de caractere!");
      return;
    }

    setFiltruPrimitor(FiltruPrimitor);
  }
  /*Sfârșit Filtre*/
  /*Sfârșit Funcții Opțiuni*/

  /*Variabile Paginare*/
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [lastPage, setLastPage] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
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

  const url = "http://dnndev.me/api/Mifix.Api/BonuriDeMiscare/GetFiltered";
  const [bonuri, setBonuri] = useState([]);
  const prevLastPageRef = useRef();
  const [startYear, setStartYear] = useState(1901);
  const [startMonth, setStartMonth] = useState(1);
  const [startDay, setStartDay] = useState(1);
  const [endYear, setEndYear] = useState(9999);
  const [endMonth, setEndMonth] = useState(12);
  const [endDay, setEndDay] = useState(31);

  const [addFormData, setAddFormData] = useState({
    NumarBon: "",
    Gestiune: { Id: "", Nume: "" },
    Data: "",
    Eliberator: numereal,
    Primitor: "",
    ObiecteDeInventar: [],
    NrObiecteDeInventar: 0,
  });

  const [NextNB, setNextNB] = useState('');

  useEffect(() => {
    let cancelTokenSource = axios.CancelToken.source();
    setLoading(true);
    axios.get("http://dnndev.me/api/Mifix.Api/BonuriDeMiscare/Next")
      .then(resp => {
        console.log("Următorul NB este:", resp.data);
        setNextNB(resp.data);
      })
      .catch(error => {
        console.log(error);
      });
    const fetchData = async () => {
      try {
        const postdata = {
          DateInterval: {
            Start: {
              Year: startYear,
              Month: startMonth,
              Day: startDay,
            },
            End: {
              Year: endYear,
              Month: endMonth,
              Day: endDay,
            },
          },
          Pagination: { CurrentPage: currentPage, PageSize: pageSize },
          Gestiune: filtruGestiune || "",
          NrBon: filtruNrBon || null,
          IntocmitDe: filtruEliberator || "",
          PrimitDe: filtruPrimitor || "",
        };
        const response = await axios.post(url, postdata, { cancelToken: cancelTokenSource.token });
        const dataWithNewAttributes = response.data.BonuriDeMiscare.map((bon) => ({
          Id: bon.Id,
          id: nanoid(),
          Gestiune: bon.Gestiune,
          NrBon: bon.NrBon,
          Data: bon.Data,
          IntocmitDe: bon.IntocmitDe,
          PrimitDe: bon.PrimitDe,
          NrObiecteInventar: bon.ObiecteInventar.length,
          ObiecteInventar: bon.ObiecteInventar
        }));
        console.log("Bonurile primite sunt:\n", dataWithNewAttributes);
        console.log("Pagina Curentă: ", currentPage);
        console.log("Mărimea Paginii: ", pageSize);
        prevLastPageRef.current = lastPage;
        setBonuri(dataWithNewAttributes);
        setLastPage(response.data.TotalPages);
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
      cancelTokenSource.cancel("Requestul de bonuri a fost anulat!");
    };
    // eslint-disable-next-line
  }, [currentPage, pageSize, filtruGestiune, filtruNrBon, filtruEliberator, filtruPrimitor, startDay, startMonth, startYear, endDay, endMonth, endYear]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filtruGestiune, filtruNrBon, filtruEliberator, filtruPrimitor]);


  useEffect(() => {
    if (itemDeleted) {
      setLoading(true);
      axios.get("http://dnndev.me/api/Mifix.Api/BonuriDeMiscare/Next")
        .then(resp => {
          console.log("Următorul NB este:", resp.data);
          setNextNB(resp.data);
        })
        .catch(error => {
          console.log(error);
        });
      const fetchData = async () => {
        try {
          const postdata = {
            DateInterval: {
              Start: {
                Year: startYear,
                Month: startMonth,
                Day: startDay,
              },
              End: {
                Year: endYear,
                Month: endMonth,
                Day: endDay,
              },
            },
            Pagination: { CurrentPage: currentPage, PageSize: pageSize },
            Gestiune: filtruGestiune || "",
            NrBon: filtruNrBon || null,
            IntocmitDe: filtruEliberator || "",
            PrimitDe: filtruPrimitor || "",
          };
          const response = await axios.post(url, postdata);
          const dataWithNewAttributes = response.data.BonuriDeMiscare.map((bon) => ({
            Id: bon.Id,
            id: nanoid(),
            Gestiune: bon.Gestiune,
            NrBon: bon.NrBon,
            Data: bon.Data,
            IntocmitDe: bon.IntocmitDe,
            PrimitDe: bon.PrimitDe,
            NrObiecteInventar: bon.ObiecteInventar.length,
            ObiecteInventar: bon.ObiecteInventar
          }));
          console.log("Bonurile primite sunt:\n", dataWithNewAttributes);
          console.log("Pagina Curentă: ", currentPage);
          console.log("Mărimea Paginii: ", pageSize);
          prevLastPageRef.current = lastPage;
          setBonuri(dataWithNewAttributes);
          setLastPage(response.data.TotalPages);
          if (lastPage > 0) {
            console.log("Ultima Pagină: ", lastPage);
          }
          if (dataWithNewAttributes.length === 0 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
          setLoading(false);
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      };

      setItemDeleted(false);
      fetchData();
    }
    // eslint-disable-next-line
  }, [itemDeleted]);

  useEffect(() => {
    if (itemAdded) {
      axios.get("http://dnndev.me/api/Mifix.Api/BonuriDeMiscare/Next")
        .then(resp => {
          console.log("Următorul NB este:", resp.data);
          setNextNB(resp.data);
        })
        .catch(error => {
          console.log(error);
        });
      setLoading(true);
      const fetchData = async () => {
        try {
          const postdata = {
            DateInterval: {
              Start: {
                Year: startYear,
                Month: startMonth,
                Day: startDay,
              },
              End: {
                Year: endYear,
                Month: endMonth,
                Day: endDay,
              },
            },
            Pagination: { CurrentPage: currentPage, PageSize: pageSize },
            Gestiune: filtruGestiune || "",
            NrBon: filtruNrBon || null,
            IntocmitDe: filtruEliberator || "",
            PrimitDe: filtruPrimitor || "",
          };
          const response = await axios.post(url, postdata);
          const dataWithNewAttributes = response.data.BonuriDeMiscare.map((bon) => ({
            Id: bon.Id,
            id: nanoid(),
            Gestiune: bon.Gestiune,
            NrBon: bon.NrBon,
            Data: bon.Data,
            IntocmitDe: bon.IntocmitDe,
            PrimitDe: bon.PrimitDe,
            NrObiecteInventar: bon.ObiecteInventar.length,
            ObiecteInventar: bon.ObiecteInventar
          }));
          console.log("Bonurile primite sunt:\n", dataWithNewAttributes);
          console.log("Pagina Curentă: ", currentPage);
          console.log("Mărimea Paginii: ", pageSize);
          prevLastPageRef.current = lastPage;
          setBonuri(dataWithNewAttributes);
          setLastPage(response.data.TotalPages);
          if (lastPage > 0) {
            console.log("Ultima Pagină: ", lastPage);
          }
          setLoading(false);
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      };
      setItemAdded(false);
      fetchData();
    }
    // eslint-disable-next-line
  }, [itemAdded]);

  useEffect(() => {
    if (NextNB !== '') {
      setLoading(true);
      setAddFormData(prevFormData => ({
        ...prevFormData,
        NumarBon: NextNB
      }));
      console.log("Următorul NB a fost asignat!");
      setLoading(false);
    }
  }, [NextNB]);

  const [startDateState, setStartDateState] = useState(null);
  const [endDateState, setEndDateState] = useState(null);

  const handleDateIntervalChange = (startDate, endDate) => {
    setStartYear(startDate.getFullYear());
    setStartMonth(startDate.getMonth() + 1);
    setStartDay(startDate.getDate());
    setEndYear(endDate.getFullYear());
    setEndMonth(endDate.getMonth() + 1);
    setEndDay(endDate.getDate());
    setShowDatePicker(false);
  };


  const handleCancel = () => {
    setShowDatePicker(false);
  };

  const handleReset = () => {
    setStartYear(1901);
    setStartMonth(1);
    setStartDay(1);
    setEndYear(9999);
    setEndMonth(12);
    setEndDay(31);
    setStartDateState(null);
    setEndDateState(null);
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const [isClicked, setIsClicked] = useState(false);
  const [isChosen, setIsChosen] = useState(false);

  // const handleAddFormChange1 = (event) => {
  //   event.preventDefault();

  //   const fieldName = event.target.getAttribute('name');
  //   const fieldValue = event.target.value;

  //   const newFormData = { ...addFormData };
  //   newFormData[fieldName] = fieldValue;

  //   setAddFormData(newFormData);
  // }

  const handleAddFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute('name');
    let fieldValue = event.target.value;

    const newFormData = { ...addFormData };

    // Remove leading zeros from quantity or order number
    fieldValue = fieldValue.replace(/^0+(?=\d)/, "");

    // Convert input like '01' to '1'
    fieldValue = parseInt(fieldValue, 10).toString();

    // Validate and convert quantity to an integer greater than or equal to 0
    if (fieldName === "NumarBon") {
      const numarBon = fieldValue === "" ? "" : parseInt(fieldValue, 10);

      if (fieldValue === "" || isNaN(numarBon) || numarBon < 0) {
        newFormData[fieldName] = "";
      } else {
        newFormData[fieldName] = numarBon;

        // Prevent leading zeros
        if (newFormData[fieldName] !== "" && newFormData[fieldName] !== 0 && fieldValue.startsWith("0")) {
          newFormData[fieldName] = parseInt(fieldValue, 10);
        }
      }

      // Set the field back to empty if the user deletes its contents
      if (event.nativeEvent.inputType === "deleteContentBackward" && newFormData[fieldName] === 0) {
        newFormData[fieldName] = "";
      }
    }
    setAddFormData(newFormData);
  }

  const handleObjectPickerChange = (selectedObjects) => {
    const selectedSN = selectedObjects.flatMap((o) => o.selectedSN);
    const nrObiecteDeInventar = selectedObjects.reduce((total, o) => total + o.NrObiecteInventar, 0);
    const newFormData = {
      ...addFormData,
      ObiecteDeInventar: selectedSN,
      NrObiecteDeInventar: nrObiecteDeInventar,
    };
    setAddFormData(newFormData);
  };

  const handleAddFormSubmit = (event) => {

    setLoading(true);

    event.preventDefault();

    if (!(addFormData.NumarBon)) {
      alert("Numărul de bon nu poate fi lăsat liber!");
      setLoading(false);
      return;
    }

    if (isNaN(addFormData.NumarBon)) {
      alert("Numărul de bon poate conține doar caractere numerice (întregi)!");
      setLoading(false);
      return;
    }

    if (!(addFormData.Gestiune.Nume)) {
      alert("Gestiunea nu poate fi lăsată liberă!");
      setLoading(false);
      return;
    }

    if (addFormData.Gestiune.Nume.length > 200) {
      alert("Gestiunea nu poate depăși 200 de caractere!");
      setLoading(false);
      return;
    }

    if (!addFormData.Data) {
      alert("Data nu poate fi lăsată liberă!");
      setLoading(false);
      return;
    }

    if (!addFormData.Eliberator) {
      alert("Eliberatorul nu poate fi lăsat liber!");
      setLoading(false);
      return;
    }

    if (addFormData.Eliberator.length > 100) {
      alert("Eliberatorul nu poate depăși 100 de caractere!");
      setLoading(false);
      return;
    }

    if (!addFormData.Primitor) {
      alert("Primitorul nu poate fi lăsat liber!");
      setLoading(false);
      return;
    }

    if (addFormData.Primitor.length > 100) {
      alert("Primitorul nu poate depăși 100 de caractere!");
      setLoading(false);
      return;
    }

    if (addFormData.ObiecteDeInventar.length === 0) {
      alert("Nu ați selectat obiecte!\nAsigurați-vă că ați selectat și salvat obiectele dorite!");
      setLoading(false);
      return;
    }

    if (addFormData.ObiecteDeInventar.length !== addFormData.NrObiecteDeInventar) {
      alert("Eroare de transmisie date pentru selectorul de obiecte!");
      setLoading(false);
      return;
    }

    const newPostBon = {
      NrBon: addFormData.NumarBon,
      Data: addFormData.Data,
      IntocmitDe: user,
      IdGestiune: addFormData.Gestiune.Id,
      IdObiecteInventar: addFormData.ObiecteDeInventar
    };

    console.log("Bonul care trebuie trimis: \n", newPostBon);

    axios
      .post('http://dnndev.me/api/Mifix.Api/BonuriDeMiscare/New', newPostBon)
      .then((response) => {
        console.log(response.data);
        console.log("Bonul Trimis: \n", newPostBon);
        setItemAdded(true);

        // Resetăm fieldurile
        setAddFormData({
          NumarBon: "",
          Gestiune: { Id: "", Nume: "" },
          Data: "",
          Eliberator: numereal,
          Primitor: "",
          ObiecteDeInventar: [],
          NrObiecteDeInventar: 0,
        });
        setIsChosen(false);
        document.getElementsByName("NumarBon")[0].value = "";
        document.getElementsByName("Gestiune")[0].value = "";
        // document.getElementsByName("Eliberator")[0].value = "";
        document.getElementsByName("Primitor")[0].value = "";
        setFormSubmitted(true);
        setFormSubmitted2(true);

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
      }
      );

  }

  const handleDeleteClick = (bonId) => {

    setLoading(true);

    console.log("Se șterge bonul cu ID-ul (din baza de date) :\n", bonId);

    axios
      .delete(`http://dnndev.me/api/Mifix.Api/BonuriDeMiscare/Delete?Id=${bonId}`)
      .then((response) => {
        console.log(response.data);
        setItemDeleted(true);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 409) {
          const errorMessage = error.response.data.Message;
          console.log(errorMessage);
          alert(errorMessage);
        }
        setLoading(false);
      });
  }

  return (

    <div className="outer-wrapper">
      {<div style={{ display: 'block' }}><LoadingBM loading={loading} /></div>}
      <div className="table-wrapper">
        <table>

          <thead>

            <tr style={{ display: showRows ? 'none' : 'table-row' }}>
              <th style={{ fontSize: "30px", backgroundColor: "lightgrey", position: "static" }} colSpan="7">
                <FontAwesomeIcon icon={faGear} style={{ cursor: "pointer", marginRight: "5px", fontSize: "32px" }} onClick={toggleRows} title='Vedeți mai multe opțiuni!' />
                Tabel - Evidență Bonuri
              </th>
            </tr>

            <tr style={{ display: showRows ? 'table-row' : 'none' }}>
              <th style={{ fontSize: "30px", backgroundColor: "lightgrey", position: "static" }} colSpan="8">
                <FontAwesomeIcon icon={faGear} style={{ cursor: "pointer", marginRight: "5px", fontSize: "32px" }} onClick={toggleRows} title='Vedeți mai multe opțiuni!' />
                Tabel - Evidență Bonuri
              </th>
            </tr>

            <tr style={{ display: showRows ? 'table-row' : 'none' }}>
              <th style={{ backgroundColor: "lightgrey" }} colSpan="1">Nr.Bon-Filtru</th>
              <th style={{ backgroundColor: "lightgrey" }} colSpan="2">Gestiune-Filtru</th>
              <th style={{ backgroundColor: "lightgrey" }} colSpan="2">Eliberator-Filtru</th>
              <th style={{ backgroundColor: "lightgrey" }} colSpan="2">Primitor-Filtru</th>
              <th style={{ backgroundColor: "lightgrey" }} colSpan="1">Opțiuni - Filtru</th>
            </tr>

            <tr style={{ display: showRows ? 'table-row' : 'none' }}>
              <th style={{ backgroundColor: "lightgrey", padding: '5px' }} colSpan="1">
                <div className='input-container'>
                  <input
                    type="text"
                    name="FiltruNrBon"
                    placeholder="Filtru-Nr.Bon"
                    value={OptionsData.FiltruNrBon}
                    onChange={handleOptionsDataChange}
                  />
                </div>
                <button type='button' onClick={handleFiltruNrBon} style={{ marginRight: '10px' }}>
                  Adaugă
                </button>
                <button type='button' onClick={handleClearFiltruNrBon}>
                  Șterge
                </button>
              </th>

              <th style={{ backgroundColor: "lightgrey" }} colSpan="2">
                <div className='input-container'>
                  <input
                    type="text"
                    name="FiltruGestiune"
                    placeholder="Filtru-Gestiune"
                    onChange={handleOptionsDataChange}
                    value={OptionsData.FiltruGestiune}
                  />
                </div>
                <button type='button' onClick={handleFiltruGestiune} style={{ marginRight: '10px' }}>
                  Adaugă
                </button>
                <button type='button' onClick={handleClearFiltruGestiune}>
                  Șterge
                </button>
              </th>

              <th style={{ backgroundColor: "lightgrey" }} colSpan="2">
                <div className='input-container'>
                  <input
                    type="text"
                    name="FiltruEliberator"
                    placeholder="Filtru-Eliberator"
                    onChange={handleOptionsDataChange}
                    value={OptionsData.FiltruEliberator}
                  />
                </div>
                <button type='button' onClick={handleFiltruEliberator} style={{ marginRight: '10px' }}>
                  Adaugă
                </button>
                <button type='button' onClick={handleClearFiltruEliberator}>
                  Șterge
                </button>
              </th>

              <th style={{ backgroundColor: "lightgrey" }} colSpan="2">
                <div className='input-container'>
                  <input
                    type="text"
                    name="FiltruPrimitor"
                    placeholder="Filtru-Primitor"
                    onChange={handleOptionsDataChange}
                    value={OptionsData.FiltruPrimitor}
                  />
                </div>
                <button type='button' onClick={handleFiltruPrimitor} style={{ marginRight: '10px' }}>
                  Adaugă
                </button>
                <button type='button' onClick={handleClearFiltruPrimitor}>
                  Șterge
                </button>
              </th>

              <th style={{ backgroundColor: "lightgrey" }} colSpan="1">
                <button type='button' onClick={handleClearInputs}>
                  Șterge Filtrele
                </button>
              </th>

            </tr>

            <tr style={{ display: showRows ? 'table-row' : 'none' }}>
              <th style={{ backgroundColor: "lightgrey" }}>Nr.Bon</th>
              <th style={{ backgroundColor: "lightgrey" }}>Gestiune</th>
              <th style={{ backgroundColor: "lightgrey" }}>Data</th>
              <th style={{ backgroundColor: "lightgrey" }}>Eliberat De</th>
              <th style={{ backgroundColor: "lightgrey" }}>Primit De</th>
              <th style={{ backgroundColor: "lightgrey" }} title='Numărul obiectelor conținute de bon'>Nr. Obiecte</th>
              <th style={{ backgroundColor: "lightgrey" }} colSpan="2">Opțiuni</th>
            </tr>

            <tr style={{ display: showRows ? 'none' : 'table-row' }}>
              <th style={{ backgroundColor: "lightgrey" }}>Nr.Bon</th>
              <th style={{ backgroundColor: "lightgrey" }}>Gestiune</th>
              <th style={{ backgroundColor: "lightgrey" }}>Data</th>
              <th style={{ backgroundColor: "lightgrey" }}>Eliberat De</th>
              <th style={{ backgroundColor: "lightgrey" }}>Primit De</th>
              <th style={{ backgroundColor: "lightgrey" }} title='Numărul obiectelor conținute de bon'>Nr. Obiecte</th>
              <th style={{ backgroundColor: "lightgrey" }}>Opțiuni</th>
            </tr>

          </thead>
          <tbody>

            {bonuri?.map((bon) => (
              <Fragment key={bon.id}>
                <ReadOnlyRowBM
                  key={bon.Id}
                  bon={bon}
                  handleDeleteClick={handleDeleteClick}
                  showRows={showRows}
                />
              </Fragment>
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
          <div style={{ marginLeft: '10px', fontStyle: 'italic' }}>Nu există bonuri care să fie vizualizate.</div>
        )}
        {currentPage > lastPage && (
          <div style={{ marginLeft: '10px', fontStyle: 'italic' }}>Pagina nu este disponibilă.</div>
        )}
      </div>

      <div className="calendar-date-picker" style={{ marginTop: "10px", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <FontAwesomeIcon icon={faCalendar} onClick={() => setShowDatePicker(true)} style={{ marginRight: '10px', cursor: 'pointer' }} />
        {showDatePicker &&
          <CalendarPicker
            onDateIntervalChange={handleDateIntervalChange}
            onCancel={handleCancel}
            startDateState={startDateState}
            setStartDateState={setStartDateState}
            endDateState={endDateState}
            setEndDateState={setEndDateState}
          />
        }
        {startYear !== 1901 || startMonth !== 1 || startDay !== 1 || endYear !== 9999 || endMonth !== 12 || endDay !== 31 ?
          <FontAwesomeIcon icon={faTimes} onClick={handleReset} style={{ cursor: 'pointer' }} />
          : null
        }
      </div>

      <h2 style={{ marginTop: '25px', marginBottom: '15px' }}>Formular de introducere a bonurilor</h2>

      <form onSubmit={handleAddFormSubmit} style={{ marginLeft: '10px', marginRight: '10px' }}>
        <label>
          Nr. Bon:
        </label>
        <br />
        <input
          className="input-outside-table"
          type="text"
          name="NumarBon"
          step="1"
          value={addFormData.NumarBon}
          placeholder="Nr.Bonului este ..."
          onChange={handleAddFormChange}
        />
        <br />
        <label>
          Gestiunea:
        </label>
        {!isChosen ? (
          <button type="button" onClick={() => setIsClicked(true)}>
            Alegeți Gestiunea
          </button>
        ) : (
          <button type="button" onClick={() => {
            setIsChosen(false);
            setAddFormData({ ...addFormData, Gestiune: { Id: "", Nume: "" }, Primitor: "" });
          }}>
            Ștergeți Gestiunea
          </button>
        )}
        <br />
        <div>
          <input
            className="input-outside-table"
            name='Gestiune'
            type="text"
            placeholder='Alegeți gestiunea...'
            readOnly
            value={addFormData.Gestiune.Nume}
          />
          {isClicked && (
            <GestiuneForm
              isClicked={isClicked}
              setIsClicked={setIsClicked}
              setIsChosen={setIsChosen}
              addFormData={addFormData}
              setAddFormData={setAddFormData}
            />
          )}
        </div>
        <label>
          Data:
        </label>
        <br />
        <CustomDatePicker
          addFormData={addFormData}
          setAddFormData={setAddFormData}
          dateNotFormatted={dateNotFormatted}
          setDateNotFormatted={setDateNotFormatted}
          formSubmitted={formSubmitted}
          setFormSubmitted={setFormSubmitted}

        />
        <label>
          Eliberat De:
        </label>
        <br />
        <input
          className="input-outside-table"
          type="text"
          name="Eliberator"
          placeholder="BM este eliberat de..."
          value={addFormData.Eliberator} readOnly
        />
        <br />
        <label>
          Primit De:
        </label>
        <br />
        <input
          className="input-outside-table"
          type="text"
          name="Primitor"
          readOnly
          placeholder='Alegeți gestiunea pentru a vedea destinatarul...'
          value={addFormData.Primitor}
        />
        <br />
        <div>
          <label>Obiecte De Inventar:</label>
          <button type="button" onClick={toggle}>
            Alegeți Obiectele
          </button>
          {isOpen && (
            <IOPicker
              selectedObjects={selectedObjects}
              setSelectedObjects={setSelectedObjects}
              savedObjects={savedObjects}
              setSavedObjects={setSavedObjects}
              isOpen={isOpen}
              toggle={toggle}
              onSelect={handleObjectPickerChange}
              formSubmitted={formSubmitted2}
              setFormSubmitted={setFormSubmitted2}
            />
          )}
          <br />
        </div>

        <br />

        <button type="submit" className="button">Adaugă Bon</button>

        <br />
        <br />

      </form>

    </div>
  )
}

export default DataBaseBM