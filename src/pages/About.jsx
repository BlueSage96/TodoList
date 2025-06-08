import Cat from "./TodosPage.module.css";
import AboutStyle from "./About.module.css";
function About () {
    return (
        <>
            <div className={Cat.catWrapper} style={{overflowY: "hidden"}}>
               <p className={AboutStyle.desc}>
                A dynamic todo app to keep track of my tasks. 
                Feel free to clone and modify it to fit your needs
                and style it to your liking.
                <br/>
                *Note: you will have to create your own (Airtable) API and
                use your own API keys. For example:
                <br/>
                VITE_PAT=API_serial_number_here
                <br/>
                VITE_BASE_ID=API_key_here
            </p> 
            </div>
            
        </>
    )
}
export default About;