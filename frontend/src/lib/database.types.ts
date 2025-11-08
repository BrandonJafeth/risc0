export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      amenazas: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          valor: number
          activo: boolean
          creado_en: string
          actualizado_en: string
        }
        Insert: {
          id?: string
          nombre: string
          descripcion?: string | null
          valor: number
          activo?: boolean
          creado_en?: string
          actualizado_en?: string
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string | null
          valor?: number
          activo?: boolean
          creado_en?: string
          actualizado_en?: string
        }
      }
      vulnerabilidades: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          valor: number
          activo: boolean
          creado_en: string
          actualizado_en: string
        }
        Insert: {
          id?: string
          nombre: string
          descripcion?: string | null
          valor: number
          activo?: boolean
          creado_en?: string
          actualizado_en?: string
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string | null
          valor?: number
          activo?: boolean
          creado_en?: string
          actualizado_en?: string
        }
      }
      riesgos: {
        Row: {
          id: string
          amenaza_id: string
          vulnerabilidad_id: string
          puntaje: number
          nivel: 'Bajo' | 'Medio' | 'Alto' | 'Crítico'
          color_hex: string
          creado_en: string
        }
        Insert: {
          id?: string
          amenaza_id: string
          vulnerabilidad_id: string
          puntaje: number
          nivel: 'Bajo' | 'Medio' | 'Alto' | 'Crítico'
          color_hex: string
          creado_en?: string
        }
        Update: {
          id?: string
          amenaza_id?: string
          vulnerabilidad_id?: string
          puntaje?: number
          nivel?: 'Bajo' | 'Medio' | 'Alto' | 'Crítico'
          color_hex?: string
          creado_en?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
