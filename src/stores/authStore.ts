import { Store } from "@tanstack/store"

interface User {
  id: string
  email: string
  name: string
  role: 'mechanic' | 'user' | 'super-admin' | 'admin'
}
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean

}
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false
};
export const authStore = new Store<AuthState>(initialState);

export const authActions = {
  login: (userData: User, token: string) => {
    authStore.setState({
      user: userData,
      token,
      isAuthenticated: true
    })
    localStorage.setItem('user', JSON.stringify({ user: userData, token }))
  },
  logout: () => {
    authStore.setState(initialState);
    localStorage.removeItem('user');
  },
  initialize: () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser)
      try {
        const { user, token } = JSON.parse(storedUser);
        authStore.setState({
          user,
          token,
          isAuthenticated: true
        });
      }
      catch (error) {
        localStorage.removeItem('user');
      }
  }
};