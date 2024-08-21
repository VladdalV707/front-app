import React, { useState } from 'react'
import Modal from 'react-modal';
import './DistPicker.css';
import PersonalDest from './Destinatari/PersonalDest';
import StudentDest from './Destinatari/StudentDest';
import GestPicker from './GestPicker';

const DestinatarPicker = ({ showDP, setShowDP, setDestinatar, postdata, user, setPostData }) => {

    const [showPersonal, setShowPersonal] = useState(false);
    const [showGP, setShowGP] = useState(false);
    const [showStudent, setShowStudent] = useState(false);

    const [selectedDist, setSelectedDist] = useState('Personal');

    const handleSelectChange = (e) => {
        const value = e.target.value;
        switch (value) {
            case 'Personal':
                console.log('Ați ales să vizualizați obiectele de la un personal!');
                setSelectedDist('Personal');
                break;
            case 'Subgestiune':
                console.log('Ați ales să vizualizați obiectele de la o subgestiune!');
                setSelectedDist('Subgestiune');
                break;
            case 'Student':
                console.log('Ați ales să vizualizați obiectele de la un student!');
                setSelectedDist('Student');
                break;
            default:
                setSelectedDist('Personal');
        }
    };

    const handleButtonClick = () => {
        if (selectedDist === 'Personal') {
            setShowPersonal(true);
        } else if (selectedDist === 'Subgestiune') {
            setShowGP(true);
        } else if (selectedDist === 'Student') {
            setShowStudent(true);
        }
    };

    return (
        <Modal
            ariaHideApp={false}
            isOpen={showDP}
            onRequestClose={() => setShowDP(false)}
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
                },
            }}
        >
            <div className="modal-content-dp">
                <h2 style={{ textAlign: 'center', marginBottom: '25px' }}>Formular de alegere a destinatarului</h2>
                <label>
                    Alegeți Destinatarul:
                    <select onChange={handleSelectChange}>
                        <option value="Personal">Personal</option>
                        <option value="Subgestiune">Subgestiune</option>
                        <option value="Student">Student</option>
                    </select>
                </label>
                <div className="button-container">
                    <button type="button" onClick={handleButtonClick}>Alegeți</button>
                    <button type="button" onClick={() => setShowDP(false)}>
                        Anulați
                    </button>
                </div>

                {showPersonal ? <PersonalDest showPersonal={showPersonal} setShowPersonal={setShowPersonal} setShowDP={setShowDP} setDestinatar={setDestinatar} setPostData={setPostData} /> : null}
                {showGP ? <GestPicker showGP={showGP} setShowGP={setShowGP} setShowDP={setShowDP} user={user} setDestinatar={setDestinatar} setPostData={setPostData} /> : null}
                {showStudent ? <StudentDest showStudent={showStudent} setShowStudent={setShowStudent} setShowDP={setShowDP} setDestinatar={setDestinatar} setPostData={setPostData} /> : null}

            </div>
        </Modal>
    )
}

export default DestinatarPicker