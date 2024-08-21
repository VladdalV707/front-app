import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './CustomDatePicker.css';
import ro from 'date-fns/locale/ro';

const CustomDatePicker = ({ addFormData, setAddFormData, dateNotFormatted, setDateNotFormatted, formSubmitted, setFormSubmitted }) => {

  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    if (dateNotFormatted || formSubmitted) {

      if (formSubmitted) {
        setStartDate(new Date());
      }
      const formattedDate = formatDate(startDate);
      const updatedFormData = { ...addFormData, Data: formattedDate };
      setAddFormData(updatedFormData);

      setDateNotFormatted(false);
      setFormSubmitted(false);
    }
    // eslint-disable-next-line
  }, [dateNotFormatted, formSubmitted]);


  function formatDate(date) {
    if (!date) {
      return "";
    }
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  function handleDateChange(date) {
    setStartDate(date);
    const formattedDate = formatDate(date);
    console.log("Data formatată este:", formattedDate);
    const updatedFormData = { ...addFormData, Data: formattedDate };
    setAddFormData(updatedFormData);
  }

  return (
    <DatePicker
      className="input-outside-table"
      isRequired
      dateFormat="dd.MM.yyy"
      selected={startDate}
      onChange={handleDateChange}
      isClearable={true}
      placeholderText="Introduceți data..."
      withPortal
      showYearDropdown
      showMonthDropdown
      dropdownMode="select"
      locale={ro}
    />
  );
};


export default CustomDatePicker;
