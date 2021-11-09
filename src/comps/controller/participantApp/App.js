import Fab from '../../view/participantApp/Fab';
import MenuTabs from '../../view/participantApp/MenuTabs';
import Modals from '../../view/participantApp/Modals';
import M from 'materialize-css/dist/js/materialize.min.js';
import PcView from '../../view/participantApp/PcView';
import { useState, useEffect } from "react";
import { useParams} from "react-router-dom";
import StartForm from '../../view/participantApp/StartForm';
import { pemFirestore } from '../../../firebase/config';
import useFirestoreScenarios from '../../../firebase/useFirestoreScenarios';
import ParticipantResults from '../../view/participantApp/ParticipantResults';
import { setDots, calcDots } from './DotFunctions';
import useGetGroupedScenarios from './useGetGroupedScenarios'
import useSaveResult from './useSaveResult';
import Dce from '../../model/dce';
import GroupedDce from '../../model/groupedDce';

function App() {

  const [answerList, setAnswerList] =useState([]);
  const [resultList, setResultList] = useState([]);
  const [ageGender, setAgeGender] = useState({age: "", gender: ""})
  const [done,setDone] = useState([]);
  const [todo, setTodo] = useState([]);
  const [sc1, setSc1] = useState(null);
  const [sc2, setSc2] = useState(null);
  const [qNr, setQNr] = useState(null);
  const [currentDce, setCurrentDce] = useState(null)
  const [nrQuestions, setNrQuestions] = useState(0);
  const [isGrouped, setIsGrouped] = useState(null);
  const [dceDescr, setDceDescr] = useState(null);
  const [dceFeatures, setDceFeatures] = useState([]);
  const [dceDetails, setDceDetails] = useState(null)
  const [dceNameEdit, setDceNameEdit] = useState('');
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState("");
  const {userId, dceId } = useParams();
  const {scenarios} = useFirestoreScenarios(userId, dceId); // load scenario's from database
  const {scenarioListA, scenarioListB} = useGetGroupedScenarios(scenarios, nrQuestions, setFinished, isGrouped );


useEffect(() => {
  //initialize materialize - css library
  M.AutoInit();
});

useEffect(()=>{//creates two random lists with scenario's to show. 
  if(scenarioListB&&scenarioListA){
  setSc1(scenarioListA[qNr]);//the qNr (question nr) determines which scenario is shown as sc1 and sc2 
  setSc2(scenarioListB[qNr]);
  }
},[scenarioListA, scenarioListB, qNr])

//Handle click from age and gender select in startform
const handleAGChoice = (value, id) =>{
  let tempAgeGender = ageGender;
  tempAgeGender[id] = value;
  setAgeGender(tempAgeGender);
}

// handle click from choose button
  const handleClick = (choiceValue) => {
    if(choiceValue){
    let tempListA =[...answerList];
    tempListA.push(choiceValue);
    setAnswerList(tempListA);
    }//if choiceValue ==0, next scenario's are selected and answers are not recorded.
    // SettingScenarios(isGrouped);
    if(qNr+2>nrQuestions){
      setFinished(true)}     //finishes if nr of questions as defined in Dce is reached
    setQNr(qNr=>qNr+1);
    calcDots(done, setDone, todo, setTodo, qNr); //takes care of indicator dots below the scenario's
   }


//load dce details from database
//execute at startup and upon change of scenarios
useEffect(()=>{
  if(scenarios&&userId&&dceId){ //only query dB if id's are known
    setError("");
    setAnswerList([]);
    let fValuesArray = scenarios.map(sc=>sc["fValues"]);
    let containsEmpty = false;
    // let containsEmpty = fValuesArray.map(value=>Object.values(value)).find(x=>x==="");
    console.log("fValuesArray: "+JSON.stringify(fValuesArray))
    console.log("containsEmpty: "+containsEmpty)
    if(containsEmpty){
      setError("All scenario's must have data entered and saved - please contact the researcher.")
      return;                         
    } else if(!containsEmpty){
        let response = pemFirestore.collection('users').doc(userId).collection('DceList').doc(dceId);
        response.get()
        .then(doc=>{//for grouped scenario's the nr of scenario's must be at least twice the nr of questions. For ungrouped the minimum nr scenario's ==nrQuestions with minimum of 2
          if((doc.data().grouped&&scenarios.length<2*doc.data().nrQuestions)||(!doc.data().grouped&&(scenarios.length<doc.data().nrQuestions||scenarios.length<2))){
            setError("The scenario's are incomplete - please contact the researcher.");
          }else{setError("");

            let tempGrouped = doc.data().grouped;
            let dce;
                if(doc.data().grouped){
                dce = new GroupedDce(  doc.id, doc.data().name, doc.data().descr, doc.data().nrQuestions, doc.data().features, doc.data().grouped, doc.data().groupFeature );
                } else {
                    dce = new Dce(doc.id, doc.data().name, doc.data().descr, doc.data().nrQuestions, doc.data().features, doc.data().grouped)
                }
            setCurrentDce(dce);
            setDceFeatures(doc.data().features);
            const tempDetails = {details: {grouped: doc.data().grouped, groupFeature: doc.data().groupFeature, nrQuestions: doc.data().nrQuestions}}
            setDceDetails(tempDetails);
            setDceDescr(doc.data().descr);
            setDceNameEdit(doc.data().name);
            setNrQuestions(doc.data().nrQuestions);
            setIsGrouped(tempGrouped);
            setTodo(setDots(doc.data().nrQuestions))
            if (scenarios.length!==0){
            }
          }
        }).catch((error) => {
            console.error("Error loading document: ", error);
          })}
  }},[scenarios, userId, dceId]);

//save results when finished 
 useSaveResult(finished, answerList, userId, dceId, setResultList); 

// Show in the browser. Startform before begin, MenuTabs for mobile, PcView for pc, 
// done and todo are progress indicator. Show ParticpantResult when finished.
  return (
    <div>
      <Modals sc1={sc1} sc2={sc2}/>
      {!finished&&!started&&<StartForm nrQuestions={nrQuestions} setStarted={setStarted} setQNr={setQNr} handleAGChoice={handleAGChoice}/>}
      {!finished &&started&&!error && <MenuTabs handleClick = {handleClick} sc1={sc1} sc2={sc2} dceDescr={dceDescr} ageGender={ageGender}/>} 
      {!finished &&started&&!error && sc1&&sc2&& <PcView handleClick = {handleClick} sc1={sc1} sc2={sc2} dceDescr={dceDescr} ageGender={ageGender}/>}
      {!finished &&started&&!error&&<Fab />}
      {!finished &&started&&!error&& <div className="footer">
         {done}
         {todo}
      </div>}
      {finished &&started&&!error&&userId&&dceId&& <ParticipantResults resultList={resultList} currentDce={currentDce} dceDetails={dceDetails} dceNameEdit = {dceNameEdit} dceId={dceId} dceFeatures={dceFeatures} userId={userId}/>}
      {error&&<div className="text-danger mt-5"><h4>Error: {error}</h4></div>}
    </div>
  )
}

export default App;
