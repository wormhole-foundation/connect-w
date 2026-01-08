'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    TextField,
    Button,
    Alert,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { wormholeTheme } from '@/lib/theme';

export function LoginForm() {
    const router = useRouter();
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                router.push('/');
                router.refresh();
            } else {
                setError('Invalid password');
            }
        } catch {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const toggleShowPassword = () => {
        setShowPassword((prev: boolean) => !prev);
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                autoFocus
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={toggleShowPassword}
                                    edge="end"
                                    aria-label={
                                        showPassword
                                            ? 'Hide password'
                                            : 'Show password'
                                    }
                                    sx={{
                                        color: wormholeTheme.colors.textMuted,
                                    }}
                                >
                                    {showPassword ? (
                                        <VisibilityOff />
                                    ) : (
                                        <Visibility />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
                sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                        bgcolor: wormholeTheme.colors.bgCard,
                        color: wormholeTheme.colors.textPrimary,
                        borderRadius: wormholeTheme.borderRadius.md,
                        '& fieldset': {
                            borderColor: wormholeTheme.colors.border,
                        },
                        '&:hover fieldset': {
                            borderColor: wormholeTheme.colors.borderHover,
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: wormholeTheme.colors.primary,
                            borderWidth: '2px',
                        },
                    },
                    '& .MuiInputBase-input::placeholder': {
                        color: wormholeTheme.colors.textMuted,
                    },
                }}
            />

            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                        bgcolor: 'rgba(239, 68, 68, 0.1)',
                        color: wormholeTheme.colors.error,
                        border: `1px solid ${wormholeTheme.colors.error}`,
                        borderRadius: wormholeTheme.borderRadius.md,
                        '& .MuiAlert-icon': {
                            color: wormholeTheme.colors.error,
                        },
                    }}
                    role="alert"
                >
                    {error}
                </Alert>
            )}

            <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading || !password}
                sx={{
                    py: 1.5,
                    background: wormholeTheme.gradients.button,
                    borderRadius: wormholeTheme.borderRadius.md,
                    boxShadow: wormholeTheme.shadows.button,
                    '&:hover': {
                        background: wormholeTheme.gradients.buttonHover,
                    },
                    '&:disabled': {
                        background: 'rgba(139, 92, 246, 0.2)',
                        color: wormholeTheme.colors.textMuted,
                    },
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    letterSpacing: '0.02em',
                }}
            >
                {loading ? 'Verifying...' : 'Continue'}
            </Button>
        </Box>
    );
}
