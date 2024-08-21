import React, { useState } from 'react';
import Modal from 'react-modal';
import './SelectGestiuni.css';
import ConfirmSelect from './ConfirmSelect';

const SelectGestiuni = ({ showGestiuni, setShowGestiuni, setIsClicked, departament, setIsChosen, addFormData, setAddFormData }) => {

    const [showConfirm, setShowConfirm] = useState(false);
    const [gestiuneToChoose, setGestiuneToChoose] = useState(null);

    const handleChoose = (gestiune) => {
        setGestiuneToChoose(gestiune);
        setShowConfirm(true);
    }

    return (
        <Modal
            ariaHideApp={false}
            isOpen={showGestiuni}
            onRequestClose={() => setShowGestiuni(false)}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
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
                    maxHeight: '100vh',
                }
            }}
        >

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginBottom: '10px' }}>
                <h2 style={{ margin: 0, marginBottom: '10px' }}>Departament:</h2>
                <h4 style={{ margin: 0, border: '1px solid black', padding: '5px', wordWrap: 'break-word', textAlign: 'center', maxWidth: '100%' }}>{departament.Nume}</h4>
            </div>

            <div className="modal-content-choose" >
                <div className="custom-table">
                    <div className="thead">
                        <div className="tr">
                            <div className="th" style={{ backgroundColor: 'lightgrey', textAlign: 'center' }}>Nr. Gestiune + Denumire Gestiune</div>
                            <div className="th" style={{ backgroundColor: 'lightgrey', textAlign: 'center' }}>Selectare Gestiune</div>
                        </div>
                    </div>
                    <div className="tbody">
                        {departament?.Gestiuni.map((gestiune) => (
                            <React.Fragment key={gestiune.Id}>
                                <div className="tr">
                                    <div className="td" style={{ textAlign: 'center' }} title={`${gestiune.NrGestiune}. ${gestiune.Nume}`}>{gestiune.NrGestiune}. {gestiune.Nume}</div>
                                    <div className="td" style={{ display: 'flex', justifyContent: 'center' }}>
                                        {gestiune.Gestionar ? (
                                            <button type="button" onClick={() => handleChoose(gestiune)}>
                                                Selectați
                                            </button>
                                        ) : (
                                            <div>Gestiunea nu are un gestionar atribuit!</div>
                                        )}
                                    </div>
                                </div>
                                {showConfirm && gestiuneToChoose?.Id === gestiune.Id && (
                                    <ConfirmSelect
                                        showConfirm={showConfirm}
                                        setShowConfirm={setShowConfirm}
                                        gestiune={gestiune}
                                        setIsClicked={setIsClicked}
                                        setShowGestiuni={setShowGestiuni}
                                        setIsChosen={setIsChosen}
                                        addFormData={addFormData}
                                        setAddFormData={setAddFormData}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                </div>

                <button type='button' style={{ marginTop: '20px' }} onClick={() => setShowGestiuni(false)}>
                    Închideți
                </button>
            </div>

        </Modal>
    )
}

export default SelectGestiuni