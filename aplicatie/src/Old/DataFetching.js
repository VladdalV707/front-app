import React, { useState, useEffect } from 'react'
import axios from 'axios'


function DataFetching() {

  const url = 'http://localhost:49176/api/obiect-inventar';

  const [row, setRow] = useState([]);
  const [isClicked, setisClicked] = useState(false);

  function Refresh() {
    return (
      <div>
        <button type='button' className='button' onClick={() => setisClicked(!isClicked)}>
          Refresh
        </button>
      </div>
    )
  }

  const Delete = (id, e) => {
    e.preventDefault();
    axios
      .delete(`http://localhost:49176/api/obiect-inventar?id=${id}`)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    axios
      .get(url)
      .then(res => {
        console.log(res);
        setRow(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }, [isClicked]);

  return (
    <div className="outer-wrapper">
      <div className="table-wrapper">

        <table>

          <thead>

            <tr>
              <th style={{ fontSize: "50px", backgroundColor: "lightgrey", position: "static" }} colSpan="8">2023</th>
            </tr>

            <tr>
              <th style={{ backgroundColor: "lightgrey" }}>N.O</th>
              <th style={{ backgroundColor: "lightgrey" }}>Nr. Factură</th>
              <th style={{ backgroundColor: "lightgrey" }}>Furnizor</th>
              <th style={{ backgroundColor: "lightgrey" }}>Denumire Obiect</th>
              <th style={{ backgroundColor: "lightgrey" }}>BUC</th>
              <th style={{ backgroundColor: "lightgrey" }}>Destinație</th>
              <th style={{ backgroundColor: "lightgrey" }}>B.M</th>
              <th style={{ backgroundColor: "lightgrey" }}>Șterge</th>
            </tr>

          </thead>

          <tbody>

            {row.map(row => {
              return (
                <tr key={row.Id}>
                  <td>{row.NumarDeOrdine}</td>
                  <td>{row.NrFactura}</td>
                  <td>{row.Furnizor}</td>
                  <td>{row.DenumireObiect}</td>
                  <td>{row.NrBucati}</td>
                  <td>-</td>
                  <td>-</td>
                  <td><button type='button' className='button' onClick={(e) => { Delete(row.Id, e) }}>Șterge</button></td>
                </tr>
              );

            })}

          </tbody>

        </table>

      </div>
      <Refresh />
    </div>

  );
}

export default DataFetching;