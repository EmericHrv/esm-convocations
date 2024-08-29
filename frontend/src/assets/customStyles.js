const customStyles = {
    control: (provided, state) => ({
        ...provided,
        borderColor: state.isFocused ? '#FFDE00' : provided.borderColor,
        boxShadow: state.isFocused ? '0 0 0 1px #FFDE00' : provided.boxShadow,
        '&:hover': {
            borderColor: '#FFDE00',
        },
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected
            ? '#FFDE00'
            : state.isFocused
                ? '#FFF380'
                : provided.backgroundColor,
        color: state.isSelected || state.isFocused ? '#000000' : provided.color,
        '&:hover': {
            backgroundColor: '#FFF380',
            color: '#000000',
        },
    }),
};

export default customStyles;