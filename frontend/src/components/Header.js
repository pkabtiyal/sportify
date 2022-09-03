import { useNavigate } from "react-router-dom";

import CompanyLogo from "@mui/icons-material/FitnessCenter";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Logo from "../assets/images/Sportify.png";
import { getUser } from "./getLocalStorage";

import { getBackendUrl } from './getUrl';

const pages = ["Membership", "Facility", "Events", "Blogs", "Store"];
// const settings = ['My Account', 'Logout'];

const primaryColor = "#326DD9";
const secondaryColor = "#234C99";

const profileDropdownList = {
  admin: [
    {
      displayName: "My Account",
      redirectTo: "my-account",
    },
  ],
  user: [
    {
      displayName: "My Account",
      redirectTo: "my-account",
    },
    {
      displayName: "My Events",
      redirectTo: "my-events",
    },
    {
      displayName: "My Reservations",
      redirectTo: "my-reservations",
    },
    {
      displayName: "My Rewards",
      redirectTo: "my-rewards",
    },
  ],
};

const Header = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [loggedInUserRole] = useState(getUser()?.profile);
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  useEffect(() => {
    // console.log("isLogin "+localStorage.getItem("isLogin"));
    if (localStorage.getItem("isLogin") === "true") {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
    return () => {};
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  const notify = (type, msg) => {
    if(type === 'success'){
        toast.success(
          msg,
          { position: toast.POSITION.TOP_RIGHT }
        );
        
    }else if(type === 'error'){
        toast.error(
          msg,
          { position: toast.POSITION.TOP_RIGHT }
        );

    }
  };

  const logout = () => {
    // console.log(values);
    const logoutUrl = getBackendUrl()+"/api/signout";
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json","access-token":localStorage.getItem("access-token") },
    };
    let statusCode;
    fetch(logoutUrl, requestOptions)
      .then((response) => {
        statusCode = response.status;
        return response.json();
      })
      .then((result) => {
        if (statusCode === 500) {
          notify("error", result.message);
        } else {
          console.log(result);
          localStorage.clear();
          localStorage.setItem("isLogin", false);
          notify("success", result.message);
          window.location.replace("/");
        }
      })
      .catch((error) => console.log("error", error));
  };


  // const logout = () => {
  //   localStorage.clear();
  //   localStorage.setItem("isLogin", false);
  //   toast.success("Your successfully logged out", {
  //     position: toast.POSITION.TOP_RIGHT,
  //   });
  //   window.location.replace("/");
  // };
  return (
    <AppBar position="static" sx={{ bgcolor: "white" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <CompanyLogo sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <img
              src={`${Logo}`}
              alt="Sportify"
              loading="lazy"
              className="brand-img"
            />
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon sx={{ color: primaryColor }} />
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Button
                    sx={{ color: secondaryColor, backgroundColor: "white" }}
                    onClick={() => navigateTo(page.toLowerCase())}
                    textalign="center"
                    underline="none"
                  >
                    {page}
                  </Button>
                  {/* <Link to={`/${page.toLowerCase()}`} textalign="center" underline="none">{page}</Link> */}
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <CompanyLogo sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <img
              src={`${Logo}`}
              alt="Sportify"
              loading="lazy"
              className="brand-img"
            />
          </Typography>
          <IconButton
            size="large"
            aria-label="search"
            color="inherit"
            href="/mainSearch"
            sx={{
              color: "black",
              display: { xs: "inline-flex", sm: "none", md: "none" },
            }}
          >
            <SearchIcon />
          </IconButton>
          <Box
            sx={{
              flexGrow: 1,
              gap: "12px",
              display: { xs: "none", md: "flex" },
            }}
          >
            {pages.map((page) => (
              <Button
                key={page}
                // onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "#326DD9", display: "block" }}
                // href={`/${page.toLowerCase()}`}
                onClick={() => navigateTo(page.toLowerCase())}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <IconButton
              size="large"
              aria-label="search"
              href="/mainSearch"
              color="inherit"
              sx={{
                color: "black",
                mr: "20px",
                display: { xs: "none", sm: "inline-flex", md: "inline-flex" },
              }}
            >
              <SearchIcon />
            </IconButton>
            {isLogin ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={getUser().firstName} src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {profileDropdownList[loggedInUserRole].map((setting) => (
                    <MenuItem
                      key={setting.displayName}
                      onClick={handleCloseUserMenu}
                    >
                      <Button
                        sx={{ color: secondaryColor }}
                        onClick={() => navigateTo(setting.redirectTo)}
                        textalign="center"
                        underline="none"
                      >
                        {setting.displayName}
                      </Button>
                      {/* <Typography textalign="center">{setting}</Typography> */}
                    </MenuItem>
                  ))}
                  <MenuItem>
                    <Button
                      sx={{ color: secondaryColor }}
                      onClick={logout}
                      textalign="center"
                      underline="none"
                    >
                      Logout
                    </Button>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  sx={{ color: secondaryColor }}
                  onClick={() => {
                    navigate("/login");
                  }}
                  textalign="center"
                  underline="none"
                >
                  Login
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;
