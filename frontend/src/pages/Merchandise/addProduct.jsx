import { Delete, PhotoCamera } from "@mui/icons-material";
import { Button, Container, Grid, IconButton, Input, Paper, TextField, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useState } from "react";
import "./addProduct.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getBackendUrl } from "../../components/getUrl";
import { toast } from "react-toastify";

const AddNewProduct = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [productData, setProductData] = useState({
    productName: "",
    productPrice: "",
    productDescription: "",
  });
  const [productFormErrors, setProductFormErrors] = useState({
    productName: {
      required: false,
      maxLen: false,
    },
    productPrice: {
      required: false,
    },
    productDescription: {
      required: false,
      maxLen: false,
    },
    image: {
      required: false,
    },
  });
  const [backDialogOpen, setBackDialogOpen] = useState(false);

  const maxLengths = {
    productName: 50,
    productDescription: 500,
  };

  const onImageUpload = (event) => {
    const img = event.target.files[0];
    const reader = new FileReader(img);
    reader.readAsDataURL(img);
    reader.onload = () => {
      setImage(reader.result);
      setImageUrl(URL.createObjectURL(img));
      setProductFormErrors({
        ...productFormErrors,
        image: {
          required: false,
        },
      });
    };
  };

  const onDeleteImage = () => {
    setImageUrl(null);
    setImage(null);
    setProductFormErrors({
      ...productFormErrors,
      image: {
        required: true,
      },
    });
  };

  const onProductDataChange = (event) => {
    const target = event.target;
    setProductData({
      ...productData,
      [target.name]: target.value,
    });
    validateFormChange(target.name, target.value);
  };

  const validateFormChange = (propName, propValue) => {
    if (!propValue || propValue === "" || propValue.trim() === "") {
      setProductFormErrors({
        ...productFormErrors,
        [propName]: {
          required: true,
        },
      });
      return true;
    } else if (
      maxLengths[propName] &&
      maxLengths[propName] < propValue.length
    ) {
      setProductFormErrors({
        ...productFormErrors,
        [propName]: {
          required: false,
          maxLen: true,
        },
      });
      return true;
    }
    setProductFormErrors({
      ...productFormErrors,
      [propName]: {
        required: false,
        maxLen: false,
      },
    });
    return false;
  };

  const validateFormData = () => {
    for (let prop of ["productName", "productPrice", "productDescription"]) {
      if (validateFormChange(prop, productData[prop])) {
        return false;
      }
    }
    if (image === null) {
      setProductFormErrors({
        ...productFormErrors,
        image: {
          required: true,
        },
      });
      return false;
    }
    return true;
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

  const onPostNewproduct = (event) => {
    event.preventDefault();
    if (!validateFormData()) {
      return;
    }
    const reqBody = {
      product_name: productData.productName,
      product_price: productData.productPrice,
      product_description: productData.productDescription,
      product_image: image,
    };
    axios({
      method: "post",
      url: `${getBackendUrl()}/api/merchandise/add-merchandise`,
      data: reqBody,
    })
      .then((res) => {
        notify("success","Successfuly added the product")
        navigate("/store")
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onBackClick = () => {
    setBackDialogOpen(true);
  };

  const closeDialog = () => {
    setBackDialogOpen(false);
  };

  const backConfirmation = () => {
    closeDialog();
    navigate("/store");
  };

  return (
    <Container maxWidth="sm" sx={{ mb: "4" }}>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography component="h1" variant="h4" align="center">
          Add New Product Details
        </Typography>
        <form onSubmit={onPostNewproduct}>
          <Grid container spacing={3} sx={{ mt: "20px" }}>
            <Grid item xs={12}>
              <TextField
                sx={{
                  ".MuiFormHelperText-root": {
                    color: "red",
                  },
                }}
                fullWidth
                label={"Product Name"}
                name="productName"
                value={productData.productName}
                onChange={onProductDataChange}
                helperText={
                  productFormErrors.productName.required
                    ? "Please enter Product Name"
                    : productFormErrors.productName.maxLen
                      ? "Name can't exceed 50 characters"
                      : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                sx={{
                  ".MuiFormHelperText-root": {
                    color: "red",
                  },
                }}
                type="number"
                id="outlined-required"
                label={"Product Price"}
                name="productPrice"
                value={productData.productPrice}
                onChange={onProductDataChange}
                helperText={
                  productFormErrors.productPrice.required
                    ? "Please enter Product Price" : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                sx={{
                  '.MuiFormHelperText-root': {
                    color: 'red'
                  }
                }}
                fullWidth
                label={"Description"}
                multiline
                name="productDescription"
                value={productData.productDescription}
                onChange={onProductDataChange}
                helperText={
                  productFormErrors.productDescription.required ?
                    'Please enter Product Description' :
                    (productFormErrors.productDescription.maxLen ?
                      "Description can't exceed 500 characters" :
                      '')}
              />
            </Grid>
            <Grid item xs={12}>
              {image !== null && (
                <div className="ImageWrapper">
                  <img alt="no" src={imageUrl} className="ImagePreview" />
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: "2%",
                      right: "2%",
                      zIndex: 100,
                      filter: { invert: "100%", brightness: 1.25 },
                      color: "#ffffff",
                    }}
                    onClick={onDeleteImage}
                  >
                    <Delete fontSize="large" />
                  </IconButton>
                </div>
              )}
              <label htmlFor="icon-button-file">
                <Input
                  type="file"
                  accept="image/*"
                  sx={{ display: "none" }}
                  id="icon-button-file"
                  onChange={onImageUpload}
                />
                <PhotoCamera />
                {productFormErrors.image.required && (
                  <p className="ErrorText">Please upload a image</p>
                )}
              </label>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button
                sx={{
                  color: "#000000",
                  backgroundColor: "#ffffff",
                  mr: "5px",
                  ":hover": {
                    backgroundColor: "#000000",
                    color: "#ffffff",
                  },
                }}
                onClick={onBackClick}
                variant="contained"
              >
                Back
              </Button>
              <Button type="submit" value="submit" variant="contained">
                Post
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Dialog
        open={backDialogOpen}
        onClose={closeDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Cancel Confirmation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure, want to go back? You will lose the information filled.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={backConfirmation}>Yes</Button>
          <Button variant="contained" onClick={closeDialog} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AddNewProduct;
