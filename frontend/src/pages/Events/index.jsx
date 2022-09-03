//Author: Aravind Jayanthi (B00868943)
//Email: ar687531@dal.ca
import { Button, Container, FormControl, Grid, MenuItem, Pagination, Select, Snackbar } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EventItem from "../../components/EventItem";
import { useEffect, useState } from "react";
import MuiAlert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import { useLocation, useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import Loader from "../../components/Loader";
import axios from "axios";
import { getBackendUrl } from "../../components/getUrl";
import NoEvents from "../../components/NoEvents";
import { getUser } from "../../components/getLocalStorage";
import { primaryColor, whiteThemeColor } from "../../Theme/colors";

const EventsList = () => {
    const itemsPerPage = 8;
    const [isLoading, setIsLoading] = useState(true);
    const [completeList, setCompleteList] = useState([]);
    const [noEvents, setNoEvents] = useState(false);
    const [page, setPage] = useState(0);
    const [displayList, setDisplayList] = useState([]);
    const [defaultItemsPerPage, setDetaultItemsPerPage] = useState(itemsPerPage);
    const [totalPages, setTotalPages] = useState(0);
    const [loggedInUserRole] = useState(getUser()?.profile);

    const maxPagesMd = 5;

    const maxPagesSm = 3;

    const maxPagesXs = -1;

    const navigate = useNavigate();
    const { state } = useLocation();
    const [snackbarMsg] = useState(state?.snackbarMsg);
    const [snackbarOpen, setSnackbarOpen] = useState({ open: (!!state?.snackbar), vertical: 'top', horizontal: 'right' });
    const { open, vertical, horizontal } = snackbarOpen;

    useEffect(() => {
        axios.get(`${getBackendUrl()}/events/fetch`)
            .then(res => res.data).then(content => {
                setIsLoading(false);
                setCompleteList(content.data);
                setDisplayList(content.data.slice(0, Math.min(defaultItemsPerPage, content.data.length)));
                setTotalPages(Math.ceil(content.data.length / defaultItemsPerPage));
                if (content.data.length === 0) {
                    setNoEvents(true);
                }
            }).catch((err) => {
                console.log(err);
            });
    }, []);

    const updateDefaulItemsPerPage = (event) => {
        const itemsPerPageTemp = (+event.target.value);
        const totalPagesTemp = Math.ceil(completeList.length / itemsPerPageTemp);
        setDetaultItemsPerPage((+event.target.value));
        updatePagination(1, itemsPerPageTemp);
        setTotalPages(totalPagesTemp);
    }

    const updatePageList = (pageNumber, itemsPerPage) => {
        const start = (pageNumber - 1) * itemsPerPage;
        const end = (pageNumber) * itemsPerPage;
        setDisplayList(completeList.slice(start, end));
    }

    const updatePagination = (pageNumber, itemsPerPage) => {
        updatePageList(pageNumber, itemsPerPage);
        setPage(pageNumber);
    }

    const onPaginationChange = (event, value) => {
        updatePagination(value, defaultItemsPerPage);
    }

    const onCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen({ ...snackbarOpen, open: false });
        navigate(".", { replace: true });
    }

    const onAddNewEventClick = () => {
        navigate('/events/add-new');
    }

    const snackbarCloseAction = (<IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={onCloseSnackbar}
    >
        <CloseIcon fontSize="small" />
    </IconButton>);

    return (
        (isLoading) ? (<Loader />) : (
            (noEvents) ? (<NoEvents />) : (
                <Container maxWidth='xl'>
                    {(loggedInUserRole === 'admin') &&
                        (
                            <FormControl sx={{
                                display: 'flex',
                                flexDirection: {
                                    md: 'row',
                                    sm: 'column',
                                    xs: 'column'
                                },
                                m: '10px auto',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Button
                                    sx={{ color: whiteThemeColor, backgroundColor: primaryColor }}
                                    variant="contained"
                                    onClick={onAddNewEventClick}>
                                    <AddIcon sx={{ mr: '3px' }} /> Add new Event
                                </Button>
                            </FormControl>
                        )}
                    <Grid sx={{ my: '10px' }} container spacing={2}>
                        {displayList.map((event) => {
                            return (
                                <EventItem key={event.id} event={event}></EventItem>
                            );
                        })}
                    </Grid>
                    <div className="Footer">
                        {totalPages > 1 &&
                            (<div className="Pagination">

                                <Pagination sx={{
                                    my: "15px",
                                    display: { md: 'flex', sm: 'none', xs: 'none' },
                                    justifyContent: 'center',
                                }}
                                    count={totalPages}
                                    siblingCount={Math.min(totalPages, maxPagesMd)}
                                    page={page}
                                    onChange={onPaginationChange}
                                />
                                <Pagination sx={{
                                    my: "15px",
                                    display: { md: 'none', sm: 'flex', xs: 'none' },
                                    justifyContent: 'center'
                                }}
                                    count={totalPages}
                                    siblingCount={Math.min(totalPages, maxPagesSm)}
                                    page={page}
                                    onChange={onPaginationChange}
                                />
                                <Pagination sx={{
                                    my: "15px",
                                    display: { md: 'none', xs: 'flex', sm: 'none' },
                                    justifyContent: 'center'
                                }}
                                    count={totalPages}
                                    siblingCount={Math.min(totalPages, maxPagesXs)}
                                    boundaryCount={0}
                                    page={page}
                                    onChange={onPaginationChange}
                                    showLastButton={false}
                                />
                            </div>)
                        }
                        <div className="Select-items">
                            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <Select
                                    labelId="demo-controlled-open-select-label"
                                    id="demo-controlled-open-select"
                                    value={defaultItemsPerPage}
                                    onChange={updateDefaulItemsPerPage}
                                >
                                    <MenuItem value={8}>8 per page</MenuItem>
                                    <MenuItem value={16}>16 per page</MenuItem>
                                    <MenuItem value={24}>24 per page</MenuItem>
                                    <MenuItem value={32}>32 per page</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>
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
                </Container>))
    );
}

export default EventsList;