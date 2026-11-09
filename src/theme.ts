import { createTheme } from '@mui/material/styles';

export const tokens = {
    ink: '#14171F',
    textSecondary: '#4B5363',
    textMuted: '#5B6475',
    divider: '#E3E6EB',
    rowDivider: '#EEF0F3',
    inputBorder: '#D0D5DD',
    primary: '#3550D8',
    primaryDark: '#2A40AE',
    primarySoft: '#EEF1FD',
    headerBg: '#FAFBFC',
    background: '#F5F6F8',
    paper: '#FFFFFF',
    skeleton: '#EDEFF3',
    cardRadius: 12,
    menuShadow: '0 12px 32px rgba(20, 23, 31, 0.18)',
} as const;

const mono = '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace';

export const appTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: tokens.primary,
            dark: tokens.primaryDark,
            light: '#6D82E5',
            contrastText: tokens.paper,
        },
        secondary: { main: '#5B30AD' },
        error: { main: '#B42318' },
        warning: { main: '#B54708' },
        success: { main: '#067647' },
        text: { primary: tokens.ink, secondary: tokens.textSecondary },
        divider: tokens.divider,
        background: { default: tokens.background, paper: tokens.paper },
    },
    shape: { borderRadius: 8 },
    typography: {
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        fontMono: mono,
        h4: { fontSize: '32px', lineHeight: '40px', fontWeight: 700 },
        h6: { fontSize: '18px', lineHeight: '24px', fontWeight: 600 },
        subtitle1: { fontSize: '16px', lineHeight: '24px', fontWeight: 600 },
        body1: { fontSize: '14px', lineHeight: '20px' },
        body2: { fontSize: '14px', lineHeight: '20px' },
        caption: { fontSize: '12px', lineHeight: '16px' },
        overline: {
            fontSize: '12px',
            lineHeight: '16px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
        },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: { backgroundColor: tokens.background, color: tokens.ink },
                // Design calls for one focus ring on every focusable element.
                '*:focus-visible': {
                    outline: `2px solid ${tokens.primary}`,
                    outlineOffset: '2px',
                },
            },
        },
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: { borderRadius: 8, minHeight: 40, paddingInline: 16 },
                sizeSmall: { minHeight: 32, paddingInline: 12 },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: { borderRadius: 6 },
                notchedOutline: { borderColor: tokens.inputBorder },
            },
        },
        MuiPaper: {
            styleOverrides: { rounded: { borderRadius: tokens.cardRadius } },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    borderRadius: 10,
                    border: `1px solid ${tokens.divider}`,
                    boxShadow: tokens.menuShadow,
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: { root: { minHeight: 36, fontSize: '13px' } },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    textAlign: 'left',
                    fontSize: '14px',
                    borderBottom: `1px solid ${tokens.rowDivider}`,
                    paddingBlock: 0,
                    paddingInline: 16,
                },
                head: {
                    height: 44,
                    backgroundColor: tokens.headerBg,
                    color: tokens.textSecondary,
                    fontSize: '12px',
                    fontWeight: 600,
                    borderBottom: `1px solid ${tokens.divider}`,
                },
                body: { height: 52 },
            },
        },
    },
});

declare module '@mui/material/styles' {
    interface TypographyVariants {
        fontMono: string;
    }
    interface TypographyVariantsOptions {
        fontMono?: string;
    }
}
