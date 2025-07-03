import { createFileRoute, Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { User2 } from 'lucide-react'
import { useLogin } from '@/hooks/useLogin'

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const loginMutation = useLogin()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      loginMutation.mutate(value)
      console.log('Logging in with:', value)
    },
  })

  return (
    <div className="flex justify-center min-h-screen bg-gray-50 px-4 pt-[25vh]">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 h-max sm:p-8">
        <div className="flex items-center gap-2 mb-6 text-blue-600">
          <User2 size={20} />
          <h2 className="text-2xl font-bold">Login to Your Account</h2>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-5"
        >
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                if (!value) return 'Email is required'
                if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(value)) return 'Invalid email address'
              },
            }}
            children={(field) => (
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                <div className="flex items-center border rounded px-3 py-2">
                  <User2 className="text-gray-400 mr-2" />
                  <input
                    type="email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full outline-none"
                  />
                </div>
                {field.state.meta.errors?.length > 0 && (
                  <p className="text-red-500 text-sm mt-1">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          />

          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) => {
                if (!value) return 'Password is required'
                if (value.length < 6) return 'Password must contain 6 characters'
              },
            }}
            children={(field) => (
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
                <div className="flex items-center border rounded px-3 py-2">
                  <User2 className="text-gray-400 mr-2" />
                  <input
                    type="password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="******"
                    className="w-full outline-none"
                  />
                </div>
                {field.state.meta.errors?.length > 0 && (
                  <p className="text-red-500 text-sm mt-1">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          />

          <button
            type="submit"
            className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200 flex justify-center items-center gap-2"
          >
            <User2 />
            Login
          </button>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Don&apos;t have an account?{' '}
            <Link
              to="/auth/login"
              className="text-blue-600 font-medium hover:underline hover:text-blue-800 transition"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
