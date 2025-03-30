import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSideBar from "../Components/DashSideBar";
import DashProfile from "../Components/DashProfile";
import DashUsers from "../Components/DashUsers";
import DashMyProducts from "../Components/DashMyProducts";
import SendMail from "./sendMail";
import DashMyOrders from "../Components/DashMyOrders";
import DashsellersOrders from "../Components/DashsellersOrders";
import DashProducts from "../Components/DashProducts";



export default function DashBoard() {
  const location = useLocation();
  const[tab,setTab]= useState();
  const[id,setid]= useState();
  const[email,setemail]=useState();

 

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    const idfromurl = urlParams.get('id');
    const email=urlParams.get('email')
 
    if(tabFromUrl){
      setTab(tabFromUrl)
    }
    if(tabFromUrl){
      setid(idfromurl)
    }
    if(tabFromUrl){
      setemail(email)
    }
  },[location.search]);
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        <DashSideBar/>
      </div>
      {tab === 'profile' && <DashProfile/>}
      {tab === 'users' && <DashUsers/>}
      {tab === 'myproducts' && <DashMyProducts/>}
      {tab === 'products' && <DashProducts/>}
      {tab === 'sendemail'&& email && <SendMail email={email} />}
      {tab === 'my_orders' && <DashMyOrders/>}
      {tab === 'my_s_orders' && <DashsellersOrders/>}

      
      {/*
      {tab == 'orders' && <DashOrders/>}
      {tab === 'myorders' && <DashMyOrders/>}

       */}

   
     
    </div>
  )
}
