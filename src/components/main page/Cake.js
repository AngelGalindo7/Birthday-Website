

export default function CakeImage() {
    return (
        <div className="cake-container">
            <img
            src={`${process.env.PUBLIC_URL}/Untitled_Artwork-1 (1).PNG`}
            alt="Birthday Cake"
            className="cake"
            />
        </div>
    );
}