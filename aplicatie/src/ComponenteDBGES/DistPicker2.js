import React, { useState } from 'react'
import Modal from 'react-modal';
import PersonalDist2 from './PersonalDist2';
import SubgestiuneDist2 from './SubgestiuneDist2';
import StudentDist2 from './StudentDist2';
import './DistPicker.css';

const DistPicker2 = ({ showPicker, setShowPicker, user, setShowModal, gestiune, ID }) => {

    const [showPersonal, setShowPersonal] = useState(false);
    const [showSubgestiune, setShowSubgestiune] = useState(false);
    const [showStudent, setShowStudent] = useState(false);

    const [selectedDist, setSelectedDist] = useState('Personal');

    const handleSelectChange = (e) => {
        const value = e.target.value;
        switch (value) {
            case 'Personal':
                console.log('Ați ales să trimiteți obiectul unui personal!');
                setSelectedDist('Personal');
                break;
            case 'Subgestiune':
                console.log('Ați ales să trimiteți obiectul la o subgestiune!');
                setSelectedDist('Subgestiune');
                break;
            case 'Student':
                console.log('Ați ales să trimiteți obiectul la un student!');
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
            setShowSubgestiune(true);
        } else if (selectedDist === 'Student') {
            setShowStudent(true);
        }
    };

    return (
        <Modal
            ariaHideApp={false}
            isOpen={showPicker}
            onRequestClose={() => setShowPicker(false)}
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
                    <button type="button" onClick={() => setShowPicker(false)}>
                        Anulați
                    </button>
                </div>

                {showPersonal ? <PersonalDist2 user={user} ID={ID} showPersonal={showPersonal} setShowPersonal={setShowPersonal} setShowPicker={setShowPicker} setShowModal={setShowModal} gestiune={gestiune} /> : null}
                {showSubgestiune ? <SubgestiuneDist2 user={user} ID={ID} showSubgestiune={showSubgestiune} setShowSubgestiune={setShowSubgestiune} setShowPicker={setShowPicker} setShowModal={setShowModal} gestiune={gestiune} /> : null}
                {showStudent ? <StudentDist2 user={user} ID={ID} showStudent={showStudent} setShowStudent={setShowStudent} setShowPicker={setShowPicker} setShowModal={setShowModal} gestiune={gestiune} /> : null}

            </div>
        </Modal>
    )
}

export default DistPicker2;