import { useState, useEffect } from 'react';

import { Header } from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';


function Dashboard() {
  const [ editingFood, setEditingFood ] = useState({})
  const [ modalOpen, setModalOpen ] = useState(false)
  const [ editModalOpen, setEditModalOpen ] = useState(false)
  const [ foods, setfoods ] = useState([])
  const { foods: responseFood } = foods


  useEffect(async () => {
    const response = await api.get('/foods');
    const foodss = response.data
  
    setfoods( { foods: foodss } );
  }, []);

  function toggleModal() {
    modalOpen === false ? setModalOpen(true) : setModalOpen(false);
  }

  async function handleAddFood() {
    try {
      const response = await api.post('/foods', {
        ...foods,
        available: true,
      });
    
    
      setfoods( { foods: response } );
    
    } catch (err) {
      console.log(err);
    }
  }

  function toggleEditModal() {
    editModalOpen === false ? setEditModalOpen(true) : setEditModalOpen(false)
  }

  async function handleDeleteFood(id) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = responseFood.filter(food => {
      return food.id !== id
    })

    setfoods({ foods: foodsFiltered });
  }

    function handleEditFood(food) {
    setEditingFood(food)
    setEditModalOpen(true)
  }

  async function handleUpdateFood(food) {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = responseFood.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );
      
      setfoods({ foods: foodsUpdated })
    } catch (err) {
      console.log(err);
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
          {responseFood && 
            responseFood.map(food => {
              return (
                <Food 
                  key={food.id}
                  food={food}
                  handleDelete={() => handleDeleteFood(food.id)}
                  handleEditFood={() => handleEditFood(food)}
                />
              )
            })
          }
        </FoodsContainer>
      </>
    )
}

export default Dashboard;


