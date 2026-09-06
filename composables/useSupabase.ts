import { type Database } from '~/types/supabase'

export const useSupabase = () => {
  const client = useSupabaseClient<Database>()
  const user = useSupabaseUser()

  const getProfile = async (userId: string) => {
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  }

  const getBusinessBySlug = async (slug: string) => {
    const { data, error } = await client
      .from('profiles')
      .select('*, services(*)')
      .eq('slug', slug)
      .single()
    return { data, error }
  }

  return {
    client,
    user,
    getProfile,
    getBusinessBySlug
  }
}
