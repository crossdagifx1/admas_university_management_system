-- Migration to add password column to users table and backfill it with username
alter table users add column if not exists password text;
update users set password = username where password is null;
