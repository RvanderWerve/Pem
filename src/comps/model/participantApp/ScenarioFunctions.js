//Various functions related to determining which scenario's will be shown

//returns list of random nrs that will be used as index nr for the scenario list. maxNr indicates the highest
//that a nr can be. Length represents the amount of entries in the list. Numbers will only be used once in the list.
const getRndNrList= (maxNr, length)=>{
  let usedNrs = [];
  let nrList = [];
  for(let j=0;j<length;j++){
    let randNr=-1;
    for (let i=maxNr*5; i>0; i--){
        const tempRandNr = Math.floor(Math.random() * maxNr);
        if (!usedNrs.includes(tempRandNr)){
          randNr=tempRandNr;
          break;
          }
      }
    if(randNr!==-1){usedNrs.push(randNr)}  //store nr if it is used
    nrList.push(randNr);
  }
  return nrList
}

//get 2 random scenarios, no repeats and A!=B
const getRandomScenarios = (scenarios, prevRandomA, setPrevRandomA)=>{
    const maxNr = scenarios.length;
    const {RandomNrA, RandomNrB} = GetUnusedRndNrs(maxNr, prevRandomA, setPrevRandomA);
    return ({ScenarioA: scenarios[RandomNrA], ScenarioB: scenarios[RandomNrB]});
    }

    
// get random nr for the first scenario and store used nrs to avoid repeats
const GetRandomANr = (maxNr, prevRandomA, setPrevRandomA)=>{
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
      if (randNrA!==tempRandNrB){
        randNrB=tempRandNrB;
        break;
      }
    }   
    return {RandomNrA: randNrA, RandomNrB: randNrB};
}


export  {getRandomScenarios, GetRandomANr, getRndNrList} ;
