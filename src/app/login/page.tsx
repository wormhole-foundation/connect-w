'use client';

import { Box } from '@mui/material';
import { LoginCard, LoginForm } from '@/components/ui';
import { wormholeTheme } from '@/lib/theme';

export default function LoginPage() {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: wormholeTheme.gradients.background,
                p: 2,
                position: 'relative',
                overflow: 'hidden',
                // Subtle animated gradient orbs
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-20%',
                    left: '-10%',
                    width: '50%',
                    height: '50%',
                    background: `radial-gradient(circle, ${wormholeTheme.colors.primary}15 0%, transparent 70%)`,
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-20%',
                    right: '-10%',
                    width: '50%',
                    height: '50%',
                    background: `radial-gradient(circle, ${wormholeTheme.colors.accent}15 0%, transparent 70%)`,
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                },
            }}
        >
            <LoginCard>
                <LoginForm />
            </LoginCard>
        </Box>
    );
}
