import { useEffect, useState } from "react";

export const Tarea = (props) => {

    let arrayTareas = props.nuevaTarea;
    const [newTareas, setNewTareas] = useState([])
   

 useEffect(()=>{
    setNewTareas(arrayTareas)
 },[arrayTareas])

 


return (
    <div className="task-list">
      {newTareas.map((tarea,index) => (
        <div key={tarea.id} className="task"   onMouseLeave={()=> props.onMouseLeave()}  onMouseEnter={() => props.onMouseEnter(index)}  >
          {tarea.label}
          <span
            className={props.valordeClase === index ? "LaX over" : "LaX"}
            onClick={() => props.nuevaTareaClick(tarea.id, index)}
          >
            x
          </span>
        </div>
      ))}
    </div>
)

}