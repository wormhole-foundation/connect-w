import { Box, Card, CardContent, Typography } from '@mui/material';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { wormholeTheme } from '@/lib/theme';

interface LoginCardProps {
    children: ReactNode;
}

export function LoginCard({ children }: LoginCardProps) {
    return (
        <Card
            sx={{
                maxWidth: 420,
                width: '100%',
                bgcolor: wormholeTheme.colors.bgCard,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${wormholeTheme.colors.border}`,
                borderRadius: wormholeTheme.borderRadius.xl,
                boxShadow: wormholeTheme.shadows.card,
                background: wormholeTheme.gradients.card,
            }}
        >
            <CardContent sx={{ p: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    {/* Wormhole Logo */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mb: 3,
                        }}
                    >
                        <Image
                            src="/wormhole-logomark.svg"
                            alt="Wormhole"
                            width={72}
                            height={72}
                            priority
                        />
                    </Box>
                    <Typography
                        variant="h5"
                        sx={{
                            color: wormholeTheme.colors.textPrimary,
                            fontWeight: 700,
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Welcome Back
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: wormholeTheme.colors.textSecondary,
                            mt: 1,
                        }}
                    >
                        Enter password to access the bridge
                    </Typography>
                </Box>
                {children}
            </CardContent>
        </Card>
    );
}
