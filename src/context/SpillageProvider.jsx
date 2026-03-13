import React, { createContext, useState, useContext, useEffect } from 'react'
import { fetchTimeFrames } from '../services/timeFrameService';
import { fetchNSrpints } from '../services/nSprintsService';

const spillageContext = createContext();

const SpillageProvider = ({ children }) => {

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [project, setProject] = useState('IVP-SRM');
    const [nSprints, setNSprints] = useState(6);
    const [timeFrame, setTimeFrame] = useState(null);

    const params = new URLSearchParams();

    useEffect(() => {
        if( nSprints >= 1) {
            fetchData();
        }
    }, [project,nSprints,timeFrame]);

    const fetchData = async () => {
      setLoading(true); 
      try {
          if (timeFrame) {
              params.append('timeframe', timeFrame);
              params.append('n', nSprints);
          }else {
              params.append('lastNSprints', nSprints);
          }
          const res = await fetchTimeFrames.getAllSprintData({project, params});
          
          setData(res); 
          setError(null);
      } catch (error) {
          console.error("Fetch Error:", error);
          setError(error.message);
      } finally {
          setLoading(false);
      }
  }

    // const fetchData = async () => {
    //     try{
    //       const res = await fetchTimeFrames.getAllSprintData(6);
    //       console.log('SpillageProvider: fetched data', res);
    //       setData(res);
    //     }catch(error){
    //       console.log(error);
    //     } 
    // }
    
  return (
    <spillageContext.Provider value={{ 
        error, setError, 
        loading, setLoading, 
        data, setProject, 
        nSprints, setNSprints, 
        timeFrame, setTimeFrame, 
        }}>
      {children}
    </spillageContext.Provider>
  )
}

export const useSpillageContext = () => {
    return useContext(spillageContext);
}
        
export default SpillageProvider;