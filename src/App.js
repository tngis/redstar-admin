import React, { useEffect } from "react";
import jwt_decode from 'jwt-decode';
import { useSelector } from 'react-redux'
import setAuthToken from './utils/setAuthToken';
import store from './store';
import { SideBar, Navbar, Footer } from './components'
import { setCurrentUser } from './actions/userActions'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Layout, Breadcrumb } from "antd";
import ProductScreen from "./screens/ProductScreen/ProductScreen";
import SectorScreen from './screens/Sectors/SectorScreen';
import LoginScreen from "./screens/Authentication/LoginScreen";
import CategoryScreen from './screens/CategoryScreen/CategoryScreen'
import CategoryEdit from "./screens/CategoryScreen/CategoryEdit";
import SectorDetailScreen from "./screens/Sectors/SectorDetailScreen";
import SubCategories from "./screens/Subcategory/SubCategories";
import SubCategoriesDetails from "./screens/Subcategory/SubCategoriesDetails";
import ProductCreate from "./screens/ProductScreen/ProductCreate";
import ProductEdit from "./screens/ProductScreen/ProductEdit";
import IntroScreen from "./screens/Intro/IntroScreen";
import IntroCreate from "./screens/Intro/IntroCreate";
import IntroEdit from "./screens/Intro/IntroEdit";
const { Content } = Layout;
// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
}
const App = () => {
  const auth = useSelector((state) => state.auth);
  const { isAuthenticated } = auth;
  return (
    <Router>
      <Switch>
        <Route path="/login" component={LoginScreen} />
      </Switch>
     { isAuthenticated && (
        <main>
        <Layout style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
        <SideBar />
          <Layout className="site-layout">
            <Navbar />
            <Content style={{ margin: "0 16px" }}>
              <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
              </Breadcrumb>
              <div
                className="site-layout-background"
                style={{ padding: 24, minHeight: 360 }}
              >
                <Switch>
                  <Route path="/categories" component={CategoryScreen} />
                  <Route path="/intros" component={IntroScreen} />
                  <Route path="/intro/create" component={IntroCreate} />
                  <Route path="/intro/:id/edit" component={IntroEdit} />
                  <Route path="/category/:id/edit" component={CategoryEdit} />
                  <Route path="/category/:id/subcategories" component={SubCategoriesDetails} />
                  <Route path="/sectors" component={SectorScreen} />
                  <Route path="/sector/:id/edit" component={SectorDetailScreen} />
                  <Route path="/products/create" component={ProductCreate} />
                  <Route path="/products" component={ProductScreen} />
                  <Route path="/product/:productId" component={ProductEdit} />
                  <Route path="/subcategories/:id/edit" component={SubCategories} />
                </Switch>
              </div>
            </Content>
            <Footer />
          </Layout>
        </Layout>
      </main>
     ) }
    </Router>
  );
};

export default App;
