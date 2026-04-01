export function PageLoader() {
    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="h-16 w-16 rounded-full border-4 border-white/30 border-t-green-500 animate-spin" />
        </div>
    );
}