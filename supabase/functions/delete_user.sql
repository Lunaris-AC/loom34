-- Fonction pour supprimer un utilisateur en toute sécurité
create or replace function delete_user(user_id uuid)
returns void
language plpgsql
security definer -- Exécute avec les privilèges du propriétaire
as $$
begin
  -- Supprimer d'abord de auth.users
  delete from auth.users where id = user_id;
  -- La suppression du profil se fera automatiquement grâce aux foreign keys
end;
$$;
