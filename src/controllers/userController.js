const getUsers = (req, res) => {
  res.json({
    message: "Users controller working!"
  })
}

module.exports = {
  getUsers
}