

export default function Background({children}) {

    return (

        <div
            className="background"
            style={{
                backgroundImage: "url('/tmpart_bday.PNG')",
            }}
        >
            {children}
        </div>
    );
}