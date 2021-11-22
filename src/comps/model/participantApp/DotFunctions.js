//Sets the html for the dots that indicate the questions that have to be answered
const setDots =  (length)=>{
    let dot = [];
    for(let i=0; i<length;i++){
      dot.push(<span key={`emptydot${i}`} className="dot"></span>)
    };
  return dot;
  };

     //calculate nr of dots of questions still to answer
const calcDots = (done, setDone, todo, setTodo, qNr)=>{
    let dones = [];//indicator dots for number of questions already answered
    dones = [...done];
    dones.push(<span key={`filleddot${qNr}`} className="dot blue darken-2"></span>);
    setDone(dones);
    let todos = [];//indicator dots for questions still to answer
    todos = [...todo];
    todos.pop();
    setTodo(todos);
    return;
}
 
export {setDots, calcDots};