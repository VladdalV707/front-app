import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import moment from 'moment';
import Modal from 'react-modal';

const PrintableComponent = React.forwardRef(({ bonuri, showPrint, setShowPrint }, ref) => {

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <Modal
      ariaHideApp={false}
      isOpen={showPrint}
      onRequestClose={() => setShowPrint(false)}
      style={{
        overlay: {
          backgroundColor: 'rgba(211, 211, 211, 0.5)',
          zIndex: '100000'
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
          maxWidth: '1200px',
          maxHeight: '80%'
        }
      }}
      ref={ref}
    >
      <div ref={componentRef}>
        <div className="printable-component" style={{ border: '2px solid #ccc', padding: '20px', maxWidth: '800px', backgroundColor: 'transparent' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Bon de Mișcare</h1>
            <p style={{ fontSize: '18px', margin: '0', textAlign: 'center' }}>Obiecte de Inventar</p>
          </div>
          <div style={{ fontSize: '18px', marginBottom: '10px', textAlign: 'center' }}>Magazie</div>
          <div style={{ fontSize: '16px', marginBottom: '10px', textAlign: 'center' }}>Gestiune: {bonuri.Gestiune.Nume}</div>
          <div style={{ fontSize: '16px', marginBottom: '20px', textAlign: 'right' }}>Data: {moment(bonuri.Data, 'YYYY-MM-DDTHH:mm:ss').format('DD.MM.YYYY')}</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'lightgrey' }}>
                <th style={{ width: '15%', textAlign: 'center', border: '2px solid black', padding: '8px', backgroundColor: 'lightgrey' }}>Nr.Crt</th>
                <th style={{ width: '52%', textAlign: 'left', border: '2px solid black', padding: '8px', backgroundColor: 'lightgrey' }}>Denumire Obiect</th>
                <th style={{ width: '18%', textAlign: 'center', border: '2px solid black', padding: '8px', backgroundColor: 'lightgrey' }}>Nr.Ord.</th>
                <th style={{ width: '15%', textAlign: 'center', border: '2px solid black', padding: '8px', backgroundColor: 'lightgrey' }}>Bucăți</th>
              </tr>
            </thead>
            <tbody>
              {bonuri.ObiecteInventar.map((obiect, index) => (
                <tr key={obiect.Id}>
                  <td style={{ width: '15%', textAlign: 'center', border: '2px solid black', padding: '8px' }}>{index + 1}</td>
                  <td style={{ width: '52%', textAlign: 'left', border: '2px solid black', padding: '8px' }}>{obiect.DenumireObiect}</td>
                  <td style={{ width: '18%', textAlign: 'center', border: '2px solid black', padding: '8px' }}>{obiect.NumarDeOrdine}</td>
                  <td style={{ width: '15%', textAlign: 'center', border: '2px solid black', padding: '8px' }}>{obiect.NrBucati}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ height: '50px' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '20px' }}>
            <div style={{ fontSize: '16px', marginLeft: '20px' }}>Întocmit De: {bonuri.IntocmitDe}</div>
            <div style={{ fontSize: '16px', marginRight: '20px' }}>Primit De: {bonuri.PrimitDe}</div>
          </div>
          <div style={{ height: '100px' }}></div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <button type='button' style={{ marginRight: '10px' }} onClick={() => { handlePrint(); setShowPrint(false); }}>Printează</button>
        <button type='button' onClick={() => setShowPrint(false)}>Închide</button>
      </div>
    </Modal>
  );
});

export default PrintableComponent;
