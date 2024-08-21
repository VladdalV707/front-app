import axios from 'axios';
import React, { useState } from 'react'

function PostReq() {

  const url='http://localhost:49176/api/obiect-inventar';
  const[nrord, setNrord]=useState('');
  const[nrfact, setNrfact]=useState('');
  const[furnizor, setFurnizor]=useState('');
  const[denumire, setDenumire]=useState('');
  const[buc, setBuc]=useState('');

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
        const resp= await axios.post(url,{ NumarDeOrdine:nrord, NrFactura:nrfact, Furnizor:furnizor, DenumireObiect:denumire, NrBucati:buc});
        console.log(resp.data);
    } catch(error){console.log(error.response)};
  }

  
  return (
  <section>
    <h2 className='Titlu-Post'>Introducere Date</h2>
    <form className='form' onSubmit={handleSubmit} >
        <div className='form-row'>
            <label htmlFor='Nr.Ord' className='form-label'>
             Nr. Ordine:   
            </label>
            <br/>
            <input
                type='text'
                className='form-input'
                id='Nr.Ord'
                value={nrord}
                onChange={(e) => setNrord(e.target.value)}
            />
        </div>
        <div className='form-row'>
            <label htmlFor='Nr.Fact' className='form-label'>
             Nr. Factură:  
            </label>
            <br/>
            <input
                type='text'
                className='form-input'
                id='Nr.Fact'
                value={nrfact}
                onChange={(e) => setNrfact(e.target.value)}
            />
        </div>
        <div className='form-row'>
            <label htmlFor='Furnizor' className='form-label'>
             Furnizor:   
            </label>
            <br/>
            <input
                type='text'
                className='form-input'
                id='Furnizor'
                value={furnizor}
                onChange={(e) => setFurnizor(e.target.value)}
            />
        </div>
        <div className='form-row'>
            <label htmlFor='DenOb' className='form-label'>
             Denumire Obiect:   
            </label>
            <br/>
            <input
                type='text'
                className='form-input'
                id='DenOb'
                value={denumire}
                onChange={(e) => setDenumire(e.target.value)}
            />
        </div>
        <div className='form-row'>
            <label htmlFor='BUC' className='form-label'>
             Bucăți:   
            </label>
            <br/>
            <input
                type='text'
                className='form-input'
                id='BUC'
                value={buc}
                onChange={(e) => setBuc(e.target.value)}
            /><br/><br/>
        </div>
        <div className='submit-btn'>
            <input type='submit' value='Adaugă'/>
        </div>
    </form>
  </section>
  )
}

export default PostReq