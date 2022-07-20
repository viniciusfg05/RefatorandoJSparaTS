import { useState, useEffect } from 'react'

import { Header } from '../../components/Header'
import api from '../../services/api'
import Food from '../../components/Food'
import ModalAddFood from '../../components/ModalAddFood'
import ModalEditFood from '../../components/ModalEditFood'
import { FoodsContainer } from './styles'

interface foodProps{
  id: number,
  name: string;
  description: string;
  price: string;
  available: string;
  image: string;
}

function Dashboard() {
  const [editingFood, setEditingFood] = useState<any>({})
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [foods, setfoods] = useState<foodProps[]>([])



  // const { foods: responseFood } = foods

  useEffect(() => {
    async function getdata() {

      const response = await api.get('/foods')
      const foods = response.data
  
      setfoods(foods)
    }

    getdata()
  }, []);

  function toggleModal() {
    modalOpen === false ? setModalOpen(true) : setModalOpen(false)
  }

  async function handleAddFood(data: foodProps) {


    try {

      const {data} = await api.post('/foods', {
        ...foods,
        available: true
      })

      setfoods(data)

    } catch (err) {
      console.log(err)
    }
  }

  function toggleEditModal() {
    editModalOpen === false ? setEditModalOpen(true) : setEditModalOpen(false)
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`)

    const foodsFiltered = foods.filter((food: foodProps) => {
      return food.id !== id
    })

    setfoods( foodsFiltered )
  }

  function handleEditFood(food: foodProps) {
    setEditingFood(food)
    setEditModalOpen(true)
  }

  async function handleUpdateFood(food: foodProps) {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food
      })

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      )

      setfoods( foodsUpdated )
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />
      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => {
            return (
              <Food
                key={food.id}
                food={food}
                handleDelete={() => handleDeleteFood(food.id)}
                handleEditFood={() => handleEditFood(food)}
              />
            )
          })}
      </FoodsContainer>
    </>
  )
}

export default Dashboard
