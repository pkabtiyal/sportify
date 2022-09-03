// Author : Soham Kansodaria

import { Button, Grid, Stack } from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function Footer(props) {

  return (
    <footer style={{width:"100%",marginTop:"30px"}}>
      <Container maxWidth sx={{ backgroundColor: "#eee",width:"100%",py:"25px" }}>
        <Grid container>
            {/* <Grid item xl={2} lg={2} md={2} sm={11} xs={11} container justifyContent={{xs:"center",md:"start"}}>
                <Link href="#" color="inherit" underline="none">
                    <img src={Logo} alt="Sportify" width="110px" />
                </Link>
            </Grid> */}
            <Grid item xl={9} lg={9} md={9} sm={11} xs={11}>
                <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1, sm: 2, md: 4 }}
                >
                <Button href="/membership" variant="body1" color="textPrimary">
                    Membership
                </Button>
                <Button href="/events" variant="body1" color="textPrimary">
                    Events
                </Button>
                <Button href="/facility" variant="body1" color="textPrimary">
                    Facility
                </Button>
                <Button href="/blogs" variant="body1" color="textPrimary">
                    Blogs
                </Button>
                <Button href="/store" variant="body1" color="textPrimary">
                    Store
                </Button>
                </Stack>
            </Grid>
            <Grid item xl={3} lg={3} md={3} sm={11} xs={11} container justifyContent={{xs:"center",md:"end"}}>
                <Typography
                    color="textSecondary"
                    component="p"
                    variant="caption"
                    alignSelf="center"
                    sx={{ float: "right" }}
                >
                    Made by Group 10 with ❤️
                </Typography>
            </Grid>
        </Grid>
      </Container>
    </footer>
  );
}
