import React from 'react'

const Selector = ({ options, setValue, title}) => {

    if(!options || options.length === 0) {
        return <p>Loading...</p>;
    }
  return (
   <>
    <div className="filter-group">
          <h3>{title}</h3>
          <select 
            className="select-dropdown" 
            onChange={e => setValue(e.target.value)}
          >
            {options.map((option,idx) => (
              <option key={option.id || idx} value={option.id || option.value}>
                {option.name || option.value}
              </option>
            ))}
          </select>
    </div>
   </>
  )
}

export default Selector