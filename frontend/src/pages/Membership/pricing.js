import React, { useLayoutEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import StarIcon from '@mui/icons-material/StarBorder';
import Typography from '@mui/material/Typography';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import "./membership.css";
import axios from 'axios';
import { getBackendUrl } from '../../components/getUrl';
import { getUser } from '../../components/getLocalStorage';

const tiers = [
  {
    title: 'Basic',
    price: '20',
    description: [
      ' Cardio - Workout',
      ' Stretch Room',
      ' 24/7 Access',
      ' Customer Support',
    ],
    buttonText: 'Get started',
    buttonVariant: 'contained',
  },
  {
    title: 'Premium',
    subheader: 'Most popular',
    price: '50',
    description: [
      ' Cardio, Stretch Room',
      ' Yoga and Zumba',
      ' Swimming, Badminton',
      ' Basketball, Floor Hockey',
      ' Priority email support',
    ],
    buttonText: 'Get started',
    buttonVariant: 'contained',
  },
  {
    title: 'Regular',
    price: '30',
    description: [
      ' Cardio - Workout',
      ' Stretch Room',
      ' Yoga and Zumba',
      ' 24/7 Access',
      ' Customer Support',
    ],
    buttonText: 'Get started',
    buttonVariant: 'contained',
  },
];





function Pricing() {

  const user = getUser();
  let userId = "";
  let disableButton = true;
  if(user!=null){
    userId = user._id;
    disableButton = user.profile == 'admin' ? true : false;
  }

  const navigate = useNavigate();
  const domain = getBackendUrl();
  const [render, setRender] = useState(false);
  useLayoutEffect(() => {
    axios
      .get(domain+'/api/membership/purchase/user/'+userId)
      .then((res) => {
        if(res.data.data.length >0) {
          let current = new Date();
          let endDate = new Date(res.data.data[0].end_date);
          if(endDate>=current){
            navigate('/purchased-membership', {state: {'memberships': res.data.data}});
          }
          else{
            //cancel membership automatically
            cancelMembership();
          }
        }
        else{
          setRender(true);
        }
      })

}, []);

  // useEffect(() => {
    
  // })

  const cancelMembership = () => {
    axios({
        method: 'put',
        url: domain+"/api/membership/cancel-purchase"
      }).catch(err => {
          console.log(err);
      })
}

  const moveToBilling = (tier) => {
    axios({
      method: 'get',
      url: domain+'/api/membership/billing-info/'+userId
    }).then(result => {
      let billing_info = {};
      let billing_error = true;
      let is_bill_existing = false;
      if(result.data.data !== "") {
        billing_info = result.data.data;
        billing_error = false;
        is_bill_existing = true;
      }
      navigate('/membership/checkout',{state:{'is_bill_existing':is_bill_existing,'billing_error':billing_error,'billing_info' : billing_info, 'product': {'name':tier.title, 'desc': tier.description, 'price': tier.price}}});
    }).catch(err => {
        console.log(err);
    })
      
  }

  return (
    <React.Fragment>
      {render === true ? (<div className="backgroundClassPricing">
          <React.Fragment>
          <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
          <CssBaseline />
          <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Pricing
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" component="p">
              Join Us!<br/>
              Choose one of our exciting plans that suits you well!
            </Typography>
          </Container>
          <Container maxWidth="md" component="main">
            <Grid container spacing={5} alignItems="flex-end">
              {tiers.map((tier) => (
                // Enterprise card is full width at sm breakpoint
                <Grid
                  item
                  key={tier.title}
                  xs={12}
                  sm={6}
                //   {tier.title === 'Enterprise' ? 12 : 6}
                  md={4}
                >
                  <Card>
                    <CardHeader
                      title={tier.title}
                      subheader={tier.subheader}
                      titleTypographyProps={{ align: 'center' }}
                      action={tier.title === 'Premium' ? <StarIcon /> : null}
                      subheaderTypographyProps={{
                        align: 'center',
                      }}
                      sx={{
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'light'
                            ? theme.palette.grey[200]
                            : theme.palette.grey[700],
                      }}
                    />
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'baseline',
                          mb: 2,
                        }}
                      >
                        <Typography component="h2" variant="h3" color="text.primary">
                          ${tier.price}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                          /mo
                        </Typography>
                      </Box>
                      <ul>
                        {tier.description.map((line) => (
                          <Typography 
                            
                            component="li"
                            variant="subtitle1"
                            align="center"
                            key={line}
                          >
                            {line}
                          </Typography>
                        ))}
                      </ul>
                    </CardContent>
                    <CardActions>
                      <Button disabled={disableButton} fullWidth variant={tier.buttonVariant} onClick={() =>moveToBilling(tier)}>
                        {tier.buttonText} 
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </React.Fragment>
      </div> ) :
        (<></>)
      }
    </React.Fragment>
  );
}

export default Pricing;