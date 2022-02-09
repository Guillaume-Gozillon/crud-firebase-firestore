import { useState, useEffect } from 'react'
import './App.css'
import { db } from './firebase-config'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc
} from '@firebase/firestore'

const App = () => {
  const [newName, setNewName] = useState('')
  const [newAge, setNewAge] = useState(0)

  const [users, setUsers] = useState([])
  const usersCollectionRef = collection(db, 'users')

  const createUsers = async () => {
    await addDoc(usersCollectionRef, { name: newName, age: Number(newAge) })
  }

  const updateUser = async (id, age) => {
    const userDoc = doc(db, 'users', id)
    const newField = { age: age + 1 }
    await updateDoc(userDoc, newField)
  }

  const deleteUser = async id => {
    const userDoc = doc(db, 'users', id)
    await deleteDoc(userDoc)
  }

  useEffect(() => {
    const getusers = async () => {
      const data = await getDocs(usersCollectionRef)
      // Trouver l'ID du document de la collection
      setUsers(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    }

    getusers()
  }, [])

  return (
    <div className='App'>
      <input onChange={e => setNewName(e.target.value)} placeholder='Name...' />
      <input
        onChange={e => setNewAge(e.target.value)}
        type='number'
        placeholder='Age...'
      />

      <button onClick={createUsers}>Create user</button>

      {users.map((user, i) => (
        <div key={i}>
          <p>User : {user.name}</p>
          <p>Age : {user.age}</p>
          <button onClick={() => updateUser(user.id, user.age)}>
            Increase age
          </button>
          <button onClick={() => deleteUser(user.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}

export default App
