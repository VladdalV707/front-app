import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { axios } from '../axiosInstance';
import './BucPopUp.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';
import UndistributedObj from './UndistributedObj';
import Loading from './Loading';

const PopupBUC = ({ obiect, showModal, setShowModal }) => {

  const [loading, setLoading] = useState(false);
  const [detalii, setDetalii] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [showundistributed, setShowUndistributed] = useState(false);

  useEffect(() => {
    let cancelTokenSource;
    if (showModal) {
      cancelTokenSource = axios.CancelToken.source();
      setLoading(true);
      axios
        .get(`http://dnndev.me/api/Mifix.Api/ObiecteInventar/Details?Id=${obiect.Id}`, { cancelToken: cancelTokenSource.token })
        .then((response) => {
          setDetalii(response.data);
          console.log("Detaliile Pentru Obiectul Selectat : \n", response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
    return () => {
      if (cancelTokenSource) {
        cancelTokenSource.cancel("Requestul de detalii obiecte a fost anulat!");
      }
    };
    // eslint-disable-next-line
  }, [showModal]);


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
      {<div style={{ display: 'block' }}><Loading loading={loading} /></div>}

      <div className="modal-content-oi" >
        <div className="custom-table">
          <div className="thead">
            <div className="tr">
              <div className="th" style={{ backgroundColor: 'lightgrey' }}>Denumire Obiect</div>
              <div className="th" colSpan="2" title={obiect.DenumireObiect}>{obiect.DenumireObiect}</div>
            </div>
            <div className="tr">
              <div className="th" style={{ backgroundColor: 'lightgrey' }}>Bucăți Totale</div>
              <div className="th" colSpan="2">{obiect.NrBucati}</div>
            </div>
            <div className="tr">
              <div className="th" style={{ backgroundColor: 'lightgrey' }}>Bucăți Nedistribuite</div>
              <div className="th" colSpan="2">
                {detalii?.NrObiecteNedistribuite ?? 'Se încarcă, așteptați...'}
                {detalii?.NrObiecteNedistribuite > 0 && detalii?.SeriiObiecteNedistribuite && (
                  <div style={{ display: 'inline-block', marginLeft: '5px', cursor: 'pointer', fontSize: '0.7rem' }}>
                    <FontAwesomeIcon icon={faList} onClick={() => setShowUndistributed(true)} />
                    {showundistributed && <UndistributedObj showundistributed={showundistributed} setShowUndistributed={setShowUndistributed} detalii={detalii.SeriiObiecteNedistribuite} />}
                  </div>
                )}
              </div>
            </div>
            <div className="tr">
              <div className="th" style={{ backgroundColor: 'lightgrey', textAlign: 'center' }}>Detalii Obiecte Distribuite</div>
            </div>
            <div className="tr">
              <div className="th" style={{ backgroundColor: 'lightgrey' }}>Buc. Distribuite</div>
              <div className="th" style={{ backgroundColor: 'lightgrey' }}>Gestiune Destinație</div>
              <div className="th" style={{ backgroundColor: 'lightgrey' }}>Nr.Bon</div>
            </div>
          </div>
          <div className="tbody">
            {detalii?.DetaliiObiecteDistribuite.length > 0 ? (
              detalii.DetaliiObiecteDistribuite.map((detaliu, index) => (
                <React.Fragment key={detaliu.IdBonDeMiscare}>
                  <div className="tr">
                    <div className="td" style={{ cursor: detaliu.Serii ? "pointer" : "default", }} onClick={() => toggleRowExpansion(index)}>
                      {detaliu.NrBucati}
                      {detaliu.Serii && (expandedRow === index ? (
                        <div style={{ display: 'inline-block', marginLeft: '5px' }}>
                          &#9650;
                        </div>
                      ) : (
                        <div style={{ display: 'inline-block', marginLeft: '5px' }}>
                          &#9660;
                        </div>
                      ))}
                    </div>
                    <div className="td" title={detaliu.Gestiune}>{detaliu.Gestiune}</div>
                    <div className="td">{`BM ${detaliu.NrBon}`}</div>
                  </div>
                  {expandedRow === index && detaliu.Serii && (
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
                            {detaliu.Serii.map((seria, index) => (
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
                <div className="td" colSpan={3} style={{ textAlign: 'center' }}>
                  Nu există obiecte distribuite de afișat!
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button type='button' style={{ marginTop: '20px' }} onClick={() => setShowModal(false)}>
            Închideți
          </button>
        </div>

      </div>
    </Modal>
  );
};

export default PopupBUC;
