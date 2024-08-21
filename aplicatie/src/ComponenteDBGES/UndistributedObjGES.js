import React, { useState } from 'react'
import Modal from 'react-modal';
import './UndistributedObjGES.css';
import DistPicker from './DistPicker';
import Casare from './Casare';

const UndistributedObjGES = ({ showundistributed, setShowUndistributed, detalii, user, setShowModal, gestiune }) => {

    const [showPicker, setShowPicker] = useState(false);
    const [showCasare, setShowCasare] = useState(false);

    return (
        <Modal
            ariaHideApp={false}
            isOpen={showundistributed}
            onRequestClose={() => setShowUndistributed(false)}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 9999,
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
                    width: '100%',
                    maxWidth: '900px',
                    maxHeight: '80%',
                }
            }}
        >
            <div className="modal-content-uo-ges" >
                <div className="custom-table">
                    <div className="thead">
                        <div className="tr">
                            <div className="th" style={{ backgroundColor: 'lightgrey' }}>Număr Obiect</div>
                            <div className="th" style={{ backgroundColor: 'lightgrey' }}>Seria Obiectului</div>
                            <div className="th" style={{ backgroundColor: 'lightgrey', textAlign: 'center' }}>Distribuire</div>
                            <div className="th" style={{ backgroundColor: 'lightgrey', textAlign: 'center' }}>Casare</div>
                        </div>
                    </div>
                    <div className="tbody">
                        {detalii.map((obi, index) => (
                            <div className="tr" key={index}>
                                <div className="td">{index + 1}</div>
                                <div className="td" title={obi.Serie}>{obi.Serie}</div>
                                <div className="td" style={{ display: 'flex', justifyContent: 'center' }}>
                                    <button type="button" onClick={() => setShowPicker(true)}>Distribuiți Obiectul</button>
                                </div>
                                {showPicker && (
                                    <DistPicker
                                        user={user}
                                        obiect={obi}
                                        showPicker={showPicker}
                                        setShowPicker={setShowPicker}
                                        setShowUndistributed={setShowUndistributed}
                                        setShowModal={setShowModal}
                                        gestiune={gestiune}
                                    />
                                )}
                                <div className="td" style={{ display: 'flex', justifyContent: 'center' }}>
                                    <button type="button" onClick={() => setShowCasare(true)}>Casați Obiectul</button>
                                </div>
                                {showCasare && (
                                    <Casare
                                        user={user}
                                        obiect={obi}
                                        showCasare={showCasare}
                                        setShowCasare={setShowCasare}
                                        setShowUndistributed={setShowUndistributed}
                                        setShowModal={setShowModal}
                                        gestiune={gestiune}
                                    />
                                )}

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default UndistributedObjGES