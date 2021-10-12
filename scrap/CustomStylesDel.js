const customStyles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: '1px dotted pink',
      color: state.isSelected ? 'red' : 'blue',
      padding: 20,
      width: 50
    }),
    control: () => ({
      // none of react-select's styles are passed to <Control />
      width: 50,
    })
}