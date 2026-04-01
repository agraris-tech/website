export function AppPageLoader() {
    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 999999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(15, 23, 42, 0.22)',
                backdropFilter: 'blur(4px)',
            }}
        >
            <div
                style={{
                    width: 72,
                    height: 72,
                    borderRadius: '9999px',
                    border: '4px solid rgba(255,255,255,0.25)',
                    borderTopColor: '#16a34a',
                    borderRightColor: '#ffffff',
                    animation: 'appPageSpin 0.9s linear infinite',
                }}
            />
            <style>
                {`
          @keyframes appPageSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
            </style>
        </div>
    );
}