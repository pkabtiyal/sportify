import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Delete, PhotoCamera } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Input, TextField, Typography } from '@mui/material';
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const { v4: uuidv4 } = require("uuid");
/**
 * @author
 * @function EditBlog
 **/

const baseURL =
  "https://sportify-backend-prd.herokuapp.com/blogs/api/blogs/blog";
const baseURL2 =
  "https://sportify-backend-prd.herokuapp.com/blogs/api/blogs/updateBlog";
const EditBlog = (props) => {
  const [data2, setData2] = useState([]);
  const [data, setData] = useState([]); // to fetrch the data from the database
  const [blogTitle, setBlogTitle] = useState([]);
  // const [image, setImage] = useState(null);
  const notify = () => toast("Under Construction as it involves database!");
  const navigate = useNavigate();
  let params = useParams();
  const resId = params.id;
  const shortContent = data2.toString().split(" ");
  var first_line = shortContent.slice(0, 19).join(" ");

  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    axios.get(baseURL + "/" + resId).then((response) => {
      console.log(response.data);
      // response.data.data.shortContent = parse(response.data.data.shortContent);
      console.log(response.data.data.blogTitle);
      setData(response.data.data);
      console.log(data.blogContent);
    });
  }, []);

  const handleChange = (e) => {
    setBlogTitle(e.target.value);
  };

  const onImageUpload = (event) => {
    const img = event.target.files[0];
    const reader = new FileReader(img);
    reader.readAsDataURL(img);
    reader.onload = () => {
      setImage(reader.result);
      setImageUrl(URL.createObjectURL(img));
    };
  };

  const onDeleteImage = () => {
    setImageUrl(null);
    setImage(null);
  };

  const fileSelectHandler = (e) => {
    const img = e.target.files[0];
    const reader = new FileReader(img);
    reader.readAsDataURL(img);
    reader.onload = () => {
      setImage(reader.result);
      console.log(reader.result);
    };
  };

  const myFunction = (e) => {
    e.preventDefault();
    const jsonData = {
      id: resId,
      blogContent: data2,
      blogTitle: blogTitle,
      blogImage: image,
      shortContent: first_line,
      userId: data.userId,
      timeStamp: Date.now().toString(),
    };
    console.log({ jsonData });

    axios.put(baseURL2, { jsonData }).then(
      (response) => {
        navigate("/blogs");
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  return (
    <div>
      <div>
        <Grid container direction="row" spacing={2} columns={12}>
          <Grid item xs={8}>
            <Box
              sx={{
                marginLeft: "15%",
                marginY: "15%",
                width: "80%",
                height: "80%",
                backgroundColor: "#DFF6FF",
                "&:hover": {
                  backgroundColor: "#DFF6FF",
                  opacity: [0.9, 0.8, 0.7],
                },
              }}
            >
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  color: "#234c99",
                }}
              >
                Edit Blog
              </Typography>
              <div>
                <TextField
                  fullWidth
                  label="Title"
                  id="fullWidth"
                  sx={{
                    marginX: "5%",
                    marginY: "5%",
                    width: "80%",
                    backgroundColor: "white",
                    "&:hover": {
                      backgroundColor: "white",
                      opacity: [0.9, 0.8, 0.7],
                    },
                  }}
                  value={data.blogTitle}
                  onChange={handleChange}
                />
              </div>
              <div className="gridmargins">
                <CKEditor
                  editor={ClassicEditor}
                  data={data.blogContent}
                  onReady={(editor) => {
                    // You can store the "editor" and use when it is needed.
                    console.log("Editor is ready to use!", editor);
                  }}
                  onChange={(event, editor) => {
                    console.log({ event, editor, data });
                    setData2(editor.getData());
                    console.log(data2);
                  }}
                  onBlur={(event, editor) => {
                    console.log("Blur.", editor);
                  }}
                  onFocus={(event, editor) => {
                    console.log("Focus.", editor);
                  }}
                />
              </div>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Grid container direction="column" spacing={2} columns={12}>
              <Grid item xs={6}>
                <Box
                  sx={{
                    marginX: "10%",
                    marginY: "15%",
                    paddingY: "25%",
                  }}
                >
                  {/* // <Button sx={{width:"50%"}} variant="contained" onClick={notify}><ToastContainer />Upload Image</Button>
                        </Box>
                            
                            </Grid>
                            <Grid item xs={6}>
                            <Box
                            sx={{
                                marginX: "10%",
                                marginY: "5%",
                                paddingY:"25%"
                            }}
                        > */}
                  <div>
                    {/* <input type="file" onChange={fileSelectHandler}></input>
                            <button onClick={fileSelectHandler}/> */}
                    {image !== null ? (
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
                    ) : (<img src={data.blogImage} className="img-responsive"></img>) }
                    <label htmlFor="icon-button-file">
                      <Input
                        type="file"
                        accept="image/*"
                        sx={{ display: "none" }}
                        id="icon-button-file"
                        onChange={onImageUpload}
                      />
                      <PhotoCamera />
                    </label>
                  </div>
                  <Button
                    sx={{ width: "50%" }}
                    variant="contained"
                    onClick={myFunction}
                  >
                    Edit Blog!
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default EditBlog;
