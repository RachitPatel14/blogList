const dummy = (blogs) => {
  return blogs.length === 0 
  ? 1
  : blogs
}

const totalLikes = (blogs) => {
    const reducer =  (sum, blog) => {
        return sum+blog.likes
    }

    return blogs.length === 1
    ? blogs[0].likes
    : blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
    let mostLikes = 0
    blogs.forEach(b => {
        if(b.likes >= mostLikes) mostLikes = b.likes
    })
    let result  = []
     result = blogs.filter(b => b.likes === mostLikes)
     const {author: author,
        likes: likes,
        title: title} = result[0]
    return {title, author, likes}
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog
}