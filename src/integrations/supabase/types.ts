export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      landlords: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          annual_rent_aed: number
          area: string | null
          created_at: string
          id: string
          landlord_id: string
          name: string
          status: string
          tenant_id: string | null
        }
        Insert: {
          annual_rent_aed: number
          area?: string | null
          created_at?: string
          id?: string
          landlord_id: string
          name: string
          status: string
          tenant_id?: string | null
        }
        Update: {
          annual_rent_aed?: number
          area?: string | null
          created_at?: string
          id?: string
          landlord_id?: string
          name?: string
          status?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "landlords"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      recovery_actions: {
        Row: {
          action: string
          created_at: string
          id: string
          outcome: string | null
          payment_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          outcome?: string | null
          payment_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          outcome?: string | null
          payment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recovery_actions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "rent_payments"
            referencedColumns: ["id"]
          },
        ]
      }
      reminders: {
        Row: {
          channel: string
          id: string
          note: string | null
          payment_id: string
          sent_at: string
        }
        Insert: {
          channel: string
          id?: string
          note?: string | null
          payment_id: string
          sent_at?: string
        }
        Update: {
          channel?: string
          id?: string
          note?: string | null
          payment_id?: string
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "rent_payments"
            referencedColumns: ["id"]
          },
        ]
      }
      rent_payments: {
        Row: {
          amount_aed: number
          created_at: string
          due_date: string
          id: string
          paid_at: string | null
          property_id: string
          schedule_id: string
          status: string
        }
        Insert: {
          amount_aed: number
          created_at?: string
          due_date: string
          id?: string
          paid_at?: string | null
          property_id: string
          schedule_id: string
          status: string
        }
        Update: {
          amount_aed?: number
          created_at?: string
          due_date?: string
          id?: string
          paid_at?: string | null
          property_id?: string
          schedule_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "rent_payments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rent_payments_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "rent_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      rent_schedules: {
        Row: {
          allow_ziina_fallback: boolean
          ask_bank_connect: boolean
          created_at: string
          first_due_date: string
          id: string
          number_of_payments: number
          payment_amount_aed: number
          property_id: string
        }
        Insert: {
          allow_ziina_fallback?: boolean
          ask_bank_connect?: boolean
          created_at?: string
          first_due_date: string
          id?: string
          number_of_payments: number
          payment_amount_aed: number
          property_id: string
        }
        Update: {
          allow_ziina_fallback?: boolean
          ask_bank_connect?: boolean
          created_at?: string
          first_due_date?: string
          id?: string
          number_of_payments?: number
          payment_amount_aed?: number
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rent_schedules_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          bank_authorized: boolean
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          bank_authorized?: boolean
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
        }
        Update: {
          bank_authorized?: boolean
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const