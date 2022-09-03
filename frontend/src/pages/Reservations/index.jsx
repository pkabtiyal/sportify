//Author: Aravind Jayanthi (B00868943)
//Email: ar687531@dal.ca
import { Box, FormControl, MenuItem, Pagination, Select, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import ReservationItem from "./ReservationItem";
import '../../App.css';
import './Reservations.css'
import { useLocation, useNavigate } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@mui/material/Alert';
import Loader from "../../components/Loader";
import axios from "axios";
import NoReservations from "../../components/NoReservations";
import { getUser } from "../../components/getLocalStorage";
import { getBackendUrl } from "../../components/getUrl";


const ReservationList = () => {

    const itemsPerPage = 5;
    const [isLoading, setIsLoading] = useState(true);
    const [completeList, setCompleteList] = useState([]);
    const [page, setPage] = useState(0);
    const [list, setList] = useState([]);
    const [defaultItemsPerPage, setDetaultItemsPerPage] = useState(itemsPerPage);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();
    const { state } = useLocation();
    const [snackbarMsg] = useState(state?.snackbarMsg);
    const [snackbarOpen, setSnackbarOpen] = useState({ open: (!!state?.snackbar), vertical: 'top', horizontal: 'right' });
    const { open, vertical, horizontal } = snackbarOpen;

    const maxPagesMd = 5;

    const maxPagesSm = 3;

    const maxPagesXs = -1;

    useEffect(() => {
        axios.get(`${getBackendUrl()}/reservation/my-reservations/${getUser()?._id}`,{
            headers: {
                "access-token": localStorage.getItem("access-token"),
            }
        }).then(res => res.data).then(content => {
                setIsLoading(false);
                setCompleteList(content.data);
                setList(content.data.slice(0, Math.min(5, content.data.length)));
                setTotalPages(Math.ceil(content.data.length / defaultItemsPerPage));
            }).catch((err) => {
                console.log(err);
            })
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
        setList(completeList.slice(start, end));
    }

    const updatePagination = (pageNumber, itemsPerPage) => {
        updatePageList(pageNumber, itemsPerPage);
        setPage(pageNumber);
    }

    const onPaginationChange = (event, value) => {
        updatePagination(value, defaultItemsPerPage);
    }

    const reservationList = list.map((reservation) => {
        return (<ReservationItem key={reservation.id} reservationDetails={reservation}></ReservationItem>);
    });

    const onCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen({ ...snackbarOpen, open: false });
        navigate(".", {replace: true});
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
        <div>
            {
                (isLoading) ? (<Loader />) : (
                    (!completeList || completeList.length === 0) ? (<NoReservations/>) :
                        (<>
                            <Box sx={{ margin: '10px 15%', display: { md: 'flex', xs: 'none', sm: 'none' }, flexDirection: 'column' }}>
                                {reservationList}
                            </Box>
                            <Box sx={{ margin: '10px 5%', display: { xs: 'none', sm: 'flex', md: 'none' }, flexDirection: 'column' }}>
                                {reservationList}
                            </Box>
                            <Box sx={{ margin: '10px 0%', display: { xs: 'flex', sm: 'none', md: 'none' }, flexDirection: 'column' }}>
                                {reservationList}
                            </Box>
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
                                            <MenuItem value={5}>5 per page</MenuItem>
                                            <MenuItem value={10}>10 per page</MenuItem>
                                            <MenuItem value={20}>20 per page</MenuItem>
                                            <MenuItem value={30}>30 per page</MenuItem>
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
                        </>)
                )
            }
        </div>
    );
}

export default ReservationList;
