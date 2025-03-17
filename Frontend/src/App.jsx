import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import Header from './Components/Header';
import DashBoard from './Pages/DashBoard';
import PrivateRoute from './Components/PrivateRoute';
import OnlyAdminPrivateRoute from './Components/OnlyAdminPrivateRoute';


export default function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        <Route element={<PrivateRoute />} />
        <Route path="/dashboard" element={<DashBoard />} />
         
       

        <Route element={<OnlyAdminPrivateRoute />}></Route>

      
      
      

      </Routes>

    </BrowserRouter>
  );
}
