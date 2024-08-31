import "../global.scss";
import Image from "../supports/Image/Image";
import WhiteSpace from "../supports/WhiteSpace/WhiteSpace";
import { useState, useEffect } from "react";
import DeleteButton from "../buttons/DeleteButton";
import Cookies from 'js-cookie';
import DialogBox from "../containers/DialogBox";
import GenericButton from "../buttons/EditButton";

const showWarning = () => {

}

const deleteAllCookies = () => {
  const allCookies = Cookies.get(); // Get all cookies
  Object.keys(allCookies).forEach((cookie) => {
    Cookies.remove(cookie); // Remove each cookie
  });
  window.location.reload()
};

const Home = () => {
    const [logoSize, setLogoSize] = useState(140);
    const [logoMotto, setLogoMotto] = useState("Simple and Effective.");
    const [dialogBox, setDialogBox] = useState(false);
    InitializeLogoSize(logoSize,setLogoSize,logoMotto,setLogoMotto);

    const toggleDeleteWarning = () =>{
        setDialogBox(!dialogBox);
    }
    
    return (
        <main className="home">
            <div className="home-elements">
                <Image src="/images/logo.png" height={logoSize}></Image>
                <WhiteSpace height={100}/>
                <div className="title-text medium">ⓘ Clear out cookies if you can not access your projects</div>
                <WhiteSpace height={10}/>
               <DeleteButton width={140} onClick={toggleDeleteWarning}>⚠ Clear cookies</DeleteButton>

                {dialogBox &&
                    <DialogBox headMessage={"ATTENTION: DESTRUCTIVE ACTION. YOUR DATA IS TIED UP TO COOKIES. Delete PanelBoard cookies?"}>
                    <DeleteButton width={70} height={30} 
                    onClick={() => deleteAllCookies()}>
                        Delete
                    </DeleteButton>

                    <GenericButton width={70} height={30} 
                    onClick={() => toggleDeleteWarning()}>
                        Cancel
                    </GenericButton>
                </DialogBox>
                }
              
            </div>
        </main>
    );
};

export default Home;

function InitializeLogoSize(logoSize,setLogoSize,logoMotto,setLogoMotto){
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
}