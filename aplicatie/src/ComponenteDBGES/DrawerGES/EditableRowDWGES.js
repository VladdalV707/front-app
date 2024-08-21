import React from 'react'
import '../DrawerGES.css';

const EditableRowDWGES = ({ editFormData, handleEditFormChange, handleCancelClick, index }) => {
    return (
        <tr>
            <td>
                {index + 1}
            </td>
            <td>
                <input
                    type="text"
                    name="Nume"
                    required="required"
                    placeholder="Numele este ..."
                    value={editFormData.Nume}
                    onChange={handleEditFormChange}
                />
            </td>
            <td>
                <button type="submit" style={{ marginRight: '10px' }}>Salvați</button>
                <button type="button" onClick={handleCancelClick}>Anulați</button>
            </td>
        </tr>
    )
}

export default EditableRowDWGES