import { Route, Routes as ReactRouterRoutes } from 'react-router-dom';
import Index from "../pages/index";
import Profile from "../pages/profile";
import Product from "../pages/product";

export const Routes = () => {
  return (
  <ReactRouterRoutes>
    <Route path='/' element={<Index/>}> </Route>
    <Route path="/profile" element={<Profile/>} />
    <Route path="/details/:id" element={<Product/>} />
  </ReactRouterRoutes>
  )
}
