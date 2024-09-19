import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { logout } from '@/app/logout/actions'
import { updateDetails } from './action'

export default function personalDetails(){
    return(
        <main>
            <form>
                <label>Name</label>
                <input id="name" name="name" type="text" required/>
                <label>Age</label>
                <input id="age" name="age" type="number" required/>
                <label>Type of steel</label>
                <input id="steel" name="steel" type="text" required/>
                <button formAction={updateDetails}>update</button>
            </form>
        </main>
    )
}