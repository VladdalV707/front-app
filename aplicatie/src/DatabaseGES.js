import React, { useState, useEffect, Fragment } from 'react';
import GestiunePicker from './ComponenteDBGES/GestiunePicker';
import LoadingGES from './ComponenteDBGES/LoadingGES';
import './DatabaseGES.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faBars } from '@fortawesome/free-solid-svg-icons';
import ReadOnlyRowGES from './ComponenteDBGES/ReadOnlyRowGES';
import { axios } from './axiosInstance';
import DrawerGES from './ComponenteDBGES/DrawerGES';

const DatabaseGES = ({ user, setUser }) => {

    const [gestiune, setGestiune] = useState({
        Id: '',
        Nume: '',
        NrGestiune: ''
    });

    useEffect(() => {
        axios
            .get(`http://dnndev.me/api/Mifix.Api/Gestiuni/AleMele`)
            .then((response) => {
                setGestiune(response.data[0]);
            })
            .catch((error) => {
                console.error(error);
            });

        // eslint-disable-next-line    
    }, []);


    const [showGP, setShowGP] = useState(false);
    const [obiecte, setObiecte] = useState([]);
    const [loading, setLoading] = useState(false);

    /*Variabile Opțiuni*/
    const [showRows, setShowRows] = useState(false);

    const toggleRows = () => {
        setShowRows(!showRows);
    };

    const [filtruobiect, setFiltruObiect] = useState("");

    const [OptionsData, setOptionsData] = useState({
        FiltruObiect: ''
    });
    /*--*/

    /*Opțiuni*/

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

        setFiltruObiect('');

        setOptionsData({
            FiltruObiect: ''
        });

    };

    const handleFiltruObiect = (event) => {
        event.preventDefault();

        const FiltruObiect = OptionsData.FiltruObiect;

        if (!FiltruObiect) {
            alert("Filtrul numelui de obiect nu poate fi lăsat liber!");
            return;
        }

        if (FiltruObiect.length > 200) {
            alert("Filtrul numelui de obiect nu poate depăși 200 de caractere!");
            return;
        }

        setFiltruObiect(FiltruObiect);
    }

    /*Variabile Sertar*/
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const openDrawer = () => {
        setIsDrawerOpen(true);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
        setDrawerClosed(true);
    };

    const [drawerClosed, setDrawerClosed] = useState(false);

    /*--*/

    useEffect(() => {
        if (gestiune.Id) {
            setLoading(true);
            const url = `http://dnndev.me/api/Mifix.Api/Gestiuni/ObiecteInventar?denumireObiect=${filtruobiect}&Id=${gestiune.Id}`;
            const fetchData = async () => {
                try {
                    const res = await axios.get(url);
                    console.log(res);
                    let date = res.data.TipuriObiecteInventar.map(data => ({
                        Id: data.Id,
                        NumarDeOrdine: data.NumarDeOrdine,
                        DenumireObiect: data.DenumireObiect,
                        NrBucati: data.NrBucati
                    }));
                    console.log("Datele primite sunt:\n", date);
                    setObiecte(date);
                    setLoading(false);
                } catch (error) {
                    console.log(error);
                    setLoading(false);
                }
            };
            fetchData();
        }

        // eslint-disable-next-line    
    }, [gestiune.Id, filtruobiect]);


    useEffect(() => {
        if (drawerClosed) {
            setLoading(true);
            const url = `http://dnndev.me/api/Mifix.Api/Gestiuni/ObiecteInventar?denumireObiect=${filtruobiect}&Id=${gestiune.Id}`;
            const fetchData = async () => {
                try {
                    const res = await axios.get(url);
                    console.log(res);
                    let date = res.data.TipuriObiecteInventar.map(data => ({
                        Id: data.Id,
                        NumarDeOrdine: data.NumarDeOrdine,
                        DenumireObiect: data.DenumireObiect,
                        NrBucati: data.NrBucati
                    }));
                    console.log("Datele primite sunt:\n", date);
                    setObiecte(date);
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


    return (
        <div className="outer-wrapper">
            {<div style={{ display: 'block' }}><LoadingGES loading={loading} /></div>}
            <div className="table-wrapper">
                <table>

                    <thead >

                        <tr>
                            <th style={{ fontSize: "30px", backgroundColor: "lightgrey", position: "static" }} colSpan="3">
                                {gestiune.Id ? (
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FontAwesomeIcon icon={faGear} style={{ cursor: "pointer", marginRight: "5px", fontSize: "32px" }} onClick={toggleRows} title='Vedeți mai multe opțiuni!' />
                                        Gestiune: {gestiune.NrGestiune}. {gestiune.Nume}
                                    </span>
                                ) : (
                                    <span>Se încarcă datele pentru gestiune...</span>
                                )}
                            </th>
                        </tr>
                        {showRows && (
                            <tr>
                                <th style={{ fontSize: "28px", backgroundColor: "lightgrey" }} colSpan="3">
                                    {gestiune.Id ? (
                                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            Subgestiuni pentru gestiunea curentă:
                                            <FontAwesomeIcon icon={faBars} style={{ marginLeft: '10px', color: 'black', cursor: 'pointer', fontSize: '24px' }} onClick={openDrawer} title='Apăsați pentru a deschide meniul subgestiunilor!' />
                                        </span>
                                    ) : (
                                        <span>A apărut o eroare la încărcarea gestiunii!</span>
                                    )}
                                </th>
                            </tr>
                        )}
                        <tr style={{ display: showRows ? 'table-row' : 'none' }}>
                            <th style={{ backgroundColor: "lightgrey" }} colSpan="1">Gestiune</th>
                            <th style={{ backgroundColor: "lightgrey" }} colSpan="1">Obiect-Filtru</th>
                            <th style={{ backgroundColor: "lightgrey" }} colSpan="1">Opțiuni</th>
                        </tr>

                        <tr style={{ display: showRows ? 'table-row' : 'none' }}>
                            <th style={{ backgroundColor: "lightgrey" }} colSpan="1">
                                <button type='button' onClick={() => setShowGP(true)} title='Buton de comutare între gestiuni!'>
                                    Selectați Gestiunea
                                </button>
                            </th>

                            <th style={{ backgroundColor: "lightgrey" }} colSpan="1">
                                <div className='input-container'>
                                    <input
                                        type="text"
                                        name="FiltruObiect"
                                        placeholder="Filtru-Obiect"
                                        onChange={handleOptionsDataChange}
                                        value={OptionsData.FiltruObiect}
                                    />
                                </div>
                            </th>


                            <th style={{ backgroundColor: "lightgrey" }} colSpan="1">
                                <button type='button' onClick={handleFiltruObiect} style={{ marginRight: '10px' }}>
                                    Adăugați Filtrul
                                </button>
                                <button type='button' onClick={handleClearObi}>
                                    Ștergeți Filtrul
                                </button>
                            </th>

                        </tr>

                        <tr style={{ display: showRows ? 'table-row' : 'none' }}>
                            <th style={{ backgroundColor: "lightgrey" }}>N.O.</th>
                            <th style={{ backgroundColor: "lightgrey" }}>Denumire Obiect</th>
                            <th style={{ backgroundColor: "lightgrey" }}>BUC</th>

                        </tr>

                        <tr style={{ display: showRows ? 'none' : 'table-row' }}>
                            <th style={{ backgroundColor: "lightgrey" }}>N.O.</th>
                            <th style={{ backgroundColor: "lightgrey" }}>Denumire Obiect</th>
                            <th style={{ backgroundColor: "lightgrey" }}>BUC</th>
                        </tr>

                    </thead>

                    <tbody>
                        {gestiune.Id ? (
                            obiecte.length ? (
                                obiecte?.map((obiect) => (
                                    <Fragment key={obiect.Id}>
                                        <ReadOnlyRowGES obiect={obiect} user={user} gestiune={gestiune} />
                                    </Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3">În gestiunea selectată nu există obiecte de afișat!</td>
                                </tr>
                            )
                        ) : (
                            <tr>
                                <td colSpan="3">Nu ați selectat gestiunea!</td>
                            </tr>
                        )}
                    </tbody>


                </table>



            </div>

            {showGP ? <GestiunePicker user={user} gestiune={gestiune} setGestiune={setGestiune} showGP={showGP} setShowGP={setShowGP} /> : null}

            {isDrawerOpen ? <DrawerGES onClose={closeDrawer} isDrawerOpen={isDrawerOpen} gestiune={gestiune} user={user} /> : null}

        </div >

    )
}

export default DatabaseGES;