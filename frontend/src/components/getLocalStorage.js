export function getUser() {
  const rawUser = localStorage.getItem("user");
  const user = JSON.parse(rawUser);
  return user;
}

