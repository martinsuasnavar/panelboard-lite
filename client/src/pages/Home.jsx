import "../global.scss";
import Image from "../supports/Image/Image";
import WhiteSpace from "../supports/WhiteSpace/WhiteSpace";


const Home = () =>{
    return(
        <main style={{display: "flex", justifyContent: "center", marginRight: "auto", marginLeft: "auto"}}>
            <div style={{marginTop: "120px"}}>
            
                <Image src="/images/logo.png" height={140}></Image>
                <ver>Beta</ver>
                <WhiteSpace height={170}/>
                <div className="big-title-text">Fast. Simple. Effective.</div>
            </div>
        </main>
    );
}

export default Home;