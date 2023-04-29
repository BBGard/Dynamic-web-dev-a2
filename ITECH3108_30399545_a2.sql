--
-- ITECH 3108 Assignment 2
-- Benjamin Gardiner 30399545
-- This script sets up and populates
-- the datatbase for "Incense Voice"
--
-- USAGE: copy and paste into psql terminal
--

--
-- Drop Database if it exists
DROP DATABASE IF EXISTS itech3108_30399545_a2;

--
-- Create Database
CREATE DATABASE itech3108_30399545_a2;
\c itech3108_30399545_a2;


--
-- Postgres admin setup
--
-- Drop postgres user if they exist
DROP USER IF EXISTS incense;

--
-- Create postgres user - grant access
CREATE USER incense WITH PASSWORD 'pword123';
GRANT ALL PRIVILEGES ON DATABASE itech3108_30399545_a2 TO incense;
GRANT USAGE ON SEQUENCE members_member_id_seq TO incense;


-- Database Setup

--
-- Drop table if exists
DROP TABLE IF EXISTS members;
--
-- Create members table
CREATE TABLE members (
  member_id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(120) NOT NULL,
  incense_points INTEGER NOT NULL DEFAULT 0
);

--
-- INSERT some member data
INSERT INTO members (username, password_hash, incense_points)
VALUES
  ('ben', '$argon2id$v=19$m=65536,t=2,p=1$ufD/j+14OKGnJDZarndvwQ$TWQ/IV7p/hfiXXaIfTnIIIizfEYyZsO48s0n6yLflXY', 10),
  ('adam', '$argon2id$v=19$m=65536,t=2,p=1$5xfmyANPf2RmPUS6pOez6A$T4lJ+NdVj074ff1jOriO1eMksudsVbkCnsPBoaTw+n0', 5),
  ('julie', '$argon2id$v=19$m=65536,t=2,p=1$ipzIkM8kzeAEA0QiLbCsSQ$s4hRLnA8k65h+yBd8dR98+gkL3H7eYSYewZYXQKrLN8', 2),
  ('crystal', '$argon2id$v=19$m=65536,t=2,p=1$GOSCz/n2f1MiVGxxG4/9Sg$UuuKrhEPlXqEw99fMOtSAcIyI9i9zM5tyxIzZiat8tU', 6);
