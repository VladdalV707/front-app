import React, { useState } from 'react';
import '../DatabaseGES.css';
import PopupBucGES from './PopupBucGES';

const ReadOnlyRowGES = ({ obiect, user, gestiune }) => {

    const [showModal, setShowModal] = useState(false);

    return (
        <tr>
            <td>{obiect.NumarDeOrdine}</td>
            <td>{obiect.DenumireObiect}</td>
            <td>
                <div className="obiect-cell">
                    <div style={{ marginRight: "10px" }}>{obiect.NrBucati}</div>
                    <button type="button" onClick={() => setShowModal(true)}>Detalii</button>
                    {showModal && <PopupBucGES showModal={showModal} setShowModal={setShowModal} obiect={obiect} user={user} gestiune={gestiune} />}
                </div>
            </td>
        </tr>
    )
}

export default ReadOnlyRowGES