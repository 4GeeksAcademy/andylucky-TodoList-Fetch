import React, { useEffect, useState } from "react";
import { Tarea } from "./Tarea";

//Componente ListaTareas
export const ListaTareas = (props) => {

	const [tareas, setTareas] = useState([]);
    const [inputValue, setInputValue] =useState("");
    const [user, setUser] = useState("minigoca")
	const [valorClass, setValorClass] = useState("LaX"); 
    const [visual, setVisual] = useState(false)



	//funcion que añade nueva tarea
    const handleKeyDown = async (event) => {
        if(event.key==="Enter"){
        if(user){
            if (inputValue.replace(/\s/g, '').length > 4) {
                setVisual(false)
                getUser(user);
                setInputValue(inputValue)
                createTask(user,inputValue)
            }else{
                setVisual(true)
            }
        }else{
                createUser(user);
            }
        }
    }



    const getTheUsuario = async () => {
        const todosUsuario = await getUsers();
        const usuarioGet = todosUsuario.users.find(usuario => usuario.name === user);
        if (usuarioGet) {
             getUser(user);
 
        } else {
            await createUser(user);
        }
    }


	const handerlOver = (index) => {
		setValorClass(index); 
	  };

	const handerlOut = () =>{
		setValorClass(null)
	}




    const getUsers = async () => {
        
        const response = await fetch(`https://playground.4geeks.com/todo/users`)
        try{
            if(!response.ok){
                throw new Error(`Error al obtener datos: ${response.status} ${response.statusText}`)
            }
            const data = await response.json();
            return data
        }
        catch(err){
            console.log(err);
            return null
        }
    }





    const getUser = async (usuario) => {
        try{ 
            const response = await fetch(`https://playground.4geeks.com/todo/users/${usuario}`)
            if(!response.ok ){
                if(response.status === 404){
                    return null
                }else{
                    throw new Error(`Error al obtener datos: ${response.status} ${response.statusText}`)
                }
            }
            const theuser = await response.json();
            setUser(theuser.name);
            const nuevasTareas = theuser.todos.map(elem => elem); 
            setTareas(nuevasTareas);
        }
        catch (error) {
            console.log(error); 
        }
    }




    // funcion crear usuario
    const createUser = async (usuario) => {
        try{
          const response =  await fetch(`https://playground.4geeks.com/todo/users/${usuario}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({todos: []}) 
            })
            if (!response.ok) {
                throw new Error(`Error al crear usuario: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            return data
        }catch(err) {
            console.log("Error:", err);
        }
    }



    //funcion crear tarea teniendo el usuario
    const createTask = async (usuario, task) => {
        try{
            const response = await fetch(`https://playground.4geeks.com/todo/todos/${usuario}`,{
                    method: "POST",
                   body: JSON.stringify({label:task, is_done:true}),
                   headers: {
                    "Content-Type": "application/json"
                 }   
                })
            if(!response.ok){
                throw new Error("el error es :" + response.status)
            }
            const tarea = await response.json();
            setTareas([...tareas, tarea]);
            setInputValue("");
        }
        catch(err){
             console.log("Error: ", err)   
        }
    }


    //funcion eliminar una tarea
    const deleteTarea = async (idTarea) => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/todos/${idTarea}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if(!response.ok){
                throw new Error("el error es :" + response.status)
            }
            console.log("Tarea eliminada correctamente");
            return true;
        }
        catch(err){
             console.log("Error: ", err)   
             return false;
        }         
    }





	//funcion eliminar tareas y actualizar en local
	const envtoNewTarea = async (indiceTarea, indiceLocal ) => {
        await deleteTarea(indiceTarea);
        const tareasActualizadas  = [...tareas];
		tareasActualizadas.splice(indiceLocal, 1)
		setTareas(tareasActualizadas) 
	}

    
    //funcion eliminar todas la tareas
    const deleteTodasLasTareas = async () => {
        try {
           await Promise.all(
                tareas.map(tarea => deleteTarea(tarea.id))
            );
            setTareas([])
            console.log("Todas las tareas eliminadas"); 
        } catch (err) {
            console.error("Error al eliminar todas las tareas:", err);
        }
    };


        


	//funcion que se actualiza cuando cambia  tareas
	useEffect(() => {
         //getTheUsuario --> getUsers() -->    SI? --> getUser(user) --> setUser(user),setTareas(tareas)      NO:-->create(user);
         getTheUsuario();
         //user --> cargado
         //tareas --> cargado

	}, []); 


    
    

	return (
		<div className="container d-flex cutomList">
			<input type="text" onChange={e => setInputValue(e.target.value)} onKeyDown={handleKeyDown} value={inputValue}  placeholder="Añadir nueva tarea..." />
            {visual && <div className="restoTareas"> "la tarea debe de tener al menos 5 letras"</div>}
			<Tarea valordeClase={valorClass}  onMouseLeave={handerlOut} onMouseEnter={handerlOver} nuevaTarea={tareas} nuevaTareaClick={envtoNewTarea} />
			{tareas.length>0 &&  <div className="restoTareas">falta {tareas.length} tareas</div> }
			{tareas.length===0 && <div className="restoTareas"> "No hay tareas, añadir tareas"</div>}
            {tareas.length>0 &&  <button className="btn btn-success mt-4 col-4 ms-auto" onClick={deleteTodasLasTareas}>Eliminar tareas</button>} 
		</div>
	)

	

};

