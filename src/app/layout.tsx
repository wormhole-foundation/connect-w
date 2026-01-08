import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Wormhole NTT Bridge',
    description:
        'Cross-chain token transfers powered by Wormhole Native Token Transfers',
    icons: {
        icon: '/favicon.svg',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
