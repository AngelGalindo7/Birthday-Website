

export default function Background({children}) {

    return (

        <div
            className="background"
            style={{
                backgroundImage: `url(${process.env.PUBLIC_URL}/tmpart_bday.PNG)`
            }}
        >
            {children}
        </div>
    );
}