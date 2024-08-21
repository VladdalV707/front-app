import React from 'react';
import { useState } from 'react';
import "../DataBaseDP.css";
import PopupGestiuni from './PopupGestiuni';
import AddGestiuni from './AddGestiuni';
import DeleteGestiuni from './DeleteGestiuni';
import EditGestiuni from './EditGestiuni';

const ReadOnlyRowDP = ({ departament, setItemAdded, setItemDeleted, setItemEdited }) => {

    const [showModal, setShowModal] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    return (
        <tr>
            <td>{departament.Nume}</td>
            <td>
                <div className="obiect-cell">
                    <div style={{ marginRight: "10px" }}>{departament.Gestiuni.length}</div>
                    {departament.Gestiuni.length > 0 ? (
                        <button type="button" onClick={() => setShowModal(true)}>Detalii</button>
                    ) : (
                        <button type="button" disabled>Detalii</button>
                    )}
                    {showModal && <PopupGestiuni showModal={showModal} setShowModal={setShowModal} departament={departament} setItemAdded={setItemAdded} setItemDeleted={setItemDeleted} />}
                </div>
            </td>
            <td>
                <button type="button" style={{ marginRight: "10px" }} onClick={() => setShowAdd(true)}>Adaugăți</button>
                {showAdd && <AddGestiuni showAdd={showAdd} setShowAdd={setShowAdd} departament={departament} setItemAdded={setItemAdded} />}
                <button type="button" style={{ marginRight: "10px" }} onClick={() => setShowDelete(true)}>Ștergeți</button>
                {showDelete && <DeleteGestiuni showDelete={showDelete} setShowDelete={setShowDelete} departament={departament} setItemDeleted={setItemDeleted} />}
                <button type="button" onClick={() => setShowEdit(true)}>Editați</button>
                {showEdit && <EditGestiuni showEdit={showEdit} setShowEdit={setShowEdit} departament={departament} setItemEdited={setItemEdited} />}
            </td>
        </tr>
    );

}

export default ReadOnlyRowDP;