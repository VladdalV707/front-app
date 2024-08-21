import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { axios } from '../axiosInstance';
import './PopupBucGES.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';
import LoadingGES from './LoadingGES';
import UndistributedObjGES from './UndistributedObjGES';
import moment from 'moment';
import IOReturn from './IOReturn';
import DistPicker2 from './DistPicker2';
import Casare2 from './Casare2';
import CasateObj from './CasateObj';

const PopupBucGES = ({ showModal, setShowModal, obiect, user, gestiune }) => {

    const [loading, setLoading] = useState(false);
    const [detalii, setDetalii] = useState(null);
    const [obcasate, setObCasate] = useState(null);
    const [showundistributed, setShowUndistributed] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const [showReturn, setShowReturn] = useState(false);
    const [showCasare, setShowCasare] = useState(false);
    const [showObCasate, setShowObCasate] = useState(false);

    useEffect(() => {
        if (showModal) {
            setLoading(true);
            axios
                .get(`http://dnndev.me/api/Mifix.Api/Gestiuni/DetaliiObiecteInventar?idTipObiectInventar=${obiect.Id}&Id=${gestiune.Id}`)
                .then((response) => {
                    const { ObiecteNedistribuite, ObiecteDistribuite } = response.data;

                    const filteredDetalii = ObiecteNedistribuite.filter(obj => !obj.EsteCasat);
                    const filteredObcasate = ObiecteNedistribuite.filter(obj => obj.EsteCasat);

                    const detalii = {
                        ObiecteNedistribuite: filteredDetalii,
                        ObiecteDistribuite
                    };

                    setDetalii(detalii);
                    setObCasate(filteredObcasate);
                    console.log("Detaliile Pentru Obiectul Selectat : \n", detalii);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    if (error.response && error.response.status === 409) {
                        alert(error.response.data.Message);
                    } else {
                        alert("Operația de primire a detaliilor a eșuat!");
                    }
                    setLoading(false);
                });
        }
        // eslint-disable-next-line
    }, [showModal]);


    const handleDetaliiObiecteCasate = () => {
        if (obcasate.length === 0) {
            return;
        }

        const hasNullSerie = obcasate[0].Serie === null;
        const objectLabel = obcasate.length === 1 ? 'obiect' : 'obiecte';
        hasNullSerie
            ? alert(`Ați casat ${obcasate.length} ${objectLabel}!`)
            : setShowObCasate(true);
    };

    return (
        <Modal
            ariaHideApp={false}
            isOpen={showModal}
            onRequestClose={() => setShowModal(false)}
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
                    padding: '20px',
                    border: 'none',
                    borderRadius: '5px',
                    overflow: 'auto',
                    width: '70%',
                    maxHeight: '80%',
                }
            }}
        >
            {<div style={{ display: 'block' }}><LoadingGES loading={loading} /></div>}

            <div className="modal-content-oi-ges" >
                <div className="custom-table">
                    <div className="thead">
                        <div className="tr">
                            <div className="th" style={{ backgroundColor: 'lightgrey' }}>Denumire Obiect</div>
                            <div className="th" colSpan="2" title={obiect.DenumireObiect}>{obiect.DenumireObiect}</div>
                        </div>
                        <div className="tr">
                            <div className="th" style={{ backgroundColor: 'lightgrey' }}>Bucăți Totale</div>
                            <div className="th" colSpan="2">{obiect.NrBucati}
                                {obcasate && obcasate.length > 0 && (
                                    <button
                                        type="button"
                                        style={{ marginLeft: '5px' }}
                                        onClick={handleDetaliiObiecteCasate}
                                    >
                                        Detalii Obiecte Casate
                                    </button>
                                )}
                            </div>
                            {showObCasate && <CasateObj showObCasate={showObCasate} setShowObCasate={setShowObCasate} detalii={obcasate} />}
                        </div>
                        <div className="tr">
                            <div className="th" style={{ backgroundColor: 'lightgrey' }}>Bucăți Nedistribuite Necasate</div>
                            <div className="th" colSpan="2">
                                {detalii?.ObiecteNedistribuite.length ?? 'Se încarcă, așteptați...'}
                                {detalii?.ObiecteNedistribuite.length > 0 && (
                                    <div style={{ display: 'inline-block', marginLeft: '5px', cursor: 'pointer', fontSize: '0.7rem' }}>
                                        {detalii.ObiecteNedistribuite[0].Serie ? (
                                            <>
                                                <FontAwesomeIcon icon={faList} onClick={() => setShowUndistributed(true)} />
                                                {showundistributed && (
                                                    <UndistributedObjGES
                                                        showundistributed={showundistributed}
                                                        setShowUndistributed={setShowUndistributed}
                                                        detalii={detalii.ObiecteNedistribuite}
                                                        user={user}
                                                        setShowModal={setShowModal}
                                                        gestiune={gestiune}
                                                    />
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <button type="button" style={{ marginRight: '10px', marginLeft: '5px' }} onClick={() => setShowPicker(true)}>Distribuiți</button>
                                                {showPicker && (
                                                    <DistPicker2
                                                        showPicker={showPicker}
                                                        setShowPicker={setShowPicker}
                                                        user={user}
                                                        setShowModal={setShowModal}
                                                        gestiune={gestiune}
                                                        ID={detalii?.ObiecteNedistribuite[0].Id}
                                                    />
                                                )}
                                                <button type="button" onClick={() => setShowCasare(true)}>Casați</button>
                                                {showCasare && (
                                                    <Casare2
                                                        showCasare={showCasare}
                                                        setShowCasare={setShowCasare}
                                                        user={user}
                                                        setShowModal={setShowModal}
                                                        gestiune={gestiune}
                                                        ID={detalii?.ObiecteNedistribuite[0].Id}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="tr">
                            <div className="th" style={{ backgroundColor: 'lightgrey', textAlign: 'center' }}>Detalii Obiecte Distribuite</div>
                        </div>
                        <div className="tr">
                            <div className="th" style={{ backgroundColor: 'lightgrey' }}>Nr.Obiect</div>
                            <div className="th" style={{ backgroundColor: 'lightgrey' }}>Serie Obiect</div>
                            <div className="th" style={{ backgroundColor: 'lightgrey' }}>Destinație Obiect</div>
                            <div className="th" style={{ backgroundColor: 'lightgrey' }}>Data Distribuirii</div>
                            <div className="th" style={{ backgroundColor: 'lightgrey' }} title='Numărul bonului de pe care obiectul a ajuns în gestiune (de la contabilul de gestiuni).'>Nr.Bon</div>
                            <div className="th" style={{ backgroundColor: 'lightgrey', textAlign: 'center' }}>Opțiuni</div>
                        </div>
                    </div>
                    <div className="tbody">
                        {detalii?.ObiecteDistribuite.length > 0 ? (
                            detalii.ObiecteDistribuite.map((detaliu, index) => (
                                <React.Fragment key={detaliu.IdObiectInventar}>
                                    <div className="tr">
                                        <div className="td">{index + 1}</div>
                                        <div className="td" title={detaliu.Serie ? detaliu.Serie : "Acestă bucată nu are serie!"}>
                                            {detaliu.Serie ? detaliu.Serie : "Acestă bucată nu are serie!"}
                                        </div>
                                        <div className="td" title={`${detaliu.Personal?.Nume || ''} ${detaliu.Personal?.Prenume || ''}${detaliu.Student?.NumeIntreg || ''}${detaliu.Subgestiune?.Nume || ''}`}>
                                            {detaliu.Personal !== null && `${detaliu.Personal.Nume} ${detaliu.Personal.Prenume}`}
                                            {detaliu.Student !== null && `${detaliu.Student?.NumeIntreg}`}
                                            {detaliu.Subgestiune !== null && `${detaliu.Subgestiune.Nume}`}
                                        </div>
                                        <div className="td">{moment(detaliu.Data, 'YYYY-MM-DDTHH:mm:ss').format('DD.MM.YYYY')}</div>
                                        <div className="td">{`BM ${detaliu.NrBonDeMiscare}`}</div>
                                        <div className="td" style={{ display: 'flex', justifyContent: 'center' }}>
                                            <button type="button" onClick={() => setShowReturn(true)}>Returnați Obiectul</button>
                                        </div>
                                        {showReturn && (
                                            <IOReturn
                                                user={user}
                                                setShowReturn={setShowReturn}
                                                showReturn={showReturn}
                                                detaliu={detaliu}
                                                setShowModal={setShowModal}
                                            />
                                        )}
                                    </div>
                                </React.Fragment>
                            ))
                        ) : (
                            <div className="tr">
                                <div className="td" colSpan={6} style={{ textAlign: 'center' }}>
                                    Nu există obiecte distribuite de afișat!
                                </div>
                            </div>
                        )
                        }
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button type='button' style={{ marginTop: '20px' }} onClick={() => setShowModal(false)}>
                        Închideți
                    </button>
                </div>

            </div>


        </Modal>
    )
}

export default PopupBucGES