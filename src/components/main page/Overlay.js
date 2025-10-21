export default function Overlay({ isDark}) {
    return <div className={`overlay ${isDark ? "dark" : ""}`} />;
}