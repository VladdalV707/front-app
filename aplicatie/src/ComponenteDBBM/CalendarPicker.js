import React from 'react';
import DatePicker from 'react-datepicker';
import ReactDOM from "react-dom";
import 'react-datepicker/dist/react-datepicker.css';
import ro from 'date-fns/locale/ro';
import "./CalendarPicker.css";

const CalendarPicker = ({ onDateIntervalChange, onCancel,
    startDateState, setStartDateState, endDateState, setEndDateState }) => {

    const modalRoot = document.getElementById("modal-root");

    const handleSave = () => {
        let start = startDateState;
        let end = endDateState;

        if (!start && end) {
            start = new Date(1, 0, 1); // 01.01.0001(bug arata 01.01.1901)
        }

        if (start && !end) {
            end = new Date(9999, 11, 31); // 31.12.9999
        }

        if (!start && !end) {
            start = new Date(1, 0, 1); // 01.01.0001(bug arata 01.01.1901)
            end = new Date(9999, 11, 31); // 31.12.9999
        }

        const startDateFormat = start.toLocaleDateString('ro-RO', { year: 'numeric', month: '2-digit', day: '2-digit' });
        const endDateFormat = end.toLocaleDateString('ro-RO', { year: 'numeric', month: '2-digit', day: '2-digit' });
        console.log(`Ați selectat intervalul: ${startDateFormat} - ${endDateFormat}`);
        onDateIntervalChange(start, end);
    };

    const handleCancel = () => {
        onCancel();
    };

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            onCancel();
        }
    };

    return ReactDOM.createPortal(
        <div>
            <div className="modal-overlaycp" onClick={handleOverlayClick} />
            <div className="modal date-pickercp" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="modal-contentcp">
                    <div>
                        <p>Selectați data de început:</p>
                        <DatePicker
                            selected={startDateState}
                            onChange={(date) => setStartDateState(date)}
                            selectsStart
                            startDate={startDateState}
                            endDate={endDateState}
                            minDate={new Date(1, 0, 1)}
                            dateFormat="dd.MM.yyyy"
                            withPortal
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                            locale={ro}
                        />
                    </div>
                    <div>
                        <p>Selectați data de final:</p>
                        <DatePicker
                            selected={endDateState}
                            onChange={(date) => setEndDateState(date)}
                            selectsEnd
                            startDate={startDateState}
                            endDate={endDateState}
                            minDate={startDateState}
                            dateFormat="dd.MM.yyyy"
                            withPortal
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                            locale={ro}
                        />
                    </div>
                    <div>
                        <button type='button' onClick={handleSave}>Salvați</button>
                        <button type='button' onClick={handleCancel}>Anulați</button>
                    </div>
                </div>
            </div>


        </div>,
        modalRoot
    );
}

export default CalendarPicker;
