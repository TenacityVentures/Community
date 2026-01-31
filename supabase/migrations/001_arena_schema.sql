-- The Arena: Community Platform Schema for Tenacity
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create custom types
create type user_role as enum ('builder', 'partner', 'learner');
create type post_category as enum ('building', 'ideas', 'stories', 'opportunities', 'challenges');
create type reaction_type as enum ('fire', 'lightbulb', 'launch', 'tenacity', 'respect');

-- Profiles table (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  username text unique not null,
  full_name text,
  avatar_url text,
  bio text,
  website text,
  skills text[] default '{}',
  role user_role default 'builder',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Posts table
create table posts (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  slug text unique not null,
  content jsonb not null,
  excerpt text,
  category post_category not null,
  tags text[] default '{}',
  featured boolean default false,
  published boolean default true,
  view_count integer default 0,
  comment_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Comments table
create table comments (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references posts(id) on delete cascade not null,
  author_id uuid references profiles(id) on delete cascade not null,
  parent_id uuid references comments(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Reactions table
create table reactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  post_id uuid references posts(id) on delete cascade,
  comment_id uuid references comments(id) on delete cascade,
  type reaction_type not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  -- Ensure user can only react once per type per target
  unique(user_id, post_id, type),
  unique(user_id, comment_id, type),
  -- Ensure reaction is on either post or comment, not both
  check (
    (post_id is not null and comment_id is null) or
    (post_id is null and comment_id is not null)
  )
);

-- Follows table
create table follows (
  id uuid default uuid_generate_v4() primary key,
  follower_id uuid references profiles(id) on delete cascade not null,
  following_id uuid references profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  -- Prevent duplicate follows and self-follows
  unique(follower_id, following_id),
  check (follower_id != following_id)
);

-- Create indexes for performance
create index posts_author_id_idx on posts(author_id);
create index posts_category_idx on posts(category);
create index posts_created_at_idx on posts(created_at desc);
create index posts_slug_idx on posts(slug);
create index comments_post_id_idx on comments(post_id);
create index comments_author_id_idx on comments(author_id);
create index reactions_post_id_idx on reactions(post_id);
create index reactions_comment_id_idx on reactions(comment_id);
create index follows_follower_id_idx on follows(follower_id);
create index follows_following_id_idx on follows(following_id);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table posts enable row level security;
alter table comments enable row level security;
alter table reactions enable row level security;
alter table follows enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Posts policies
create policy "Published posts are viewable by everyone"
  on posts for select
  using (published = true);

create policy "Users can create posts"
  on posts for insert
  with check (auth.uid() = author_id);

create policy "Users can update own posts"
  on posts for update
  using (auth.uid() = author_id);

create policy "Users can delete own posts"
  on posts for delete
  using (auth.uid() = author_id);

-- Comments policies
create policy "Comments are viewable by everyone"
  on comments for select
  using (true);

create policy "Authenticated users can create comments"
  on comments for insert
  with check (auth.uid() = author_id);

create policy "Users can update own comments"
  on comments for update
  using (auth.uid() = author_id);

create policy "Users can delete own comments"
  on comments for delete
  using (auth.uid() = author_id);

-- Reactions policies
create policy "Reactions are viewable by everyone"
  on reactions for select
  using (true);

create policy "Authenticated users can create reactions"
  on reactions for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own reactions"
  on reactions for delete
  using (auth.uid() = user_id);

-- Follows policies
create policy "Follows are viewable by everyone"
  on follows for select
  using (true);

create policy "Authenticated users can follow"
  on follows for insert
  with check (auth.uid() = follower_id);

create policy "Users can unfollow"
  on follows for delete
  using (auth.uid() = follower_id);

-- Function to automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, username, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update comment count on posts
create or replace function public.update_comment_count()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    update posts set comment_count = comment_count + 1 where id = new.post_id;
  elsif tg_op = 'DELETE' then
    update posts set comment_count = comment_count - 1 where id = old.post_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

-- Trigger to update comment count
create trigger on_comment_change
  after insert or delete on comments
  for each row execute procedure public.update_comment_count();

-- Function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger update_profiles_updated_at
  before update on profiles
  for each row execute procedure public.update_updated_at_column();

create trigger update_posts_updated_at
  before update on posts
  for each row execute procedure public.update_updated_at_column();

create trigger update_comments_updated_at
  before update on comments
  for each row execute procedure public.update_updated_at_column();
