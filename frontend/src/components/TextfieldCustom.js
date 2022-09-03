import {
    styled,
    TextField
} from "@mui/material";

export const ReadOnlyTextField = styled((props) => (<TextField
    InputProps={{readOnly: true, disableUnderline: true}}
    {...props} />))
(({theme}) => ({
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
    },
    '& fieldset': {
        borderRadius: "30px"
    },
}));

export const EditTextField = styled((props) => (<TextField
    InputProps={{disableUnderline: true}}
    {...props} />))
(({theme}) => ({
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
    },
    '& fieldset': {
        borderRadius: "30px"
    },
}));

export const ValidationTextField = styled((props) => (<TextField
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