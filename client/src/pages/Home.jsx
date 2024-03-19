import "../global.scss";
import Image from "../supports/Image/Image";
import WhiteSpace from "../supports/WhiteSpace/WhiteSpace";


const Home = () =>{
    return(
        <main className="home" style={{display: "flex", justifyContent: "center", marginRight: "auto"}}>
            <div style={{marginTop: "270px"}}>
            
                <Image src="/images/logo.png" height={140}></Image>
                <WhiteSpace height={170}/>
                <div className="big-title-text">Fast. Simple. Effective.</div>
            </div>
        </main>
    );
}

export default Home;