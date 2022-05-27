import { Draggable } from 'react-beautiful-dnd'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
const DraggableItem = (props) => {
  return (
    <>
      <Draggable
        key={props.item.id}
        draggableId={props.item.id}
        index={props.index}
      >
        {(provided, snapshot) => {
          return (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={{
                ...provided.draggableProps.style,
              }}
            >
              <span
                className='element-card'
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <span>{props.item.content}</span>
                <span
                  onClick={() =>
                    props.handleDeleteItem(
                      props.item.id,
                      props.columnId,
                      props.index
                    )
                  }
                >
                  <DeleteOutlinedIcon></DeleteOutlinedIcon>
                </span>
              </span>
            </div>
          )
        }}
      </Draggable>
    </>
  )
}

export default DraggableItem