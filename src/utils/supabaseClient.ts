import {createClient, Session} from "@supabase/supabase-js"
// import { Dispatch, SetStateAction, useEffect, useState } from 'react'


export const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
