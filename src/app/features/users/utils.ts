import { UserDTO } from "../../models/user.model";

export const isGivenUserAdmin = (user: UserDTO): boolean => {
  return user.roles.includes('admin');
}

export const isGivenUserBanned = (user: UserDTO): boolean => {
  return user.status === 'banned';
}