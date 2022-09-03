import ReactDOM from "react-dom/client";
import { Outlet } from "react-router";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

// import ProtectedRoute from "./components/ProtectedRoute";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddNewFacility from "./pages/AddNewFacility";
import BlogPost from "./pages/Blogging/BlogPost/BlogPost";
import Blogs from "./pages/Blogging/Blogs/Blogs";
import CreateBlog from "./pages/Blogging/CreateBlog/CreateBlog";
import EditBlog from "./pages/Blogging/EditBlog/EditBlog";
import YourBlogs from "./pages/Blogging/YourBlogs/YourBlogs";
import ChangePassword from "./pages/ChangePassword/index";
import { EventDetails } from "./pages/EventDetails";
import EventsList from "./pages/Events/index";
import Facilities from "./pages/Facilities";
import FacilityDetails from "./pages/FacilityDetails";
import ForgotPassword from "./pages/ForgotPassword/index";
import Home from "./pages/Home/index";
import LogIn from "./pages/LogIn/index";
import Checkout from "./pages/Membership/checkout";
import Pricing from "./pages/Membership/pricing";
import PurchasedMemberships from "./pages/Membership/purchasedMembership";
import MyEventDetails from "./pages/MyEventDetails";
import MyEvents from "./pages/MyEvents/MyEvents";
import MembershipPlan from "./pages/Payment/membershipPlan";
import PaymentSuccess from "./pages/Payment/paymentSuccess";
import Profile from "./pages/Profile/index";
import { ReservationDetails } from "./pages/ReservationDetails";
import ReservationList from "./pages/Reservations";
import Rewards from "./pages/Rewards/index";
import BlogSearch from "./pages/Search/blogSearch";
import EventSearch from "./pages/Search/eventSearch";
import AppSearch from "./pages/Search/facilitySearch";
import MainSearch from "./pages/Search/mainSearch";
import MerchandiseSearch from "./pages/Search/merchandiseSearch";
import Signup from "./pages/Signup/index";
import VerifyAccount from "./pages/VerifyAccount/index";
import AddProduct from "./pages/Merchandise/addProduct";
import Products from "./pages/Merchandise/displayProducts";
import ProductDetails from "./pages/Merchandise/productDetails";
import NoHeader from "./components/NoHeader";
import WithHeader from "./components/WithHeader";

import { getUser } from "./components/getLocalStorage";
import AddNewEvent from "./pages/AddNewEvent";
const root = ReactDOM.createRoot(document.getElementById("root"));

const theme = createTheme({
  typography: {
    fontFamily: ["Montserrat", "sans-serif"].join(","),
  },
  palette: {
    primary: { main: "#326dd9" },
  },
});

const ProtectedRoute = ({ isAllow, redirectPath = "/login", children }) => {
  if (!isAllow()) {
    toast.error("You have to login first to see the page.", {
      position: toast.POSITION.TOP_RIGHT,
    });
    return <Navigate to={redirectPath} replace />;
  }
  console.log(children);
  return children ? children : <Outlet />;
};

function checkUser() {
  const isLogin = localStorage.getItem("isLogin");
  if (getUser() !== undefined && getUser() != null) {
    const profile = getUser().profile;
    console.log(profile);
    // console.log("check user");
    if (isLogin === "true" && profile === "user") {
      // console.log("user true");
      return true;
    }
  } else {
    console.log("user false");
    return false;
  }
}

function checkAdmin() {
  const isLogin = localStorage.getItem("isLogin");
  if (getUser() !== undefined && getUser() != null) {
    const profile = getUser().profile;
    console.log(profile);
    // console.log("check user");
    if (isLogin === "true" && profile === "admin") {
      // console.log("user true");
      return true;
    }
  } else {
    console.log("user false");
    return false;
  }
}

// cite : https://reactrouter.com/docs/en/v6/components/routes
// I used some of the code for routing
root.render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <Routes>
        {/* todo add path only which needs header */}
        <Route element={<WithHeader />}>
          <Route path="/" element={<Home />} />
          <Route path="store" element={<Products />} />
          <Route
            element={
              <ProtectedRoute isAllow={() => checkUser() || checkAdmin()} />
            }
          >
            <Route
              path="my-reservations"
              element={<ReservationList />}
            />
            <Route path="facility/:resourceId" element={<FacilityDetails />} />
          </Route>
          <Route path="facility" element={<Facilities />} />
          <Route path="facility/add-new" element={<AddNewFacility />} />
          <Route path="product/add-new" element={<AddProduct />}/>
          <Route path="product/:productId" element={<ProductDetails />} />
          <Route element={<ProtectedRoute isAllow={() => checkAdmin()} />}>
            <Route path="facility/add-new" element={<AddNewFacility />} />
          </Route>
          <Route
            path="my-reservations/:reservationId"
            element={<ReservationDetails />}
          />
          <Route path="store" element={<Home />} />
          <Route path="my-account" element={<Profile />} />
          <Route path="membership" element={<Pricing />} />
          <Route
            path="purchased-membership"
            element={<PurchasedMemberships />}
          />
          <Route element={<ProtectedRoute isAllow={() => checkUser() || checkAdmin()} />}>
            <Route path="membership/checkout" element={<Checkout />} />
            <Route path="my-rewards" element={<Rewards />}/>
          </Route>

          <Route path="events" element={<EventsList />} />
          <Route element={<ProtectedRoute isAllow={() => checkAdmin()}/>}>
            <Route path="events/add-new" element={<AddNewEvent/>}/>
          </Route>
          <Route element={<ProtectedRoute isAllow={() => checkUser() || checkAdmin()} />}>
            <Route path="events/:eventId" element={<EventDetails />} />
            <Route path="my-events" element={<MyEvents />} />
            <Route path="my-events/:bookingId" element={<MyEventDetails />} />
          </Route>
          <Route path="rewards" element={<Home />} />
          <Route path="payment" element={<MembershipPlan />} />
          <Route path="payment-success" element={<PaymentSuccess />} />
          <Route path="blogs" element={<Blogs />} />
          <Route
            element={
              <ProtectedRoute isAllow={() => checkUser() || checkAdmin()} />
            }
          >
            <Route path="createblog" element={<CreateBlog />} />
            <Route path="editblogs/:id" element={<EditBlog />} />
            <Route path="yourblogs" element={<YourBlogs />} />
          </Route>
          <Route exact path="blogpost/:id" element={<BlogPost />} />
          <Route path="mainSearch" element={<MainSearch />} />
          <Route path="facilitySearch" element={<AppSearch />} />
          <Route path="eventSearch" element={<EventSearch />} />
          <Route path="blogSearch" element={<BlogSearch />} />
          <Route path="merchandiseSearch" element={<MerchandiseSearch />} />
        </Route>
        {/* todo add path only which doesn't need header */}
        <Route element={<NoHeader />}>
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/verify-account" element={<VerifyAccount />} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
