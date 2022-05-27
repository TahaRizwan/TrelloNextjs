import { Droppable, DragDropContext } from 'react-beautiful-dnd'
import { useEffect, useState } from 'react'
import { v4 } from 'uuid'
import Input from './Input'
import DraggableItem from './DraggableItem'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import Swal from 'sweetalert2'
import { useSelector, useDispatch } from 'react-redux'
import { newData } from '../reducer/appSlicer'

const DragContext = () => {
  const trelloData = useSelector((state) => state.data.value)
  const dispatch = useDispatch()
  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return
    const { source, destination } = result

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId]
      const destColumn = columns[destination.droppableId]
      const sourceItems = [...sourceColumn.items]
      const destItems = [...destColumn.items]
      const [removed] = sourceItems.splice(source.index, 1)
      destItems.splice(destination.index, 0, removed)
      let data = {
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      }
      setColumns(data)
      dispatch(newData(data))
      localStorage.setItem('file', JSON.stringify(data))
    } else {
      const column = columns[source.droppableId]
      const copiedItems = [...column.items]
      const [removed] = copiedItems.splice(source.index, 1)
      copiedItems.splice(destination.index, 0, removed)
      let data = {
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      }
      setColumns(data)
      dispatch(newData(data))
      localStorage.setItem('file', JSON.stringify(data))
    }
  }
  const [columns, setColumns] = useState('')

  const [initial, setInitial] = useState(true)

  useEffect(() => {
    if (initial) {
      const file = JSON.parse(localStorage.getItem('file'))
      if (file) {
        setColumns(file)
        dispatch(newData(file))
      }
      else {
        setColumns(trelloData)
      }

      setInitial(false)
    }
  }, [initial, trelloData, dispatch])

  const [name, setName] = useState('')

  const handleInput = (e) => {
    setName(e.target.value)
  }

  const handleKeyPress = (e) => {
    if (name.trim() && e.key === 'Enter') {
      let object = {
        [v4()]: {
          name: name,
          items: [],
        },
      }
      e.target.value = null
      let data = { ...columns, ...object }
      setColumns(data)
      dispatch(newData(data))
      localStorage.setItem('file', JSON.stringify(data))
    }
  }

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        let data = columns
        const entries = Object.entries((data))
        let val = entries.findIndex((entry) => { return (entry[0] === id) })
        entries.splice(val, 1)
        const obj = Object.fromEntries(entries)
        setColumns((data = { ...obj }))
        localStorage.setItem('file', JSON.stringify(obj))
        dispatch(newData(obj))
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Your tasklist has been deleted.',
          toast: true,
          timer: 2000,
          showConfirmButton: false,
          position: 'top',
        })
      }
    })
  }

  const handleDeleteItem = (id, columnId, index) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        let data = columns[columnId].items.filter((item) => item.id !== id)
        let object = {
          ...columns,
          [columnId]: {
            ...columns[columnId],
            items: [...data],
          },
        }
        setColumns(object)
        localStorage.setItem('file', JSON.stringify(object))
        dispatch(newData(object))
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Your task has been deleted.',
          toast: true,
          timer: 2000,
          showConfirmButton: false,
          position: 'top',
        })
      }
    })
  }

  return (
    <>
      <DragDropContext
        className='list-card'
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              key={columnId}
            >
              <label
                className='list-header'
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <span>{column.name}</span>
                <span onClick={() => handleDelete(columnId)}>
                  <DeleteOutlinedIcon />
                </span>
              </label>

              <div className='list-content'>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          margin: 4,
                        }}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <DraggableItem
                              key={item.id}
                              item={item}
                              index={index}
                              columnId={columnId}
                              handleDeleteItem={handleDeleteItem}
                            ></DraggableItem>
                          )
                        })}
                        {provided.placeholder}
                      </div>
                    )
                  }}
                </Droppable>
                <div className='list-footer'>
                  <input
                    style={{ fontSize: '14px' }}
                    className='input-card'
                    type='text'
                    placeholder='Enter card name & Press Enter to save...'
                    onKeyPress={(e) => {
                      let item = { id: v4(), content: e.target.value }
                      if (e.target.value.trim() && e.key === 'Enter') {
                        let data = {
                          ...columns,
                          [columnId]: {
                            ...columns[columnId],
                            items: [
                              ...columns[columnId].items,
                              { ...columns[columnId].items, ...item },
                            ],
                          },
                        }
                        e.target.value = null
                        setColumns(data)
                        localStorage.setItem('file', JSON.stringify(data))
                        dispatch(newData(data))
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </DragDropContext>
      <div>
        <Input
          value={name}
          onChange={handleInput}
          onKeyPress={handleKeyPress}
        />
      </div>
    </>
  )
}

export default DragContext