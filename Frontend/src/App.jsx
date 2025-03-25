import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import Header from './Components/Header';
import DashBoard from './Pages/DashBoard';
import PrivateRoute from './Components/PrivateRoute';
import OnlyAdminPrivateRoute from './Components/OnlyAdminPrivateRoute';
import ScrollToTop from './Components/ScrollTop';
import Support from './Pages/Support';
import AddProduct from './Pages/AddProduct';
import Prodcutpage from './Pages/Productpage';
import ProductView from './Pages/ProductView';


export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop/>
      <Header/>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/support/:slug" element={<Support/>} />
        <Route element={<PrivateRoute />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path='/addproduct' element={<AddProduct/>}/>
        <Route path='/productpage'element={<Prodcutpage/>}/>
        <Route path='/productview/:productId'element={<ProductView/>}/>


        <Route element={<OnlyAdminPrivateRoute />}></Route>

      
      
      

      </Routes>

    </BrowserRouter>
  );
}
