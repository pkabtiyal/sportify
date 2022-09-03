import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
import { Button, styled, TextField } from "@mui/material";

const ValidationTextField = styled((props) => (<TextField
    InputProps={{disableUnderline: true}}
    {...props} />))
(({theme}) => ({
    marginBottom: "10px",
    display: "flex",
    '& .MuiFilledInput-root': {
        border: '2px solid #e2e2e1',
        overflow: 'hidden',
        borderRadius: 3,
        backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
        transition: theme.transitions.create([
            'border-color',
            'background-color',
            'box-shadow',
        ]),
        '&:hover': {
            border: '2px solid #e2e2e1',
            backgroundColor: 'transparent',
        },
        '&.Mui-focused': {
            backgroundColor: 'transparent',
            borderColor: theme.palette.primary.main,
        },
        '&.Mui-error': {
            borderColor: theme.palette.error.main,
        }
    },
    '& fieldset': {
        borderRadius: "30px"
    }
}));

// cite : https://dev.to/finallynero/react-form-using-formik-material-ui-and-yup-2e8h
// I used some of the code from article, but I change as per my preferences

export const ForgotPasswordForm = props => {

    const {
        values: {email},
        errors,
        handleSubmit,
        handleChange,
        isValid
    } = props;

    return (
        <form onSubmit={handleSubmit}>
            <ValidationTextField
                name="email"
                helperText={errors.email ? errors.email : " "}
                error={Boolean(errors.email)}
                label="Email*"
                type="email"
                value={email}
                variant="filled"
                placeholder="Enter your email"
                onChange={handleChange}
                InputProps={{ // <-- This is where the toggle button is added.
                    disableUnderline: true}}
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                className="flex-center"
                startIcon={<LockResetOutlinedIcon/>}
                disabled={!isValid}
            >
                Reset Password
            </Button>
        </form>

    );
};
