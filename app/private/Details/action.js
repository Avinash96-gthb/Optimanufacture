'use server'
import { redirect } from "next/navigation"
import { createClient } from '@/utils/supabase/server'

export async function updateDetails(formData) {
    const supabase = createClient()
    const data = {
        name1: formData.get('name'),
        age1: formData.get('age'),
        steel1: formData.get('steel')
    }
    const { data1, error } = await supabase.auth.admin.getUserById(1)
    const { error1 } = await supabase
    .from('Test1')
    .insert({ id: data1, Name: data.name1, Age: data.age1, Steel: data.steel1 }) 
    if (error1){
        redirect('/error')
    }
}