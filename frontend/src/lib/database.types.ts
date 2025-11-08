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
          activo: boolean | null
          actualizado_en: string | null
          creado_en: string | null
          descripcion: string | null
          id: string
          nombre: string
          valor: number
        }
        Insert: {
          activo?: boolean | null
          actualizado_en?: string | null
          creado_en?: string | null
          descripcion?: string | null
          id?: string
          nombre: string
          valor: number
        }
        Update: {
          activo?: boolean | null
          actualizado_en?: string | null
          creado_en?: string | null
          descripcion?: string | null
          id?: string
          nombre?: string
          valor?: number
        }
        Relationships: []
      }
      riesgos: {
        Row: {
          amenaza_id: string
          color_hex: string
          creado_en: string | null
          id: string
          nivel: string
          puntaje: number
          vulnerabilidad_id: string
        }
        Insert: {
          amenaza_id: string
          color_hex: string
          creado_en?: string | null
          id?: string
          nivel: string
          puntaje: number
          vulnerabilidad_id: string
        }
        Update: {
          amenaza_id?: string
          color_hex?: string
          creado_en?: string | null
          id?: string
          nivel?: string
          puntaje?: number
          vulnerabilidad_id?: string
        }
        Relationships: []
      }
      vulnerabilidades: {
        Row: {
          activo: boolean | null
          actualizado_en: string | null
          creado_en: string | null
          descripcion: string | null
          id: string
          nombre: string
          valor: number
        }
        Insert: {
          activo?: boolean | null
          actualizado_en?: string | null
          creado_en?: string | null
          descripcion?: string | null
          id?: string
          nombre: string
          valor: number
        }
        Update: {
          activo?: boolean | null
          actualizado_en?: string | null
          creado_en?: string | null
          descripcion?: string | null
          id?: string
          nombre?: string
          valor?: number
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
