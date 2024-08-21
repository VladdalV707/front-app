import React from 'react';
import Modal from 'react-modal';
import './CasateObj.css';

const CasateObj = ({ detalii, showObCasate, setShowObCasate }) => {
    return (
        <Modal
            ariaHideApp={false}
            isOpen={showObCasate}
            onRequestClose={() => setShowObCasate(false)}
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
            <div className="modal-content-co">
                <div className="custom-table">
                    <div className="thead">
                        <div className="tr">
                            <div className="th" style={{ backgroundColor: 'lightgrey', textAlign: 'center' }}>Detalii Obiecte Casate</div>
                        </div>
                        <div className="tr">
                            <div className="th" style={{ backgroundColor: 'lightgrey' }}>Număr Obiect</div>
                            <div className="th" style={{ backgroundColor: 'lightgrey' }}>Seria Obiectului</div>
                        </div>
                    </div>
                    <div className="tbody">
                        {detalii.map((obiect, index) => (
                            <div className="tr" key={obiect.Id}>
                                <div className="td">{index + 1}</div>
                                <div className="td" title={obiect.Serie}>{obiect.Serie}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default CasateObj;
