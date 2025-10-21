

export default function Background({children}) {

    return (

        <div
            className="background"
            style={{
                backgroundImage: "url('/Untitled_Artwork-1.png')",
            }}
        >
            {children}
        </div>
    );
}