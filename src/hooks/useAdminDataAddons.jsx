import { getProtected } from "../../api/get";
import { useEffect, useState, useCallback } from "react";
export function useAdminDataAddons(token) {
  const [addons, setAddons] = useState();
  const [isLoading, setLoading] = useState(false);
  const [updateAddons, setUpdateAddons] = useState(false)
  const getAddons = useCallback(async () =>{
    setLoading(true);
    try{
      const response = await getProtected({
        endpoint:"/addons",
        token:token,
      });
      if (response.status === 200) {
        setAddons(response.data.data);
      }
    }catch(error){

    }finally{
      setLoading(false);
    }
  }, [token]);
  useEffect(()=>{
    getAddons();
    if (updateAddons) {
      setUpdateAddons(false);
    }
  },[updateAddons]);

  return {
    addonsData: {
      addons,
      isLoading,
      setUpdateAddons,
    },
  };
}
