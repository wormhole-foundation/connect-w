// Wormhole Brand Colors - inspired by Portal Bridge
export const wormholeTheme = {
    // Primary gradient colors
    colors: {
        // Primary purple/violet
        primary: '#8B5CF6',
        primaryLight: '#C1BBF6',
        primaryDark: '#6D28D9',

        // Accent cyan/teal
        accent: '#06B6D4',
        accentLight: '#22D3EE',
        accentDark: '#0891B2',

        // Background colors
        bgDark: '#0D0D12',
        bgCard: 'rgba(255, 255, 255, 0.03)',
        bgCardHover: 'rgba(255, 255, 255, 0.06)',

        // Text colors
        textPrimary: '#FFFFFF',
        textSecondary: 'rgba(255, 255, 255, 0.7)',
        textMuted: 'rgba(255, 255, 255, 0.4)',

        // Border colors
        border: 'rgba(255, 255, 255, 0.08)',
        borderHover: 'rgba(255, 255, 255, 0.15)',
        borderFocus: '#8B5CF6',

        // Status colors
        error: '#EF4444',
        success: '#10B981',
        warning: '#F59E0B',
    },

    // Gradients
    gradients: {
        primary:
            'linear-gradient(135deg, #C1BBF6 0%, #8B5CF6 50%, #06B6D4 100%)',
        background:
            'radial-gradient(ellipse at top, #1a1625 0%, #0D0D12 50%, #0a0a0f 100%)',
        card: 'linear-gradient(180deg, rgba(139, 92, 246, 0.05) 0%, rgba(6, 182, 212, 0.02) 100%)',
        button: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
        buttonHover: 'linear-gradient(135deg, #9D6FFF 0%, #22D3EE 100%)',
    },

    // Shadows
    shadows: {
        card: '0 4px 24px rgba(0, 0, 0, 0.4)',
        cardHover: '0 8px 32px rgba(139, 92, 246, 0.15)',
        button: '0 4px 16px rgba(139, 92, 246, 0.3)',
    },

    // Border radius
    borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
    },
} as const;

export type WormholeTheme = typeof wormholeTheme;
