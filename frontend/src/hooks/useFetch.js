import { useState, useEffect } from 'react';

function useFetch(url) {
  const [data, setData] = useState(null);

  useEffect(() => {
   fetch(url, {
    credentials: 'include', 
  })
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => {
        
        setData(data);
        
      })
      .catch(err => console.error("Error fetching data:", err));
  }, [url]);

  return { data };
}

export default useFetch;
