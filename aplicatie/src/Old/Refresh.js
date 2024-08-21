import React, { useState } from 'react'

function Refresh() {
  const [isClicked, setisClicked] = useState(false);

  return (
    <div>
      <button type='button' className='button' onClick={() => setisClicked(!isClicked)}>
        Refresh
      </button>


    </div>
  )
}

export default Refresh