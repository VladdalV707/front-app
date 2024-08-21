import React from 'react';
import './App.css';

function DBTable() {

  return(
    <body>
    <div className="outer-wrapper">
    <div className="table-wrapper">  

    <table>

    <tr>
      <th style={{fontSize: "50px", backgroundColor: "lightgrey", position: "static"}} colspan="7">2023</th>
    </tr>

    <tr>
      <th style={{backgroundColor: "lightgrey"}}>N.O</th>
      <th style={{backgroundColor: "lightgrey"}}>Nr. Factură</th>
      <th style={{backgroundColor: "lightgrey"}}>Furnizor</th>
      <th style={{backgroundColor: "lightgrey"}}>Denumire Obiect</th>
      <th style={{backgroundColor: "lightgrey"}}>BUC</th>
      <th style={{backgroundColor: "lightgrey"}}>Destinație</th>
      <th style={{backgroundColor: "lightgrey"}}>B.M</th>  
    </tr>

    <tr>
      <td>2230001</td>
      <td>F.122121859679205968740925</td>
      <td>GigiSRL</td>
      <td>Covrig</td>
      <td>60</td>
      <td>Eu</td>
      <td>3475</td>
    </tr>

    <tr>
      <td>2230002</td>
      <td>F.745928847223458234543852</td>
      <td>DANTE INTERNATIONAL S.A</td>
      <td>HARD DISK ULTRA 5 TB BLUE USB-C/USB 3.0 SERIA:WX52D41A641H</td>
      <td>6</td>
      <td>Tu</td>
      <td>2345</td>
    </tr>
    



</table>

</div>
</div>
</body>
  );


}

export default DBTable;
