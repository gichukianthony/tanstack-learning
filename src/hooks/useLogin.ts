// src/hooks/useLogin.ts
import { useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { LoginUser } from '@/api/login'
import { authActions } from '@/stores/authStore'
import { toast } from 'sonner'

export function useLogin() {
  const navigate = useNavigate()


  const mutation = useMutation({
    mutationFn: LoginUser,
    onSuccess: (data) => {
      const user =  data.foundUser;
      if (!data || !user) {
        toast.error('Login failed.')
        return
      }
      console.log('Login successful:', data)
      toast.success('Logged in successfully!')
      authActions.login(
        {
          id: user.id,
          email: user.email,
          name: user.username || 'User',
          role: user.role || 'user',
        },
        data.accessToken
      )
      // Role-based redirect
      if (user.role === 'admin') {
        navigate({ to: '/admin' })
      } else if (user.role === 'mechanic') {
        navigate({ to: '/mechanic' })
      } else if (user.role === 'user') {
        navigate({ to: '/user' })
      } else {
        navigate({ to: '/' })
      }
    },
    onError: (error) => {
    
      console.error('Login error:', error)
      if (error instanceof Error) {
        toast.error( 'Login failed. check on your password or email.')
      } else {
        toast.error('An unexpected error occurred during login.')
      }
    },
  })

  return mutation
}
