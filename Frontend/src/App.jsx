
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
import { Footer } from 'flowbite-react';
import Cart from './Components/Cart';
import OrderSummary from './Pages/OrderSummary';
import UpdateProduct from './Pages/Updateproduct';
import UpdateReview from './Pages/UpdateReview.';
import OrderSuccess from './Pages/OrdeSuccess';
import AveragePrice from './Pages/AveragePrice';
import ReviewForm from './Components/ReviewForm';
import DashsellersOrders from './Components/DashsellersOrders';


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
        <Route path='/updateproduct/:productId'element={<UpdateProduct/>}/>
        <Route path='/updatereview/:reviewId'element={<UpdateReview/>}/>
        <Route path='/ordersuccess'element={<OrderSuccess/>}/>
        <Route path='/averageprice'element={<AveragePrice/>}/>
        <Route path='/reviewform/:productId/:farmerId'element={<ReviewForm/>}/>
        <Route path='/ordersummary'element={<OrderSummary/>}/>


        <Route path='/cart'element={<Cart/>}/>
        <Route path='/sellerorder'element={<DashsellersOrders/>}/>

        <Route element={<OnlyAdminPrivateRoute />}></Route>

      
      
      

      </Routes>
    <Footer/>
    </BrowserRouter>
  );
}


