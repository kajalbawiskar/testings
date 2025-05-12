import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';

export function Header() {
    return <header>Header Component</header>;
}

export function useCampaigns(){
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(()=>{
    axios.post("https://api.confidanto.com/get-campaigns-list",{
        customer_id : localStorage.getItem("customer_id"),
        start_date  : "2024-01-01",
        end_date    : "2024-10-16",
    })
    .then(res=>{
        setData(res)
    }).catch(err=>{
        setError(err);
    }).finally(fin=>{
        setLoading(false)
    })

  },[])


  return { data, loading, error };
}