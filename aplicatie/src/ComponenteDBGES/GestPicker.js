import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { axios } from '../axiosInstance';
import SubgestiuneDest from './Destinatari/SubgestiuneDest';

const GestPicker = ({ showGP, setShowGP, setShowDP, setPostData, user, setDestinatar }) => {

    const [gestiune, setGestiune] = useState({
        Id: '',
        Nume: '',
        NrGestiune: ''
    });
    const [gestiuni, setGestiuni] = useState([]);
    const [selectedGestiune, setSelectedGestiune] = useState({
        Id: '',
        Nume: '',
        NrGestiune: ''
    });
    const [showSubgestiune, setShowSubgestiune] = useState(false);

    useEffect(() => {
        if (showGP) {
            axios
                .get(`http://dnndev.me/api/Mifix.Api/Gestiuni/AleMele`)
                .then((response) => {
                    setGestiuni(response.data);
                    setSelectedGestiune(response.data[0]);
                })
                .catch((error) => {
                    console.error(error);
                    if (error.response && error.response.status === 409) {
                        alert(error.response.data.Message);
                    } else {
                        alert("Operația de primire a gestiunilor a eșuat!");
                    }
                });
        }
        // eslint-disable-next-line    
    }, [showGP]);

    const handleSelectChange = (event) => {
        console.log('Selected Gestiune:', selectedGestiune);
        const selectedId = event.target.value;
        const selected = gestiuni.find((g) => g.Id === selectedId);
        setSelectedGestiune(selected);
    };


    const handleSelectGestiune = () => {
        const selected = selectedGestiune;
        setGestiune({
            Id: selected.Id,
            Nume: selected.Nume,
            NrGestiune: selected.NrGestiune,
        });
        setShowSubgestiune(true);
    };

    const handleCancel = () => {
        setShowGP(false);
    };

    return (
        <Modal
            ariaHideApp={false}
            isOpen={showGP}
            onRequestClose={handleCancel}
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
                    maxHeight: '80%',
                },
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <p>Username Gestionar: {user}</p>
                    <p>Selectați Gestiunea:</p>
                    <select value={selectedGestiune.Id} onChange={handleSelectChange}>
                        {gestiuni?.map((g) => (
                            <option key={g.Id} value={g.Id}>
                                {g.NrGestiune}. {g.Nume}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button type='button' onClick={handleSelectGestiune} style={{ marginRight: '20px' }}>Selectați</button>
                    <button type='button' onClick={handleCancel}>Anulați</button>
                </div>

                {showSubgestiune ? <SubgestiuneDest showSubgestiune={showSubgestiune} setShowSubgestiune={setShowSubgestiune} setShowGP={setShowGP} setShowDP={setShowDP} setPostData={setPostData} gestiune={gestiune} setDestinatar={setDestinatar} /> : null}
            </div>

        </Modal>
    )
}

export default GestPicker