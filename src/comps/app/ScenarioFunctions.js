
   //Get 2 scenarios that are only differing in the group feature. ScenarioA is random, ScenarioB is the pair of A
const getGroupedScenarios = (scenarios, setFinished, prevRandomA, setPrevRandomA)=>{
    const maxNr = scenarios.length;
    let randNrA = GetRandomANr(maxNr, prevRandomA, setPrevRandomA);
    const scenarioA = scenarios[randNrA];
    if (!scenarioA){
      setFinished(true)  //if there are not enough scenarios available, finish experiment
    }
    else{
      const altnr = scenarioA["data"]["altnr"];
      const scenarioB = scenarios.find(sc=>(sc["data"]["nr"]===altnr));
      return({ScenarioA: scenarioA, ScenarioB: scenarioB});  
    }
    return({ScenarioA: "", ScenarioB: ""});
  }

  //get 2 random scenarios, no repeats and A!=B
const getRandomScenarios = (scenarios, prevRandomA, setPrevRandomA)=>{
    const maxNr = scenarios.length;
    const {RandomNrA, RandomNrB} = GetUnusedRndNrs(maxNr, prevRandomA, setPrevRandomA);
    return ({ScenarioA: scenarios[RandomNrA], ScenarioB: scenarios[RandomNrB]});
    }

    
// get random nr for the first scenario and store used nrs to avoid repeats
const GetRandomANr = (maxNr, prevRandomA, setPrevRandomA)=>{
    // const [prevRandomA, setPrevRandomA] = useState(null);
    let usedNrsA = [];
    if (prevRandomA!=null){usedNrsA=[...prevRandomA]}
    let randNrA=-1;
    for (let i=maxNr*5; i>0; i--){
        const tempRandNrA = Math.floor(Math.random() * maxNr);
        if (!usedNrsA.includes(tempRandNrA)){
          randNrA=tempRandNrA;
          break;
          }
      }
    if(randNrA!==-1){usedNrsA.push(randNrA)}  //store A-nr if it is used
    setPrevRandomA(usedNrsA);
    return randNrA;
  }

//Gets 2 random nrs where A-nr has not been used before in this session and B is different from A
//Used for Dce's without grouped scenario's
const GetUnusedRndNrs = (maxNr, prevRandomA, setPrevRandomA)=>{
    let randNrA = GetRandomANr(maxNr, prevRandomA, setPrevRandomA);
    let randNrB=-1;
    for (let i=maxNr*10; i>0; i--){
      const tempRandNrB = Math.floor(Math.random() * maxNr);
      console.log("rndA is "+randNrA+" rndB is "+tempRandNrB);
      if (randNrA!==tempRandNrB){
        randNrB=tempRandNrB;
        break;
      }
    }   
    return {RandomNrA: randNrA, RandomNrB: randNrB};
}


export  {getRandomScenarios, getGroupedScenarios } ;
