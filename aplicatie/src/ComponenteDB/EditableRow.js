import React from 'react';
import "../DataBase.css";

const EditableRow = ({ editFormData, handleEditFormChange, handleCancelClick }) => {
    return (
        <tr>
            <td>
                <input
                    type="text"
                    name="NumarDeOrdine"
                    required="required"
                    placeholder="N.O. este ..."
                    value={editFormData.NumarDeOrdine}
                    onChange={handleEditFormChange}
                />
            </td>
            <td>
                <input
                    type="text"
                    name="NrFactura"
                    required="required"
                    placeholder="Nr. de Factură este ..."
                    value={editFormData.NrFactura}
                    onChange={handleEditFormChange}
                />
            </td>
            <td>
                <input
                    type="text"
                    name="Furnizor"
                    required="required"
                    placeholder="Furnizorul este ..."
                    value={editFormData.Furnizor}
                    onChange={handleEditFormChange}
                />
            </td>
            <td>
                <input
                    type="text"
                    name="DenumireObiect"
                    required="required"
                    placeholder="Obiectul este ..."
                    value={editFormData.DenumireObiect}
                    onChange={handleEditFormChange}
                />
            </td>
            <td>
                {editFormData.NrBucati}
            </td>
            <td>
                <button type="submit" style={{ marginRight: '10px' }}>Salvați</button>
                <button type="button" onClick={handleCancelClick}>Anulați</button>
            </td>
        </tr>
    )
}

export default EditableRow