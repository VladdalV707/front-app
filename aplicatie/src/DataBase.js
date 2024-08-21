import { useState, useEffect, Fragment, useRef } from 'react';
import React from 'react';
import "./DataBase.css";
import { axios } from './axiosInstance';
import { nanoid } from 'nanoid';
import ReadOnlyRow from './ComponenteDB/ReadOnlyRow';
import EditableRow from './ComponenteDB/EditableRow';
import Loading from './ComponenteDB/Loading';
import SNPicker from './ComponenteDB/SNPicker';
import YearSelector from './ComponenteDB/YearSelector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faBars, faGear, faSort } from '@fortawesome/free-solid-svg-icons';
import Drawer from './ComponenteDB/Drawer';
import FurnizorInput from './ComponenteDB/FurnizorInput';

const DataBase = () => {

    const currentYear = new Date().getFullYear();

    /*Variabile Opțiuni*/
    const [showRows, setShowRows] = useState(false);

    const toggleRows = () => {
        setShowRows(!showRows);
    };

    const [filtrufactura, setFiltrufactura] = useState("");
    const [filtrufurnzior, setFiltrufurnizor] = useState("");
    const [filtruobiect, setFiltruobiect] = useState("");
    const [filtruNO, setFiltruNO] = useState("");
    const [year, setYear] = useState(currentYear);
    const [showYearSelector, setShowYearSelector] = useState(false);
    const [sort, setSort] = useState(0);
    /*--*/

    /*Variabile Serii*/

    const [showSerialNumbers, setShowSerialNumbers] = useState(false);
    const [serialNumbers, setSerialNumbers] = useState([""]);
    const [currentIndex, setCurrentIndex] = useState(0);

    /*--*/

    /*Variabile Paginare*/
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [lastPage, setLastPage] = useState(0);
    const [inputPage, setInputPage] = useState('');
    /*--*/

    /*Variabile Sertar*/
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const openDrawer = () => {
        setIsDrawerOpen(true);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
        setDrawerClosed(true);
    };

    /*--*/

    const [itemDeleted, setItemDeleted] = useState(false);
    const [itemAdded, setItemAdded] = useState(false);
    const [itemEdited, setItemEdited] = useState(false);
    const [drawerClosed, setDrawerClosed] = useState(false);
    const [loading, setLoading] = useState(false);
    const url = 'http://dnndev.me/api/Mifix.Api/ObiecteInventar/GetFiltered';
    const [obiecte, setObiecte] = useState([]);

    const prevLastPageRef = useRef();

    const [addFormData, setAddFromData] = useState({
        NumarDeOrdine: '',
        NrFactura: '',
        Furnizor: '',
        DenumireObiect: '',
        NrBucati: '',
        SeriiObiecte: [],
        showSerialButton: false,
    });

    const [NextNO, setNextNO] = useState('');

    useEffect(() => {
        let cancelTokenSource = axios.CancelToken.source();
        setLoading(true);
        axios.get("http://dnndev.me/api/Mifix.Api/ObiecteInventar/Next")
            .then(resp => {
                console.log("Următorul NO este:", resp.data);
                setNextNO(resp.data);
            })
            .catch(error => {
                console.log(error);
            });
        const postdata = {
            Pagination: { CurrentPage: currentPage, PageSize: pageSize },
            FacturaSearch: filtrufactura || "",
            FurnizorSearch: filtrufurnzior || "",
            DenumireSearch: filtruobiect || "",
            NrDeOrdineSearch: filtruNO || "",
            YearSearch: year,
            NrDeOrdineSort: sort,
        };

        const fetchData = async () => {
            try {
                const res = await axios.post(url, postdata, { cancelToken: cancelTokenSource.token });
                console.log(res);
                let date = res.data.TipuriObiecteInventar.map(data => ({
                    Id: data.Id,
                    id: nanoid(),
                    NumarDeOrdine: data.NumarDeOrdine,
                    NrFactura: data.NrFactura,
                    Furnizor: data.Furnizor,
                    DenumireObiect: data.DenumireObiect,
                    NrBucati: data.NrBucati,
                    Serii: data.Serii
                }));
                console.log("Datele primite sunt:\n", date);
                console.log("Pagina Curentă: ", currentPage);
                console.log("Mărimea Paginii: ", pageSize);
                prevLastPageRef.current = lastPage;

                setObiecte(date);
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
            cancelTokenSource.cancel("Requestul de obiecte a fost anulat!");
        };
        // eslint-disable-next-line
    }, [pageSize, currentPage, filtrufactura, filtrufurnzior, filtruobiect, filtruNO, year, sort]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filtrufactura, filtrufurnzior, filtruobiect, filtruNO]);

    useEffect(() => {
        if (itemAdded) {
            setLoading(true);
            axios.get("http://dnndev.me/api/Mifix.Api/ObiecteInventar/Next")
                .then(resp => {
                    console.log("Următorul NO este:", resp.data);
                    setNextNO(resp.data);
                })
                .catch(error => {
                    console.log(error);
                });
            const postdata = {
                Pagination: { CurrentPage: currentPage, PageSize: pageSize },
                FacturaSearch: filtrufactura || "",
                FurnizorSearch: filtrufurnzior || "",
                DenumireSearch: filtruobiect || "",
                NrDeOrdineSearch: filtruNO || "",
                YearSearch: year,
                NrDeOrdineSort: sort,
            };

            const fetchData = async () => {
                try {
                    const res = await axios.post(url, postdata);
                    console.log(res);
                    let date = res.data.TipuriObiecteInventar.map(data => ({
                        Id: data.Id,
                        id: nanoid(),
                        NumarDeOrdine: data.NumarDeOrdine,
                        NrFactura: data.NrFactura,
                        Furnizor: data.Furnizor,
                        DenumireObiect: data.DenumireObiect,
                        NrBucati: data.NrBucati,
                        Serii: data.Serii
                    }));
                    console.log("Datele primite sunt:\n", date);
                    console.log("Pagina Curentă: ", currentPage);
                    console.log("Mărimea Paginii: ", pageSize);
                    prevLastPageRef.current = lastPage;

                    setObiecte(date);
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
            axios.get("http://dnndev.me/api/Mifix.Api/ObiecteInventar/Next")
                .then(resp => {
                    console.log("Următorul NO este:", resp.data);
                    setNextNO(resp.data);
                })
                .catch(error => {
                    console.log(error);
                });
            const postdata = {
                Pagination: { CurrentPage: currentPage, PageSize: pageSize },
                FacturaSearch: filtrufactura || "",
                FurnizorSearch: filtrufurnzior || "",
                DenumireSearch: filtruobiect || "",
                NrDeOrdineSearch: filtruNO || "",
                YearSearch: year,
                NrDeOrdineSort: sort,
            };

            const fetchData = async () => {
                try {
                    const res = await axios.post(url, postdata);
                    console.log(res);
                    let date = res.data.TipuriObiecteInventar.map(data => ({
                        Id: data.Id,
                        id: nanoid(),
                        NumarDeOrdine: data.NumarDeOrdine,
                        NrFactura: data.NrFactura,
                        Furnizor: data.Furnizor,
                        DenumireObiect: data.DenumireObiect,
                        NrBucati: data.NrBucati,
                        Serii: data.Serii
                    }));
                    console.log("Datele primite sunt:\n", date);
                    console.log("Pagina Curentă: ", currentPage);
                    console.log("Mărimea Paginii: ", pageSize);
                    prevLastPageRef.current = lastPage;

                    setObiecte(date);
                    setLastPage(res.data.TotalPages);
                    if (lastPage > 0) {
                        console.log("Ultima Pagină: ", lastPage);
                    }
                    if (date.length === 0 && currentPage > 1) {
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
        if (itemEdited) {
            setLoading(true);
            axios.get("http://dnndev.me/api/Mifix.Api/ObiecteInventar/Next")
                .then(resp => {
                    console.log("Următorul NO este:", resp.data);
                    setNextNO(resp.data);
                })
                .catch(error => {
                    console.log(error);
                });
            const postdata = {
                Pagination: { CurrentPage: currentPage, PageSize: pageSize },
                FacturaSearch: filtrufactura || "",
                FurnizorSearch: filtrufurnzior || "",
                DenumireSearch: filtruobiect || "",
                NrDeOrdineSearch: filtruNO || "",
                YearSearch: year,
                NrDeOrdineSort: sort,
            };

            const fetchData = async () => {
                try {
                    const res = await axios.post(url, postdata);
                    console.log(res);
                    let date = res.data.TipuriObiecteInventar.map(data => ({
                        Id: data.Id,
                        id: nanoid(),
                        NumarDeOrdine: data.NumarDeOrdine,
                        NrFactura: data.NrFactura,
                        Furnizor: data.Furnizor,
                        DenumireObiect: data.DenumireObiect,
                        NrBucati: data.NrBucati,
                        Serii: data.Serii
                    }));
                    console.log("Datele primite sunt:\n", date);
                    console.log("Pagina Curentă: ", currentPage);
                    console.log("Mărimea Paginii: ", pageSize);
                    prevLastPageRef.current = lastPage;

                    setObiecte(date);
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
        if (drawerClosed) {
            setLoading(true);
            axios.get("http://dnndev.me/api/Mifix.Api/ObiecteInventar/Next")
                .then(resp => {
                    console.log("Următorul NO este:", resp.data);
                    setNextNO(resp.data);
                })
                .catch(error => {
                    console.log(error);
                });
            const postdata = {
                Pagination: { CurrentPage: currentPage, PageSize: pageSize },
                FacturaSearch: filtrufactura || "",
                FurnizorSearch: filtrufurnzior || "",
                DenumireSearch: filtruobiect || "",
                NrDeOrdineSearch: filtruNO || "",
                YearSearch: year,
                NrDeOrdineSort: sort,
            };

            const fetchData = async () => {
                try {
                    const res = await axios.post(url, postdata);
                    console.log(res);
                    let date = res.data.TipuriObiecteInventar.map(data => ({
                        Id: data.Id,
                        id: nanoid(),
                        NumarDeOrdine: data.NumarDeOrdine,
                        NrFactura: data.NrFactura,
                        Furnizor: data.Furnizor,
                        DenumireObiect: data.DenumireObiect,
                        NrBucati: data.NrBucati,
                        Serii: data.Serii
                    }));
                    console.log("Datele primite sunt:\n", date);
                    console.log("Pagina Curentă: ", currentPage);
                    console.log("Mărimea Paginii: ", pageSize);
                    prevLastPageRef.current = lastPage;

                    setObiecte(date);
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
            setDrawerClosed(false);
        }
        // eslint-disable-next-line
    }, [drawerClosed]);

    useEffect(() => {
        if (NextNO !== '') {
            setLoading(true);
            setAddFromData(prevFormData => ({
                ...prevFormData,
                NumarDeOrdine: NextNO
            }));
            console.log("Următorul N.O a fost asignat!");
            setLoading(false);
        }
    }, [NextNO]);

    const [OptionsData, setOptionsData] = useState({
        FiltruNO: '',
        FiltruFactură: '',
        FiltruFurnizor: '',
        FiltruObiect: ''
    });

    const [editFormData, setEditFormData] = useState({
        NumarDeOrdine: '',
        NrFactura: '',
        Furnizor: '',
        DenumireObiect: '',
        NrBucati: '',
    });

    const [editObiectId, setEditObiectId] = useState(null);

    // useEffect(() => {
    //     console.log('Updated addFormData:', addFormData);
    // }, [addFormData]);

    const handleAddFormChange1 = (event) => {
        event.preventDefault();

        const fieldName = event.target.getAttribute('name');
        const fieldValue = event.target.value;

        const newFormData = { ...addFormData };
        newFormData[fieldName] = fieldValue;

        setAddFromData(newFormData);
    }

    const handleAddFormChange = (event) => {
        event.preventDefault();

        const fieldName = event.target.getAttribute("name");
        let fieldValue = event.target.value;

        const newFormData = { ...addFormData };

        // Remove leading zeros from quantity or order number
        fieldValue = fieldValue.replace(/^0+(?=\d)/, "");

        // Convert input like '01' to '1'
        fieldValue = parseInt(fieldValue, 10).toString();

        // Validate and convert quantity to an integer greater than or equal to 0
        if (fieldName === "NrBucati") {
            const nrBucati = fieldValue === "" ? "" : parseInt(fieldValue, 10);

            if (fieldValue === "" || isNaN(nrBucati) || nrBucati < 0) {
                newFormData[fieldName] = "";
            } else {
                newFormData[fieldName] = nrBucati;

                // Prevent leading zeros
                if (newFormData[fieldName] !== "" && newFormData[fieldName] !== 0 && fieldValue.startsWith("0")) {
                    newFormData[fieldName] = parseInt(fieldValue, 10);
                }
            }

            // Set the field back to empty if the user deletes its contents
            if (event.nativeEvent.inputType === "deleteContentBackward" && newFormData[fieldName] === 0) {
                newFormData[fieldName] = "";
            }

            // Show or hide the serial button based on the validated NrBucati value
            newFormData.showSerialButton = Number.isInteger(newFormData["NrBucati"]) && newFormData["NrBucati"] > 0;
        } else if (fieldName === "NumarDeOrdine") {
            const numarDeOrdine = fieldValue === "" ? "" : parseInt(fieldValue, 10);

            if (fieldValue === "" || isNaN(numarDeOrdine) || numarDeOrdine < 0) {
                newFormData[fieldName] = "";
            } else {
                newFormData[fieldName] = numarDeOrdine;

                // Prevent leading zeros
                if (newFormData[fieldName] !== "" && newFormData[fieldName] !== 0 && fieldValue.startsWith("0")) {
                    newFormData[fieldName] = parseInt(fieldValue, 10);
                }
            }
        }
        setAddFromData(newFormData);
    };




    const handleSerialNumbersChange = (serialNumbers) => {
        const validSerialNumbers =
            serialNumbers.length === Number(addFormData.NrBucati) &&
            !serialNumbers.some(sn => sn === "");

        const newSeriiObiecte = validSerialNumbers ? serialNumbers : [];

        setAddFromData({
            ...addFormData,
            SeriiObiecte: newSeriiObiecte,
        });

        setShowSerialNumbers(false);

        console.log("Ce se trimite obiectului cu selecția curentă de serii?:\n", newSeriiObiecte);
    };



    /*Opțiuni*/

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

        setFiltrufactura('');
        setFiltrufurnizor('');
        setFiltruobiect('');
        setFiltruNO('');

        setOptionsData({
            FiltruNO: '',
            FiltruFactură: '',
            FiltruFurnizor: '',
            FiltruObiect: ''
        });

    };

    const handleClearNO = (event) => {
        event.preventDefault();

        setFiltruNO('');

        setOptionsData({
            FiltruNO: ''
        });

    };

    const handleClearFact = (event) => {
        event.preventDefault();

        setFiltrufactura('');

        setOptionsData({
            FiltruFactură: ''
        });

    };

    const handleClearFurniz = (event) => {
        event.preventDefault();

        setFiltrufurnizor('');

        setOptionsData({
            FiltruFurnizor: ''
        });

    };

    const handleClearObi = (event) => {
        event.preventDefault();

        setFiltruobiect('');

        setOptionsData({
            FiltruObiect: ''
        });

    };

    /*Filtre*/

    const handleFiltruNO = (event) => {
        event.preventDefault();

        const FiltruNO = OptionsData.FiltruNO;

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

    const handleFiltruFactura = (event) => {
        event.preventDefault();

        const FiltruFactură = OptionsData.FiltruFactură;

        if (!FiltruFactură) {
            alert("Filtrul facturii nu poate fi lăsat liber!");
            return;
        }

        if (FiltruFactură.length > 100) {
            alert("Filtrul facturii nu poate depăși 100 de caractere!");
            return;
        }

        setFiltrufactura(FiltruFactură);
    }


    const handleFiltruFurnizor = (event) => {
        event.preventDefault();

        const FiltruFurnizor = OptionsData.FiltruFurnizor;

        if (!FiltruFurnizor) {
            alert("Filtrul furnizorului nu poate fi lăsat liber!");
            return;
        }

        if (FiltruFurnizor.length > 100) {
            alert("Filtrul furnizorului nu poate depăși 100 de caractere!");
            return;
        }

        setFiltrufurnizor(FiltruFurnizor);
    }

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

    const handleEditFormChange = (event) => {
        event.preventDefault();

        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value;

        const newFormData = { ...editFormData };
        newFormData[fieldName] = fieldValue;

        setEditFormData(newFormData);

    }

    const handleAddFormSubmit = (event) => {

        setLoading(true);

        event.preventDefault();

        console.log("Obiectul de verificat:", addFormData);

        if (!addFormData.NumarDeOrdine) {
            alert("Numărul de ordine nu poate fi lăsat liber!");
            setLoading(false);
            return;
        }

        if (isNaN(addFormData.NumarDeOrdine)) {
            alert("Numărul de ordine nu poate conține decât caractere numerice (întregi)!");
            setLoading(false);
            return;
        }

        if (!addFormData.NrFactura) {
            alert("Numărul de factură nu poate fi lăsat liber!");
            setLoading(false);
            return;
        }

        if (addFormData.NrFactura.length > 100) {
            alert("Numărul de factură nu poate depăși 100 de caractere!");
            setLoading(false);
            return;
        }

        if (!(addFormData.Furnizor)) {
            alert("Furnizorul nu poate fi lăsat liber!");
            setLoading(false);
            return;
        }

        if (addFormData.Furnizor.length > 200) {
            alert("Furnizorul nu poate depăși 200 de caractere!");
            setLoading(false);
            return;
        }

        if (!(addFormData.DenumireObiect)) {
            alert("Denumirea obiectului nu poate fi lăsată liberă!");
            setLoading(false);
            return;
        }

        if (addFormData.DenumireObiect.length > 200) {
            alert("Denumirea obiectului nu poate depăși 200 de caractere!");
            setLoading(false);
            return;
        }


        if (!addFormData.NrBucati) {
            alert("Numărul de bucăți nu poate fi lăsat liber!");
            setLoading(false);
            return;
        }

        if (isNaN(addFormData.NrBucati)) {
            alert("Numărul de bucăți nu poate conține decât caractere numerice!");
            setLoading(false);
            return;
        }

        if (addFormData.NrBucati === 0) {
            alert("Numărul de bucăți nu avea valoare 0!");
            setLoading(false);
            return;
        }

        if (addFormData.SeriiObiecte.length !== Number(addFormData.NrBucati) && !addFormData.SeriiObiecte.length === 0) {
            alert("Numărul de bucăți introdus nu corespunde cu numărul seriilor introduse!");
            setLoading(false);
            return;
        }

        const allEmpty = addFormData.SeriiObiecte.every(sn => !sn);
        const allFilled = addFormData.SeriiObiecte.every(sn => sn);
        if (!allEmpty && !allFilled) {
            alert("Seriile trebuie să fie fie toate completate, fie toate goale.");
            setLoading(false);
            return;
        }

        const allUnique = new Set(addFormData.SeriiObiecte).size === addFormData.SeriiObiecte.length;
        if (!allUnique) {
            alert("Seriile introduse trebuie să fie diferite între ele!");
            setLoading(false);
            return;
        }

        console.log("Serii de trimis:", addFormData.SeriiObiecte);

        const newPostObiect = {
            NumarDeOrdine: addFormData.NumarDeOrdine,
            NrFactura: addFormData.NrFactura,
            Furnizor: addFormData.Furnizor,
            DenumireObiect: addFormData.DenumireObiect,
            NrBucati: addFormData.NrBucati,
            SeriiObiecte: addFormData.SeriiObiecte
        };

        console.log("Obiectul trimis:\n", newPostObiect);

        axios
            .post('http://dnndev.me/api/Mifix.Api/ObiecteInventar/New', newPostObiect)
            .then((response) => {
                console.log(response.data);
                setItemAdded(true);

                // Resetăm fieldurile
                setAddFromData({
                    NumarDeOrdine: '',
                    NrFactura: '',
                    Furnizor: '',
                    DenumireObiect: '',
                    NrBucati: '',
                    SeriiObiecte: [],
                    showSerialButton: false
                });
                // document.getElementsByName('NumarDeOrdine')[0].value = '';
                document.getElementsByName('NrFactura')[0].value = '';
                document.getElementsByName('Furnizor')[0].value = '';
                document.getElementsByName('DenumireObiect')[0].value = '';
                document.getElementsByName('NrBucati')[0].value = '';
                setSerialNumbers(['']);
                setCurrentIndex(0);
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


    const handleEditFormSubmit = async (event) => {

        setLoading(true);

        event.preventDefault();

        if (!editFormData.NumarDeOrdine) {
            alert("Numărul de ordine nu poate fi lăsat liber!");
            setLoading(false);
            return;
        }

        if (isNaN(editFormData.NumarDeOrdine)) {
            alert("Numărul de ordine nu poate conține decât caractere numerice!");
            setLoading(false);
            return;
        }

        if (!editFormData.NrFactura) {
            alert("Numărul de factură nu poate fi lăsat liber!");
            setLoading(false);
            return;
        }

        if (editFormData.NrFactura.length > 100) {
            alert("Numărul de factură nu poate depăși 100 de caractere!");
            setLoading(false);
            return;
        }

        if (!(editFormData.Furnizor)) {
            alert("Furnizorul nu poate fi lăsat liber!");
            setLoading(false);
            return;
        }

        if (editFormData.Furnizor.length > 200) {
            alert("Furnizorul nu poate depăși 200 de caractere!");
            setLoading(false);
            return;
        }

        if (!(editFormData.DenumireObiect)) {
            alert("Denumirea obiectului nu poate fi lăsată liberă!");
            setLoading(false);
            return;
        }

        if (editFormData.DenumireObiect.length > 200) {
            alert("Denumirea obiectului nu poate depăși 200 de caractere!");
            setLoading(false);
            return;
        }

        const editedObiect = {
            NumarDeOrdine: editFormData.NumarDeOrdine,
            NrFactura: editFormData.NrFactura,
            Furnizor: editFormData.Furnizor,
            DenumireObiect: editFormData.DenumireObiect,
        };

        const obiectToEdit = obiecte.find((obiect) => obiect.id === editObiectId);
        const id = obiectToEdit.Id;

        try {
            await axios.put(`http://dnndev.me/api/Mifix.Api/ObiecteInventar/Edit?Id=${id}`, editedObiect);
            setEditObiectId(null);
            setItemEdited(true);
            setLoading(false);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 409) {
                alert(error.response.data.Message);
            } else {
                alert("Operația de editare a eșuat!");
            }
            setLoading(false);
        }
    };


    const handleEditClick = (event, obiect) => {
        event.preventDefault();
        setEditObiectId(obiect.id);

        const formValues = {
            NumarDeOrdine: obiect.NumarDeOrdine,
            NrFactura: obiect.NrFactura,
            Furnizor: obiect.Furnizor,
            DenumireObiect: obiect.DenumireObiect,
            NrBucati: obiect.NrBucati
        }

        setEditFormData(formValues);
    };

    const handleCancelClick = () => {
        setEditObiectId(null);
    }

    const handleDeleteClick = (obiectDbId) => {

        setLoading(true);

        console.log("Se șterge obiectul cu ID-ul (din baza de date) :\n", obiectDbId);

        axios
            .delete(`http://dnndev.me/api/Mifix.Api/ObiecteInventar/Delete?Id=${obiectDbId}`)
            .then((response) => {
                console.log(response.data);
                setItemDeleted(true);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                if (error.response && error.response.status === 409) {
                    alert(error.response.data.Message);
                } else {
                    alert("Operația de ștergere a eșuat!");
                }
                setLoading(false);
            });
    };

    const toggleSort = () => {
        setSort(sort === 0 ? 1 : 0);
    };

    return (
        <div className="outer-wrapper">
            {<div style={{ display: 'block' }}><Loading loading={loading} /></div>}
            <div className="table-wrapper">
                <form onSubmit={handleEditFormSubmit}>
                    <table>

                        <thead >

                            <tr>
                                <th style={{ fontSize: "50px", backgroundColor: "lightgrey", position: "static" }} colSpan="6">
                                    <FontAwesomeIcon icon={faGear} style={{ cursor: "pointer", marginRight: "5px", fontSize: "42px" }} onClick={toggleRows} title='Vedeți mai multe opțiuni!' />
                                    <span
                                        style={{
                                            cursor: "pointer"
                                        }}
                                        onClick={() => setShowYearSelector(true)}
                                        title="Schimbați anul curent!"
                                    >
                                        {year}
                                    </span>
                                </th>
                            </tr>

                            <tr style={{ display: showRows ? 'table-row' : 'none' }}>
                                <th style={{ backgroundColor: "lightgrey" }} colSpan="1">N.O. - Filtru</th>
                                <th style={{ backgroundColor: "lightgrey" }} colSpan="1">Factură-Filtru</th>
                                <th style={{ backgroundColor: "lightgrey" }} colSpan="1">Furnizor-Filtru</th>
                                <th style={{ backgroundColor: "lightgrey" }} colSpan="2">Obiect-Filtru</th>
                                <th style={{ backgroundColor: "lightgrey" }} colSpan="1">Opțiuni - Filtru</th>
                            </tr>

                            <tr style={{ display: showRows ? 'table-row' : 'none' }}>
                                <th style={{ backgroundColor: "lightgrey" }} colSpan="1">
                                    <div className='input-container'>
                                        <input
                                            type="text"
                                            name="FiltruNO"
                                            placeholder="Filtru - N.O."
                                            value={OptionsData.FiltruNO}
                                            onChange={handleOptionsDataChange}
                                        />
                                    </div>
                                    <button type='button' onClick={handleFiltruNO} style={{ marginRight: '10px' }}>
                                        Adaugă
                                    </button>

                                    <button type='button' onClick={handleClearNO}>
                                        Șterge
                                    </button>
                                </th>

                                <th style={{ backgroundColor: "lightgrey" }} colSpan="1">
                                    <div className='input-container'>
                                        <input
                                            type="text"
                                            name="FiltruFactură"
                                            placeholder="Filtru-Nr.Factură"
                                            onChange={handleOptionsDataChange}
                                            value={OptionsData.FiltruFactură}
                                        />
                                    </div>
                                    <button type='button' onClick={handleFiltruFactura} style={{ marginRight: '10px' }}>
                                        Adaugă
                                    </button>
                                    <button type='button' onClick={handleClearFact}>
                                        Șterge
                                    </button>
                                </th>

                                <th style={{ backgroundColor: "lightgrey" }} colSpan="1">
                                    <div className='input-container'>
                                        <input
                                            type="text"
                                            name="FiltruFurnizor"
                                            placeholder="Filtru-Furnizor"
                                            onChange={handleOptionsDataChange}
                                            value={OptionsData.FiltruFurnizor}
                                        />
                                    </div>
                                    <button type='button' onClick={handleFiltruFurnizor} style={{ marginRight: '10px' }}>
                                        Adaugă
                                    </button>
                                    <button type='button' onClick={handleClearFurniz}>
                                        Șterge
                                    </button>
                                </th>

                                <th style={{ backgroundColor: "lightgrey" }} colSpan="2">
                                    <div className='input-container'>
                                        <input
                                            type="text"
                                            name="FiltruObiect"
                                            placeholder="Filtru-Obiect"
                                            onChange={handleOptionsDataChange}
                                            value={OptionsData.FiltruObiect}
                                        />
                                    </div>
                                    <button type='button' onClick={handleFiltruObiect} style={{ marginRight: '10px' }}>
                                        Adaugă
                                    </button>
                                    <button type='button' onClick={handleClearObi}>
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
                                <th style={{ backgroundColor: "lightgrey" }}>
                                    <FontAwesomeIcon icon={faSort} style={{ marginRight: '5px', color: 'black', cursor: 'pointer', fontSize: '22px' }} onClick={toggleSort} title="Apăsați pentru a sorta descrescător/crescător be baza numărului de ordine!" />
                                    N.O.
                                </th>
                                <th style={{ backgroundColor: "lightgrey" }}>Nr. Factură</th>
                                <th style={{ backgroundColor: "lightgrey" }}>
                                    <FontAwesomeIcon icon={faBars} style={{ marginRight: '5px', color: 'black', cursor: 'pointer', fontSize: '22px' }} onClick={openDrawer} title='Buton de vizualizare a furnizorilor!' />
                                    Furnizor
                                </th>
                                <th style={{ backgroundColor: "lightgrey" }}>Denumire Obiect</th>
                                <th style={{ backgroundColor: "lightgrey" }}>BUC</th>
                                <th style={{ backgroundColor: "lightgrey" }}>Opțiuni</th>
                            </tr>

                            <tr style={{ display: showRows ? 'none' : 'table-row' }}>
                                <th style={{ backgroundColor: "lightgrey" }}>
                                    <FontAwesomeIcon icon={faSort} style={{ marginRight: '5px', color: 'black', cursor: 'pointer', fontSize: '22px' }} onClick={toggleSort} title="Apăsați pentru a sorta descrescător/crescător be baza numărului de ordine!" />
                                    N.O.
                                </th>
                                <th style={{ backgroundColor: "lightgrey" }}>Nr. Factură</th>
                                <th style={{ backgroundColor: "lightgrey" }}>
                                    <FontAwesomeIcon icon={faBars} style={{ marginRight: '5px', color: 'black', cursor: 'pointer', fontSize: '22px' }} onClick={openDrawer} title='Buton de vizualizare a furnizorilor!' />
                                    Furnizor
                                </th>
                                <th style={{ backgroundColor: "lightgrey" }}>Denumire Obiect</th>
                                <th style={{ backgroundColor: "lightgrey" }}>BUC</th>
                                <th style={{ backgroundColor: "lightgrey" }}>Opțiuni</th>
                            </tr>

                        </thead>

                        <tbody>

                            {obiecte?.map((obiect) => (
                                <Fragment key={obiect.Id}>
                                    {editObiectId === obiect.id ? (
                                        <EditableRow
                                            editFormData={editFormData}
                                            handleEditFormChange={handleEditFormChange}
                                            handleCancelClick={handleCancelClick}
                                        />
                                    ) : (
                                        <ReadOnlyRow
                                            obiect={obiect}
                                            handleEditClick={handleEditClick}
                                            handleDeleteClick={handleDeleteClick}
                                        />
                                    )}
                                </Fragment>

                            ))}

                        </tbody>

                    </table>
                </form>
            </div>

            {isDrawerOpen ? <Drawer onClose={closeDrawer} isDrawerOpen={isDrawerOpen} obiecte={obiecte} /> : null}

            {showYearSelector ? <YearSelector showYearSelector={showYearSelector} setShowYearSelector={setShowYearSelector} setYear={setYear} /> : null}

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
                    <div style={{ marginLeft: '10px', fontStyle: 'italic' }}>Nu există obiecte care să fie vizualizate.</div>
                )}
                {currentPage > lastPage && (
                    <div style={{ marginLeft: '10px', fontStyle: 'italic' }}>Pagina nu este disponibilă.</div>
                )}
            </div>

            <h2 style={{ marginTop: '25px', marginBottom: '15px' }}>Formular de introducere a obiectelor</h2>

            <form onSubmit={handleAddFormSubmit} style={{ marginLeft: '10px', marginRight: '10px' }}>
                <label>
                    Nr. Ordine:
                </label>
                <br />
                <input
                    className="input-outside-table"
                    type="text"
                    name="NumarDeOrdine"
                    step="1"
                    value={addFormData.NumarDeOrdine}
                    placeholder="N.O. este ..."
                    onChange={handleAddFormChange}
                />
                <br />
                <label>
                    Nr. Factură:
                </label>
                <br />
                <input
                    className="input-outside-table"
                    type="text"
                    name="NrFactura"
                    placeholder="Nr. de Factură este ..."
                    onChange={handleAddFormChange1}
                    value={addFormData.NrFactura}
                />
                <br />
                <FurnizorInput addFormData={addFormData} setAddFormData={setAddFromData} />
                <label>
                    Denumire Obiect:
                </label>
                <br />
                <input
                    className="input-outside-table"
                    type="text"
                    name="DenumireObiect"
                    placeholder="Denumirea obiectului este ..."
                    onChange={handleAddFormChange1}
                    value={addFormData.DenumireObiect}
                />
                <br />
                <label>
                    Bucăți:
                </label>
                <br />
                <div>
                    <input
                        className="input-outside-table"
                        style={{ marginRight: "10px" }}
                        type="text"
                        name="NrBucati"
                        step="1"
                        value={addFormData.NrBucati}
                        placeholder="Nr. de bucăți este ..."
                        onChange={handleAddFormChange}
                    />
                    {addFormData.showSerialButton && (
                        <button type='button' onClick={() => setShowSerialNumbers(true)}>Introduceți Seriile</button>
                    )}
                </div>
                {showSerialNumbers && (
                    <SNPicker onSerialNumbersChange={handleSerialNumbersChange} onCancel={() => setShowSerialNumbers(false)}
                        NrBucati={addFormData.NrBucati} serialNumbers={serialNumbers} setSerialNumbers={setSerialNumbers}
                        currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} setAddFromData={setAddFromData} addFormData={addFormData} />
                )}
                <br />

                <div>
                    Serii Selectate: {
                        addFormData.NrBucati !== "" && (
                            (serialNumbers.length === 0 && addFormData.NrBucati !== "0") ||
                            (serialNumbers.length > 0 && serialNumbers.every(sn => sn === ""))
                        ) ? (
                            <FontAwesomeIcon icon={faTimesCircle} style={{ color: 'red' }} />
                        ) : (
                            serialNumbers.length === Number(addFormData.NrBucati) &&
                                !serialNumbers.includes("") ? (
                                <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green' }} />
                            ) : serialNumbers.some(sn => sn !== "") && addFormData.NrBucati !== "" ? (
                                <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'orange' }} />
                            ) : null
                        )
                    }
                </div>

                <br />

                <button type="submit" className="button">Adaugă</button>

                <br />
                <br />

            </form>
        </div>
    )
}

export default DataBase;