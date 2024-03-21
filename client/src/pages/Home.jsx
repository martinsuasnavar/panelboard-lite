import "../global.scss";
import Image from "../supports/Image/Image";
import WhiteSpace from "../supports/WhiteSpace/WhiteSpace";
import { useState, useEffect } from "react";

const Home = () => {
    const [logoSize, setLogoSize] = useState(140);
    const [logoMotto, setLogoMotto] = useState("Simple and Effective.");
    
    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 600px)');
        const smallLogo = 70;
        // Check if the media query matches
        if (mediaQuery.matches) {
            setLogoSize(smallLogo);
            setLogoMotto(" ");
        }

        // Add event listener for changes in media query
        const handleChange = (event) => {
            setLogoSize(event.matches ? smallLogo : 140);
            setLogoMotto(event.matches ? " " : logoMotto);
        };
        mediaQuery.addEventListener('change', handleChange);

        // Clean up by removing event listener
        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []); // Empty dependency array ensures this effect runs only once

    return (
        <main className="home">
            <div className="home-elements">
                <Image src="/images/logo.png" height={logoSize}></Image>
                <WhiteSpace height={100}/>
                <div className="big-title-text">{logoMotto}</div>
            </div>
        </main>
    );
};

export default Home;