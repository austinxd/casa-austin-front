const capitalizeWords = (text: string) => {
    const formatText = text.toLowerCase().replace(/\b\w/g, (char: string) => char.toUpperCase())

    return formatText
}

export default capitalizeWords
