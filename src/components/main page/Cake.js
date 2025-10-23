

export default function CakeImage( {fadeOut}) {
    return (
        <div className={`cake-container ${fadeOut ? "fade-out" : ""}`}>
            <img
            src={`${process.env.PUBLIC_URL}/BdayImage.png`}
            alt="Birthday Cake"
            className="cake"
            />
        </div>
    );
}