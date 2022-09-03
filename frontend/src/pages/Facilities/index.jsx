//Author: Aravind Jayanthi (B00868943)
//Email: ar687531@dal.ca
import { Checkbox, Container, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Snackbar, Stack, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FacilityItem from "../../components/FacilityItem";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@mui/material/Alert';
import axios from "axios";
import './Facilities.css';
import AddIcon from '@mui/icons-material/Add';
import { primaryColor, whiteThemeColor } from "../../Theme/colors";
import Loader from "../../components/Loader";
import { getUser } from "../../components/getLocalStorage";
import { getBackendUrl } from "../../components/getUrl";

export default function Facilities() {

    const navigate = useNavigate();
    const [categoryFilters, setCategoryFilters] = useState({
        gym: false,
        badminton: false,
        pool: false,
        basketBall: false
    });
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        axios.get(`${getBackendUrl()}/facility/all`).then(response => response.data)
            .then(content => {
                setIsLoading(false);
                setOriginalList(content.data);
                setDisplayList(content.data);
            });
    }, []);
    const { state } = useLocation();
    const [snackbarMsg] = useState(state?.snackbarMsg);
    const [snackbarOpen, setSnackbarOpen] = useState({ open: (!!state?.snackbar), vertical: 'top', horizontal: 'right' });
    const { open, vertical, horizontal } = snackbarOpen;
    const [loggedInUserRole] = useState(getUser()?.profile);

    const onCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen({ ...snackbarOpen, open: false });
        navigate(".", { replace: true });
    }

    const snackbarCloseAction = (<IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={onCloseSnackbar}
    >
        <CloseIcon fontSize="small" />
    </IconButton>);

    const [displayList, setDisplayList] = useState([]);
    const [originalList, setOriginalList] = useState([]);
    const { gym, badminton, pool, basketBall } = categoryFilters;


    const onFiltersChange = (event) => {
        let updatedFilters = { ...categoryFilters, [event.target.name]: event.target.checked };
        setCategoryFilters({
            ...categoryFilters,
            [event.target.name]: event.target.checked
        });
        applyFilters(updatedFilters);
    };

    const applyFilters = (filters) => {
        let filteredList = originalList.filter((item) => {
            let result = false;
            if (filters.gym) {
                result = result || (item.category === 'Gym');
            }
            if (filters.badminton) {
                result = result || (item.category === 'Badminton');
            }
            if (filters.pool) {
                result = result || (item.category === 'Swimming Pool');
            }
            if (filters.basketBall) {
                result = result || (item.category === 'Basket Ball');
            }
            if (!(filters.gym || filters.badminton || filters.pool || filters.basketBall)) {
                return true;
            }
            return result;
        });
        setDisplayList(filteredList);
    }

    const onAddNewFacilityClick = () => {
        navigate('/facility/add-new');
    }

    return (
        <Container maxWidth='xl'>
            <div className="Filters">
                <FormControl sx={{ display: 'flex', flexDirection: { md: 'row', sm: 'column', xs: 'column' }, m: '10px auto', alignItems: 'center', justifyContent: 'center' }}>
                    <FormLabel sx={{ mt: '8px', mr: '20px' }} component="legend">Categories:</FormLabel>
                    <Stack directions={{ xs: 'row', sm: 'row', md: 'column', lg: 'row', xl: 'row' }}>
                        <FormGroup sx={{ flexDirection: { md: 'row', sm: 'column', xs: 'column' } }}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={gym} onChange={onFiltersChange} name="gym" />
                                }
                                label="Gym"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox checked={badminton} onChange={onFiltersChange} name="badminton" />
                                }
                                label="Badminton"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox checked={pool} onChange={onFiltersChange} name="pool" />
                                }
                                label="Swimming Pool"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox checked={basketBall} onChange={onFiltersChange} name="basketBall" />
                                }
                                label="Basket Ball"
                            />
                        </FormGroup>
                    </Stack>
                    {(loggedInUserRole === 'admin') && <Button
                        sx={{ m: '10px', color: whiteThemeColor, backgroundColor: primaryColor }}
                        variant="contained"
                        onClick={onAddNewFacilityClick}>
                        <AddIcon sx={{ mr: '3px' }} /> Add new Facility
                    </Button>}
                </FormControl>
            </div>
            {(isLoading) ? (<Loader />) : (
                <Grid container spacing={2}>
                    {displayList.map((facility) => {
                        return (
                            <FacilityItem key={facility.id} facility={facility}></FacilityItem>
                        );
                    })}
                </Grid>)}
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                autoHideDuration={3000}
                onClose={onCloseSnackbar}
                action={snackbarCloseAction}
            >
                <MuiAlert onClose={onCloseSnackbar} severity="success" sx={{ width: '100%' }} elevation={6} variant="filled">
                    {snackbarMsg}
                </MuiAlert>
            </Snackbar>
        </Container>
    );
}