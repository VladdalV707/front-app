import React, { useState, useEffect } from 'react'
import './DatabasePER.css';
import LoadingGES from './ComponenteDBGES/LoadingGES';
import { axios } from './axiosInstance';
import moment from 'moment';

const DatabasePER = ({ user, setUser }) => {

    const [obiecte, setObiecte] = useState([]);
    const [loading, setLoading] = useState(false);

    const postdata = {
        "UsernamePersonal": user,
        "UsernameStudent": null,
        "IdSubgestiune": null
    }

    useEffect(() => {
        setLoading(true);
        const url = "http://dnndev.me/api/Mifix.Api/ObiecteInventar/GetInventar";
        const fetchData = async () => {
            try {
                const res = await axios.post(url, postdata);
                console.log(res);
                let date = res.data.map((data) => ({
                    Id: data.Id,
                    Nume: data.Nume,
                    Serie: data.Serie,
                    DataPrimirii: data.DataPrimirii,
                    Gestiune: {
                        Id: data.Gestiune.Id,
                        Nume: data.Gestiune.Nume,
                        NrGestiune: data.Gestiune.NrGestiune
                    }
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
        // eslint-disable-next-line    
    }, []);

    return (
        <div className="outer-wrapper">
            {loading && <div style={{ display: 'block' }}><LoadingGES loading={loading} /></div>}
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th style={{ fontSize: "30px", backgroundColor: "lightgrey", position: "static" }} colSpan="4">
                                Tabel - Evidență Obiecte Inventar Personal
                            </th>
                        </tr>
                        <tr>
                            <th style={{ backgroundColor: "lightgrey" }}>Denumire Obiect</th>
                            <th style={{ backgroundColor: "lightgrey" }}>Serie</th>
                            <th style={{ backgroundColor: "lightgrey" }}>Data Primirii</th>
                            <th style={{ backgroundColor: "lightgrey" }}>Gestiune</th>
                        </tr>
                    </thead>
                    <tbody>
                        {obiecte.length > 0 ? (
                            obiecte?.map((obiect) => (
                                <tr key={obiect.Id}>
                                    <td>{obiect.Nume}</td>
                                    <td>
                                        {obiect.Serie ? obiect.Serie : "Acestă bucată nu are serie!"}
                                    </td>
                                    <td>{moment(obiect.DataPrimirii, 'YYYY-MM-DDTHH:mm:ss').format('DD.MM.YYYY')}</td>
                                    <td>{`${obiect.Gestiune.NrGestiune}. ${obiect.Gestiune.Nume}`}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">Nu aveți obiecte atribuite!!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>




    )
}

export default DatabasePER