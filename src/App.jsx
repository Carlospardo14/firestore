import React, { useEffect, useState } from 'react'
import {db} from './firebaseConfig'


function App() {
  const [modoEdicion, setModoEdicion] = useState(null)
  const [idUsuario, setIdUsuario] = useState('')
  const [nombre,setNombre]= useState('');
  const [numero,setNumero] = useState('');
  const [usuariosAgenda, setUsuariosAgenda] = useState([]);
  const [error, settError] = useState(null);

const setUsuarios =async (e) =>{
    e.preventDefault();
    if(!nombre.trim()){
      settError("El campo nombre no puede estar vacio")
    }
    if(!numero.trim()){
      settError("El campo telefono no puede estar vacio")
    }
    const usuario = {
      nombre:nombre,
      telefono: numero
    }
    try{
      const data = await db.collection('agenda').add(usuario)
      const {docs} = await db.collection('agenda').get()
      const nuevoArray = docs.map( item => ({id:item.id, ...item.data()}))
      setUsuariosAgenda(nuevoArray)
      alert('Usuario añadido')
    }catch(e){
      console.log(e)
    }
    setNombre('')
    setNumero('')
}

  useEffect(()=>{
    const getUsuarios = async() =>{
      const {docs} = await db.collection('agenda').get()
      const nuevoArray = docs.map( item => ({id:item.id, ...item.data()}))
      setUsuariosAgenda(nuevoArray)
    }
    getUsuarios()
  },[])

  const borrarUsuario = async (id) =>{
    try{
      await db.collection('agenda').doc(id).delete()
      const {docs} = await db.collection('agenda').get()
      const nuevoArray = docs.map( item => ({id:item.id, ...item.data()}))
      setUsuariosAgenda(nuevoArray)
    }catch(e){
      console.log(e)

    }

  }

const actualizar = async (id) =>{
  try{
    const data  = await db.collection('agenda').doc(id).get()
    console.log((await data).data())
    const  {nombre, telefono} = data.data()
    setNombre(nombre)
    setNumero(telefono)
    setIdUsuario(id)
    setModoEdicion(true)
    console.log(id)
  }catch(e){
    console.log(e)
    
  }
}
const setUpdate = async (e) =>{
  e.preventDefault();
    if(!nombre.trim()){
      settError("El campo nombre no puede estar vacio")
    }
    if(!numero.trim()){
      settError("El campo telefono no puede estar vacio")
    }
    const actualizarUsuario = {
      nombre:nombre,
      telefono: numero
    }
    try{
      await db.collection('agenda').doc(idUsuario).set(actualizarUsuario)
      const {docs} = await db.collection('agenda').get()
      const nuevoArray = docs.map( item => ({id:item.id, ...item.data()}))
      setUsuariosAgenda(nuevoArray)

    }catch(e){
      console.log(e)
    }
    setNombre('')
    setNumero('')
    setIdUsuario('')
    setModoEdicion(false)

}

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h2>Formulario de Usuarios</h2>
          <form onSubmit={modoEdicion? setUpdate : setUsuarios}className="form-group">
            <input 
            value={nombre}
            onChange={(e)=>{setNombre(e.target.value)}}
            className="form-control"
            placeholder="Introduce el nombre"
            type="text"
            />
            <input 
            value={numero}
            onChange={(e)=>{setNumero(e.target.value)}}
            className="form-control mt-3"
            placeholder="Introduce el numero"
            type="text"
            />{
              modoEdicion?
              (
                <input type="submit" value="Editar" className="btn btn-dark btn-block mt-3"/>
              )
              :
              (
                <input type="submit" value="Registrar" className="btn btn-dark btn-block mt-3"/>
              )

            }
            
          </form>
          {
            error?
            (
            <div>
              <p>{error}</p>
            </div>
            )
            :
            (
              <span></span>
            )
          }

        </div>
        <div className="col">
          <h2>Agenda</h2>
          <ul className="list-group">
          {
            usuariosAgenda.length!==0?
            (
              usuariosAgenda.map(item => (
                <li className="list-group-item" key={item.id}>{item.nombre} -- {item.telefono}
                <button onClick={(id)=>{borrarUsuario(item.id)}} className="btn btn-danger float-right">Eliminar </button>
                <button onClick={(id)=>{actualizar(item.id)}} className="btn btn-info float-right mr-3">Actualizar</button>
                </li>
                
              ))

            )
            :
            (
              <span>
                Lo siento no hay usuarios
              </span>
            )
          }
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
