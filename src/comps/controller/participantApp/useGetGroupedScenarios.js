import { useEffect, useState } from "react";
import { getRndNrList} from './ScenarioFunctions'

   //Get 2 scenarios that are only differing in the group feature. ScenarioA is random, ScenarioB is the pair of A
export default function useGetGroupedScenarios  (scenarios, nrQuestions, isGrouped){
  const [scenarioListA, setScenarioListA] = useState(null)
  const [scenarioListB, setScenarioListB] = useState(null)

    useEffect(()=>{//React hook that returns a list of nrs used for scenario A plus a list of nrs used for scenario B. These are the pairs of A
        console.log("entering useeffect in getScenarios, nrQ en grouped:"+nrQuestions+isGrouped)
        if (scenarios&&nrQuestions&&isGrouped!==null&&scenarios.length>0){
            const maxNr = scenarios.length;
            console.log("maxNr: "+maxNr)
      let randNrList = getRndNrList(maxNr, nrQuestions);
      let scListA = [];
      console.log("scenarios: "+JSON.stringify(scenarios))
      randNrList.forEach(nr=>{
        scListA.push(scenarios[nr]);//set the correct nrs to the A list
        })
      let scListB = [];
      if(isGrouped){
          console.log("scListA: "+JSON.stringify(scListA))
          scListA.forEach(scA=>{
              scListB.push(scenarios.find(({id})=>(id===scA.altnr)))//set the B list to match the A list 
          })
      }
      if(!isGrouped){
          getRndNrList(maxNr, nrQuestions).forEach(nr=>{scListB.push(scenarios[nr])})//if not grouped, the B list is random too
      }  
      setScenarioListA(scListA);
      setScenarioListB(scListB);
        }
    },[scenarios, nrQuestions, isGrouped ])
    
    return( {scenarioListA,  scenarioListB});  
  }