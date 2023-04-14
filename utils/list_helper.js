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

const mostBlogs = (blogs) => {
    let authorArray = blogs.map(b => b.author)
    let authorMap = {}
    let maxBlogsAuthor = authorArray[0], maxCount = 1
    for(let i=0; i<authorArray.length; i++) {
        let author = authorArray[i]

        if(authorMap[author] == null)
            authorMap[author] = 1
        else
            authorMap[author]++

        if(authorMap[author]> maxCount){
            maxBlogsAuthor = author
            maxCount = authorMap[author]
        }
    }
    return {
        author: maxBlogsAuthor,
        blogs: maxCount
    }
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs
}