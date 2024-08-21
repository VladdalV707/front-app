import React, { useState } from 'react';
import Modal from 'react-modal';
import './ObInvPopUp.css';

const PopupOI = ({ bon, showModal, setShowModal }) => {

  const [expandedRow, setExpandedRow] = useState(null);

  const toggleRowExpansion = (index) => {
    if (expandedRow === index) {
      setExpandedRow(null);
    } else {
      setExpandedRow(index);
    }
  };

  return (
    <Modal
      ariaHideApp={false}
      isOpen={showModal}
      onRequestClose={() => setShowModal(false)}
      style={{
        overlay: {
          backgroundColor: 'rgba(211, 211, 211, 0.5)',
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
      <div className="modal-content-bm">
        <div className="custom-table">
          <div className="thead">
            <div className="tr">
              <div className="th" style={{ backgroundColor: "lightgrey", fontSize: "20px", textAlign: "center", display: "inline-block" }} colSpan={5}>Detalii Obiecte</div>
            </div>
            <div className="tr">
              <div className="th" style={{ backgroundColor: "lightgrey" }}>N.O.</div>
              <div className="th" style={{ backgroundColor: "lightgrey" }}>Nr.Factură</div>
              <div className="th" style={{ backgroundColor: "lightgrey" }}>Furnizor</div>
              <div className="th" style={{ backgroundColor: "lightgrey" }}>Denumire Obiect</div>
              <div className="th" style={{ backgroundColor: "lightgrey" }}>NrBucăți</div>
            </div>
          </div>
          <div className="tbody">
            {bon?.ObiecteInventar.length > 0 ? (
              bon.ObiecteInventar.map((item, index) => (
                <React.Fragment key={item.Id}>
                  <div className="tr" key={index}>
                    <div className="td">{item.NumarDeOrdine}</div>
                    <div className="td" title={item.NrFactura}>{item.NrFactura}</div>
                    <div className="td" title={item.Furnizor}>{item.Furnizor}</div>
                    <div className="td" title={item.DenumireObiect}>{item.DenumireObiect}</div>
                    <div className="td" style={{ cursor: item.Serii ? "pointer" : "default", }} onClick={() => toggleRowExpansion(index)}>
                      {item.NrBucati}
                      {item.Serii && (expandedRow === index ? (
                        <div style={{ display: 'inline-block', marginLeft: '5px' }}>
                          &#9650;
                        </div>
                      ) : (
                        <div style={{ display: 'inline-block', marginLeft: '5px' }}>
                          &#9660;
                        </div>
                      ))}
                    </div>
                  </div>
                  {expandedRow === index && item.Serii && (
                    <div className="tr">
                      <div className="td" colSpan={3}>
                        <div className="custom-table">
                          <div className="thead">
                            <div className="tr">
                              <div className="th" style={{ backgroundColor: 'lightgrey' }}>Număr Obiect</div>
                              <div className="th" style={{ backgroundColor: 'lightgrey' }}>Seria Obiectului</div>
                            </div>
                          </div>
                          <div className="tbody">
                            {item.Serii.map((seria, index) => (
                              <div className="tr" key={index}>
                                <div className="td">{index + 1}</div>
                                <div className="td" title={seria}>{seria}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))
            ) : (
              <div className="tr">
                <div className="td" colSpan={5} style={{ textAlign: 'center' }}>
                  Acest bon nu conține obiecte!
                </div>
              </div>
            )
            }
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button type='button' style={{ marginTop: "20px" }} onClick={() => setShowModal(false)}>Închideți</button>
        </div>

      </div>
    </Modal>
  );
};

export default PopupOI;