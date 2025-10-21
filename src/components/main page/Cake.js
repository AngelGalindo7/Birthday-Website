

export default function CakeImage() {
    return (
        <div className="cake-container">
            <img
            src={`${process.env.PUBLIC_URL}/caketmp..PNG`}
            alt="Birthday Cake"
            className="cake"
            />
        </div>
    );
}