import * as React from "react";
import { Button, TextField, InputAdornment } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "./SearchPageStyle.css";
import Autocomplete from "@mui/material/Autocomplete";

export default function MainSearch() {
  const [data, setData] = useState([]);
  const [searched, setSearched] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);

  const dataPerPage = 6;
  var showData = 0;
  const pagesVisited = pageNumber * dataPerPage;

  const pageCount = Math.ceil(data.length / dataPerPage);

  useEffect(() => {
    getFacilities();
  }, []);

  async function getFacilities() {
    const res = await axios.get(
      "https://sportify-backend-prd.herokuapp.com/search/facility/"
    );
    setData(res.data.data);
    showData = 1;
    // setSearched(res.data.data);
  }

  const filter = (e) => {
    const keyword = e.target.value;

    if (keyword !== "") {
      const results = data.filter((facility) => {
        return facility.name.toLowerCase().startsWith(keyword.toLowerCase());
      });
      setSearched(results);
      showData = 0;
    } else {
      setSearched("");
      showData = 1;
    }
  };

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <main>
      <Container maxWidth="xl">
        <Autocomplete
          freeSolo
          id="free-solo-2-demo"
          disableClearable
          onChange={filter}
          options={data.map((facility) => facility.name)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Quick search for facilities..."
              type="search"
              variant="filled"
              color="success"
              fullWidth
              size="normal"
              onChange={filter}
              InputProps={{
                ...params.InputProps,
                type: "search",
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" sx={{ fontSize: 28 }} />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        {searched.length > 0 && searched ? (
          <Container sx={{ py: 8, display: "block" }}>
            <Grid container component="main" alignItems="stretch" spacing={3}>
              {searched
                .slice(pagesVisited, pagesVisited + dataPerPage)
                .map((facility) => {
                  return (
                    <Grid item xs={12} md={4} lg={4}>
                      <Card
                        key={`${facility.id}`}
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <CardMedia
                          component="img"
                          className={facility.image}
                          image={`${facility.image}`}
                          alt="new"
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography
                            gutterBottom
                            variant="h5"
                            component="h2"
                            fontWeight={"bold"}
                            color="#326DD9"
                          >
                            {`${facility.name}`}
                          </Typography>
                          <Typography>
                            Category: {`${facility.category}`}, Location:{" "}
                            {`${facility.location}`}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button
                            variant="contained"
                            size="medium"
                            href={"/facility/" + facility.id}
                          >
                            Click Here to register
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })}
            </Grid>
            <ReactPaginate
              previousLabel={"← Previous"}
              nextLabel={"Next →"}
              pageCount={pageCount}
              onPageChange={changePage}
              containerClassName={"pagination"}
              previousLinkClassName={"pagination__link"}
              nextLinkClassName={"pagination__link"}
              disabledClassName={"pagination__link--disabled"}
              activeClassName={"pagination__link--active"}
            />
          </Container>
        ) : (
          <Container maxWidth="xl">
            <Box
              sx={{
                bgcolor: "black",
                pt: 8,
                pb: 6,
              }}
            >
              <Container maxWidth="xl">
                <Typography
                  component="h1"
                  variant="h5"
                  align="center"
                  color="#326DD9"
                  fontWeight={"bold"}
                  gutterBottom
                >
                  SELECT WHAT YOU WANT TO SEARCH!
                </Typography>
              </Container>
            </Box>
            <Container sx={{ py: 8 }} maxWidth="lg">
              <Grid container rowSpacing={2} columnSpacing={2}>
                <Grid item xs={12} lg={6} md={6}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image="/merchandise.svg"
                      alt="random"
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        fontWeight={"bold"}
                        color="#326DD9"
                      >
                        Store
                      </Typography>
                      <Typography>
                        This is a media card. You can use this section to
                        describe the content.
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="contained"
                        size="medium"
                        href="/merchandiseSearch"
                      >
                        Search here
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>

                <Grid item xs={12} lg={6} md={6}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image="/facility.svg"
                      alt="random"
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        fontWeight={"bold"}
                        color="#326DD9"
                      >
                        Facility
                      </Typography>
                      <Typography>
                        This is a media card. You can use this section to
                        describe the content.
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="contained"
                        size="medium"
                        href="/facilitySearch"
                      >
                        Search here
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>

                <Grid item xs={12} lg={6} md={6}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image="/event.svg"
                      alt="random"
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        fontWeight={"bold"}
                        color="#326DD9"
                      >
                        Event
                      </Typography>
                      <Typography>
                        This is a media card. You can use this section to
                        describe the content.
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="contained"
                        size="medium"
                        href="/eventSearch"
                      >
                        Search here
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>

                <Grid item xs={12} lg={6} md={6}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image="/blogging.svg"
                      alt="random"
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        fontWeight={"bold"}
                        color="#326DD9"
                      >
                        Blogs
                      </Typography>
                      <Typography>
                        This is a media card. You can use this section to
                        describe the content.
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="contained"
                        size="medium"
                        href="/blogSearch"
                      >
                        Search here
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </Container>
          </Container>
        )}
      </Container>
    </main>
  );
}
