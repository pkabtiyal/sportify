import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Button, InputAdornment, styled, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";

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

export const ChangePasswordForm = props => {

    const [visiblePassword, setVisiblePassword] = useState(false);
    const showPassword = () => setVisiblePassword(!visiblePassword);
    const hiddenPassword = () => setVisiblePassword(!visiblePassword);

    const [visibleCPassword, setVisibleCPassword] = useState(false);
    const showCPassword = () => setVisibleCPassword(!visibleCPassword);
    const hiddenCPassword = () => setVisibleCPassword(!visibleCPassword);

    const {
        values: {email,password,confirmPassword},
        errors,
        handleSubmit,
        handleChange,
        isValid,
        isVerified
    } = props;

    console.log(props.isVerified);

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
                    disableUnderline: true,
                    readonly:true}}
            />

            <ValidationTextField
                name="password"
                helperText={errors.password ? errors.password : " "}
                error={Boolean(errors.password)}
                label="Password*"
                type={visiblePassword ? "text" : "password"}
                value={password}
                variant="filled"
                placeholder="Enter your password"
                sx={{marginBottom:"1px"}}
                InputProps={{ // <-- This is where the toggle button is added.
                    disableUnderline: true
                    ,endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle show password"
                                onClick={showPassword}
                                onMouseDown={hiddenPassword}
                            >
                                {visiblePassword ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                            </IconButton>
                        </InputAdornment>
                    )
                }}
                onChange={handleChange}
            />
            <ValidationTextField
                name="confirmPassword"
                helperText={errors.confirmPassword ? errors.confirmPassword : " "}
                error={Boolean(errors.confirmPassword)}
                label="Confirm Password*"
                type={visibleCPassword ? "text" : "password"}
                value={confirmPassword}
                variant="filled"
                placeholder="Enter your password again"
                sx={{marginBottom:"1px"}}
                InputProps={{ // <-- This is where the toggle button is added.
                    disableUnderline: true
                    ,endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle show password"
                                onClick={showCPassword}
                                onMouseDown={hiddenCPassword}
                            >
                                {visibleCPassword ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                            </IconButton>
                        </InputAdornment>
                    )
                }}
                onChange={handleChange}
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
                Change Password
            </Button>
        </form>

    );
};
