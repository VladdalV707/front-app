import React, { useState } from 'react';
import Modal from 'react-modal';
import './YearSelector.css';

const YearSelector = ({ showYearSelector, setShowYearSelector, setYear }) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const yearOptions = Array.from({ length: 2101 - 2023 }, (_, index) => {
        const yearOption = 2023 + index;
        return <option key={yearOption} value={yearOption}>{yearOption}</option>;
    });

    return (
        <Modal
            ariaHideApp={false}
            isOpen={showYearSelector}
            onRequestClose={() => setShowYearSelector(false)}
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
                    maxHeight: '100vh',
                },
            }}
        >
            <div className="modal-content-ys">
                <h2 style={{ textAlign: 'center', marginBottom: '25px' }}>Formular de alegere a anului</h2>
                <label>
                    Alegeți Anul Dorit:
                    <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
                        {yearOptions}
                    </select>
                </label>
                <div className="button-container">
                    <button type="button" onClick={() => {
                        setYear(selectedYear);
                        setShowYearSelector(false);
                    }}>
                        Alegeți
                    </button>
                    <button type="button" onClick={() => setShowYearSelector(false)}>
                        Anulați
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default YearSelector;
