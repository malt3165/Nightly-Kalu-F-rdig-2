export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          nickname: string;
          bio: string | null;
          age: number | null;
          location: string | null;
          profile_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          nickname: string;
          bio?: string | null;
          age?: number | null;
          location?: string | null;
          profile_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          nickname?: string;
          bio?: string | null;
          age?: number | null;
          location?: string | null;
          profile_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      friends: {
        Row: {
          id: string;
          user_id: string;
          friend_id: string;
          status: 'pending' | 'accepted' | 'blocked';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          friend_id: string;
          status?: 'pending' | 'accepted' | 'blocked';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          friend_id?: string;
          status?: 'pending' | 'accepted' | 'blocked';
          created_at?: string;
        };
      };
      groups: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          owner_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          owner_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          owner_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      group_members: {
        Row: {
          id: string;
          group_id: string;
          user_id: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          user_id: string;
          joined_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          user_id?: string;
          joined_at?: string;
        };
      };
      check_ins: {
        Row: {
          id: string;
          user_id: string;
          club_id: string;
          checked_in_at: string;
          checked_out_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          club_id: string;
          checked_in_at?: string;
          checked_out_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          club_id?: string;
          checked_in_at?: string;
          checked_out_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}