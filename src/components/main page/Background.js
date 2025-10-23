

export default function Background({children}) {

    return (

        <div
            className="background"
            style={{
                //backgroundImage: `url(${process.env.PUBLIC_URL}/tmpart_bday.PNG)`
                backgroundColor: "#000000", // fallback color
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                overflow: "hidden"
            }}
        >   
        <div className="vertical-frame">
        <div className ="centered-overlay">
            {children}
         </div>
        </div>
        </div>
    );
}