const useBoxShadow = (isActive: boolean) => {
    const boxShadow = isActive ? '3px 7px 30px 0px rgba(0,0,0,0.12)' : 'none'
    return boxShadow
}

export default useBoxShadow
