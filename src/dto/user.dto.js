export const userDTO = (user) => ({
  id: user._id,
  first_name: user.first_name,
  email: user.email,
  role: user.role
});