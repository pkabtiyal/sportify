/* Author: Aravind Jayanthi (B00868943)
   Email: ar687531@dal.ca */
import { Box, CircularProgress } from "@mui/material";

const Loader = () => {
    return (
        <Box sx={{display: 'flex', justifyContent: 'center', mt:'20px'}}>
            <CircularProgress/>
        </Box>
    );
}

export default Loader;