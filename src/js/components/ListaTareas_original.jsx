import React, { useEffect, useState } from "react";
import { Tarea } from "./Tarea";

//Componente ListaTareas
export const ListaTareas = (props) => {

    const [tareas, setTareas] = useState([]);
    const [inputValue, setInputValue] =useState("");
    const [user, setUser] = useState("minigoca")
    const [users, setUsers] = useState([]);

    

    //funcion que añade nueva tarea
    const handleKeyDown = async (event) => {
        if(event.key==="Enter"){
         setTareas([...tareas, inputValue]);
 
        const todosUsuario = await getUsers();
        const usuarioGet = todosUsuario.users.find( usuario => usuario.name === user )             
            if(usuarioGet){
                const tareas = await createTask(usuarioGet,inputValue)
                const UserTareas = await getUser(user);
                console.log(UserTareas)
            }
            else{
                createUser(user);
            }
        }
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
            const data = await response.json()
            return data
        }
        catch (error) {
            console.log(error); 
        }
    }





    const createUser = async (usuario) => {
        try{
          const response =  await fetch(`https://playground.4geeks.com/todo/users/${usuario}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({todos}) 
            })
            if (!response.ok) {
                throw new Error(`Error al crear usuario: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            return data
        }catch (err) {
            console.log("Error:", err);
        }
    }



    const createTask = async (usuario, task) => {
        try{
            const response = await fetch(`https://playground.4geeks.com/todo/todos/${usuario.name}`,{
                    method: "POST",
                   body: JSON.stringify({label:task, is_done:true}),
                   headers: {
                    "Content-Type": "application/json"
                 }   
                })
            if(!response.ok){
                throw new Error("el error es :" + response.status)
            }
            const data = await response.json()
            return data;
        }
        catch(err){
             console.log("Error: ", err)   
        }
    }

   

    //funcion para eliminar la tarea donde se hace click en la x
    const envtoNewTarea = (indiceTarea) => {
        const nuevasTareas = [...tareas]
        nuevasTareas.splice(indiceTarea,1)
        setTareas(nuevasTareas);
    }





    //funcion que se actualiza cuando cambia  tareas
    useEffect(() => {
        setInputValue("");
        const fetchUsers = async () => {
            const datosUsers = await getUsers();
            setUsers(datosUsers); 
        };
        fetchUsers();
    }, []); 





    return (
        <div className="container d-flex cutomList">
            <input type="text" onChange={e => setInputValue(e.target.value)} onKeyDown={handleKeyDown} value={inputValue}  placeholder="Añadir nueva tarea..." />
            <Tarea nuevaTarea={tareas} nuevaTareaOver={envtoNewTarea} />
            {tareas.length>0 &&  <button className="btn btn-success mt-4 col-4 ms-auto">Eliminar tareas</button>}     
        </div>
    )
};

