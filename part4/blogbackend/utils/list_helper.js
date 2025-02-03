const totalLikes = (blogList) => {
  let likes = 0;
  for (let i = 0; i < blogList.length; i++) {
    likes += blogList[i].likes
  }
  return likes;
}

const favouriteBlog = (blogList) => {
  if (blogList.length === 0) throw new Error('no blogs in list')
  let favouriteBlog = blogList[0];
  for (let i = 1; i < blogList.length; i++) {
    if (blogList[i].likes > favouriteBlog.likes) {
      favouriteBlog = blogList[i]
    }
  }

  return favouriteBlog;
}

const mostBlogs = (blogList) => {
  const blogAuthors = [];

  for (let i = 0; i < blogList.length; i++) {
    // If blogAuthor is empty OR the current author in blogList is not in blogAuthors
    if (blogAuthors.length === 0 || blogAuthors.some(author => author.author === blogList[i].author) === false) {
      const author = {
        author: blogList[i].author,
        blogs: 1
      }
      blogAuthors.push(author)
    }
    // Author already is in the array of authors and their blog numbers so you just increment the blog number 
    else {
      let author = blogAuthors.find(author => author.author === blogList[i].author)
      author.blogs++;
    }
  }
  
  // Now we go over the array and find the author with the most blogs
  let authorWithMostBlogs = blogAuthors[0]
  for (let i = 1; i < blogAuthors.length; i++) {
    if (blogAuthors[i].blogs > authorWithMostBlogs.blogs) {
      authorWithMostBlogs = blogAuthors[i]
    }
  }

  return authorWithMostBlogs;
}
 
const mostLikes = (blogList) => {
  const authorLikes = []
  for (let i = 0; i < blogList.length; i++) {
    if (authorLikes.length === 0 || authorLikes.some(author => author.author === blogList[i].author) === false) {
      const author = {
        author: blogList[i].author,
        likes: blogList[i].likes
      }
      authorLikes.push(author)
    }
    else {
      let author = authorLikes.find(author => author.author === blogList[i].author)
      author.likes += blogList[i].likes
    }
  }

  // Now we go over the array and find the author with the most likes
  let authorWithMostLikes = authorLikes[0]
  for (let i = 1; i < authorLikes.length; i++) {
    if (authorLikes[i].likes > authorWithMostLikes.likes) {
      authorWithMostLikes = authorLikes[i]
    }
  }

  return authorWithMostLikes;
} 

module.exports = {
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}