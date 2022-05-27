const Input = (props) => {
    return (
      <>
        <input
          style={{ fontSize: '14px' }}
          className='input-new-list'
          type='text'
          placeholder='Enter list name & Press Enter to save...'
          onChange={props.onChange}
          onKeyPress={props.onKeyPress}
        />
      </>
    )
  }
  
  export default Input