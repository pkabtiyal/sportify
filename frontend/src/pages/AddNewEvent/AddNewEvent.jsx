/* Author: Aravind Jayanthi (B00868943)
   Email: ar687531@dal.ca */
import { Delete, PhotoCamera } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, IconButton, Input, Paper, TextField, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getBackendUrl } from "../../components/getUrl";

const AddNewEvent = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    let minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    const [facilityData, setFacilityData] = useState({
        eventName: '',
        location: '',
        description: '',
        date: null,
        slots: 1,
    });
    const [facilityFormErrors, setFacilityFormErrors] = useState({
        eventName: {
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
        date: {
            required: false,
        },
        image: {
            required: false,
        },
        slots: {
            required: false,
            rangeError: false,
        }
    });
    const [backDialogOpen, setBackDialogOpen] = useState(false);

    const maxLengths = {
        facilityName: 50,
        location: 50,
        description: 5000
    }

    const minValues = {
        slots: 1
    };

    const maxValues = {
        slots: 500
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
        if (((propName === 'date' || propName === 'slots') && !propValue) && (!propValue || propValue === '' || propValue.trim() === '')) {
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
        else if ((minValues[propName] && minValues[propName] > propValue)
            || (maxValues[propName] && maxValues[propName] < propValue)) {
            setFacilityFormErrors({
                ...facilityFormErrors,
                [propName]: {
                    required: false,
                    rangeError: true,
                }
            });
            return true;
        }
        setFacilityFormErrors({
            ...facilityFormErrors,
            [propName]: {
                required: false,
                maxLen: false,
                rangeError: false,
            }
        });
        return false;
    }

    const validateFormData = () => {
        for (let prop of ['eventName', 'location', 'description', 'date', 'slots']) {
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

    const onDateChange = async (updatedDate) => {
        setFacilityData({
            ...facilityData,
            'date': updatedDate,
        });
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
            return;
        }
        const reqBody = {
            name: facilityData.eventName,
            location: facilityData.location,
            description: facilityData.description,
            date: facilityData.date,
            maxCapacity: facilityData.slots,
            availableCapacity: facilityData.slots,
            image: image
        };
        axios({
            method: 'post',
            url: `${getBackendUrl()}/events/create`,
            data: reqBody,
            headers: {
                "access-token": localStorage.getItem("access-token"),
            }
        }).then(res => {
            notify('success', 'Successfuly added the event');
            navigate('/events');
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
        navigate('/events');
    }

    return (
        <Container maxWidth="sm" sx={{ mb: "4" }}>
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                <Typography component="h1" variant="h4" align="center">Add New Event Details</Typography>
                <form onSubmit={onPostNewFacility}>
                    <Grid container spacing={3} sx={{ mt: '20px' }}>
                        <Grid item xs={12}>
                            <TextField
                                sx={{
                                    '.MuiFormHelperText-root': {
                                        color: 'red'
                                    }
                                }}
                                fullWidth
                                label={"Event Name"}
                                name="eventName"
                                value={facilityData?.eventName}
                                onChange={onFacilityDataChange}
                                helperText={
                                    facilityFormErrors.eventName.required ?
                                        'Please enter Facility Name' :
                                        (facilityFormErrors.eventName.maxLen ?
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
                                label={"Event Location"}
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
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Choose Date"
                                        value={facilityData.date}
                                        minDate={minDate}
                                        onChange={(newValue) => {
                                            onDateChange(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                    {facilityFormErrors.date.required && <p className="Error">Please pick a date!</p>}
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                name='slots'
                                label="Available Slots"
                                type='number'
                                value={facilityData.slots}
                                onChange={onFacilityDataChange}
                                inputProps={{ min: minValues.slots, max: maxValues.slots }}
                                helperText={facilityFormErrors.slots.required ? 'Please enter total participants!' : (facilityFormErrors.slots.rangeError ? `Available slots must be between ${minValues.slots} and ${maxValues.slots}` : '')}
                                sx={{
                                    '.MuiFormHelperText-root': {
                                        color: 'red'
                                    }
                                }}
                            />
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
                                    <Delete sx={{color: 'black'}} fontSize="large" />
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

export default AddNewEvent;