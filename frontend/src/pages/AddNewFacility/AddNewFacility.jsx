//Author: Aravind Jayanthi (B00868943)
//Email: ar687531@dal.ca
import { Delete, PhotoCamera } from "@mui/icons-material";
import FormControl from '@mui/material/FormControl';
import { Button, Container, Grid, IconButton, Input, InputLabel, MenuItem, Paper, Select, TextField, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useState } from "react";
import './AddNewFacility.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getBackendUrl } from "../../components/getUrl";
import { toast } from "react-toastify";

const AddNewFacility = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [facilityData, setFacilityData] = useState({
        facilityName: '',
        location: '',
        description: '',
        category: 'Gym'
    });
    const [facilityFormErrors, setFacilityFormErrors] = useState({
        facilityName: {
            required: false,
            maxLen: false,
        },
        location: {
            required: false,
            maxLen: false,
        },
        description: {
            required: false,
            maxLen: false,
        },
        category: {
            required: false,
        },
        image: {
            required: false,
        },
    });
    const [backDialogOpen, setBackDialogOpen] = useState(false);

    const maxLengths = {
        facilityName: 50,
        location: 50,
        description: 5000
    }

    const onImageUpload = (event) => {
        const img = event.target.files[0];
        const reader = new FileReader(img);
        reader.readAsDataURL(img);
        reader.onload = () => {
            setImage(reader.result);
            setImageUrl(URL.createObjectURL(img));
            setFacilityFormErrors({
                ...facilityFormErrors,
                image: {
                    required: false
                }
            });
        }
    }

    const onDeleteImage = () => {
        setImageUrl(null);
        setImage(null);
        setFacilityFormErrors({
            ...facilityFormErrors,
            image: {
                required: true
            }
        });
    }

    const onFacilityDataChange = (event) => {
        const target = event.target;
        setFacilityData({
            ...facilityData,
            [target.name]: target.value,
        });
        validateFormChange(target.name, target.value);
    }

    const validateFormChange = (propName, propValue) => {
        if (!propValue || propValue==='' || propValue.trim() === '') {
            setFacilityFormErrors({
                ...facilityFormErrors,
                [propName]: {
                    required: true,
                }
            });
            return true;
        }
        else if (maxLengths[propName] && maxLengths[propName] < propValue.length) {
            setFacilityFormErrors({
                ...facilityFormErrors,
                [propName]: {
                    required: false,
                    maxLen: true,
                }
            });
            return true;
        }
        setFacilityFormErrors({
            ...facilityFormErrors,
            [propName]: {
                required: false,
                maxLen: false,
            }
        });
        return false;
    }

    const validateFormData = () => {
        for (let prop of ['facilityName', 'location', 'description']) {
            if (validateFormChange(prop, facilityData[prop])) {
                return false;
            }
        }
        if (image === null) {
            setFacilityFormErrors({
                ...facilityFormErrors,
                image: {
                    required: true
                }
            });
            return false;
        }
        return true;
    }

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

    const onPostNewFacility = (event) => {
        event.preventDefault();
        if (!validateFormData()) {
            return ;
        }
        const reqBody = {
            name: facilityData.facilityName,
            location: facilityData.location,
            description: facilityData.description,
            category: facilityData.category,
            image: image
        };
        axios({
            method: 'post',
            url: `${getBackendUrl()}/facility`,
            data: reqBody,
            headers: {
                "access-token": localStorage.getItem("access-token"),
            }
        }).then(res => {
            notify('success', 'Successfuly added the facility');
            navigate('/facility');
            console.log(res);
        }).catch(err => {
            console.log(err);
        })
        
    }

    const onBackClick = () => {
        setBackDialogOpen(true);
    }

    const closeDialog = () => {
        setBackDialogOpen(false);
    }

    const backConfirmation = () => {
        closeDialog();
        navigate('/facility');
    }

    return (
        <Container maxWidth="sm" sx={{ mb: "4" }}>
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                <Typography component="h1" variant="h4" align="center">Add New Facility Details</Typography>
                <form onSubmit={onPostNewFacility}>
                    <Grid container spacing={3} sx={{ mt: '20px' }}>
                        <Grid item xs={12}>
                            <TextField
                                sx ={{
                                    '.MuiFormHelperText-root': {
                                        color: 'red'
                                    }
                                }}
                                fullWidth
                                label={"Facility Name"}
                                name="facilityName"
                                value={facilityData?.facilityName}
                                onChange={onFacilityDataChange}
                                helperText={
                                    facilityFormErrors.facilityName.required ?
                                        'Please enter Facility Name' :
                                        (facilityFormErrors.facilityName.maxLen ?
                                            "Name can't exceed 50 characters" :
                                            '')}
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
                                label={"Facility Location"}
                                name="location"
                                value={facilityData?.location}
                                onChange={onFacilityDataChange}
                                helperText={
                                    facilityFormErrors.location.required ?
                                        'Please enter Facility Location' :
                                        (facilityFormErrors.location.maxLen ?
                                            "Location can't exceed 50 characters" :
                                            '')}
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
                                name="description"
                                value={facilityData.description}
                                onChange={onFacilityDataChange}
                                helperText={
                                    facilityFormErrors.description.required ?
                                        'Please enter Facility Description' :
                                        (facilityFormErrors.description.maxLen ?
                                            "Description can't exceed 5000 characters" :
                                            '')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="facility-category-label">Category</InputLabel>
                                <Select
                                    labelId="facility-category-label"
                                    id="facility-category"
                                    name="category"
                                    value={facilityData.category}
                                    onChange={onFacilityDataChange}
                                    label="Category"
                                    fullWidth>
                                    <MenuItem value={'Gym'}>Gym</MenuItem>
                                    <MenuItem value={'Badminton'}>Badminton</MenuItem>
                                    <MenuItem value={'Swimming Pool'}>Swimming Pool</MenuItem>
                                    <MenuItem value={'Basket Ball'}>Basket Ball</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            {image !== null && <div className="ImageWrapper">
                                <img alt="no" src={imageUrl} className="ImagePreview" />
                                <IconButton sx={{
                                    position: 'absolute',
                                    top: '2%',
                                    right: '2%',
                                    zIndex: 100,
                                    filter: { invert: '100%', brightness: 1.25 },
                                    color: '#ffffff'
                                }}
                                    onClick={onDeleteImage}>
                                    <Delete fontSize="large" />
                                </IconButton>
                            </div>}
                            <label htmlFor="icon-button-file">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    sx={{ display: 'none' }}
                                    id="icon-button-file"
                                    onChange={onImageUpload}
                                />
                                <PhotoCamera />
                                {facilityFormErrors.image.required && <p className="ErrorText">Please upload a image</p>}
                            </label>
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button sx={{
                                color: '#000000',
                                backgroundColor: '#ffffff',
                                mr: '5px',
                                ':hover': {
                                    backgroundColor: '#000000',
                                    color: '#ffffff'
                                },
                            }}
                                onClick={onBackClick}
                                variant="contained">
                                Back
                            </Button>
                            <Button type="submit" value="submit" variant="contained">Post</Button>
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
}

export default AddNewFacility;