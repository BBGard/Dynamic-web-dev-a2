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


-- Database Setup

--
-- Drop table if exists
DROP TABLE IF EXISTS posts;
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
  ('ben', '$argon2id$v=19$m=65536,t=2,p=1$ufD/j+14OKGnJDZarndvwQ$TWQ/IV7p/hfiXXaIfTnIIIizfEYyZsO48s0n6yLflXY', 12),
  ('adam', '$argon2id$v=19$m=65536,t=2,p=1$5xfmyANPf2RmPUS6pOez6A$T4lJ+NdVj074ff1jOriO1eMksudsVbkCnsPBoaTw+n0', 2),
  ('julie', '$argon2id$v=19$m=65536,t=2,p=1$ipzIkM8kzeAEA0QiLbCsSQ$s4hRLnA8k65h+yBd8dR98+gkL3H7eYSYewZYXQKrLN8', 0),
  ('crystal', '$argon2id$v=19$m=65536,t=2,p=1$GOSCz/n2f1MiVGxxG4/9Sg$UuuKrhEPlXqEw99fMOtSAcIyI9i9zM5tyxIzZiat8tU', 0);


--
-- Create posts (links) table
CREATE TABLE posts (
  post_id SERIAL PRIMARY KEY,
  post_title VARCHAR(50) NOT NULL,
  post_description VARCHAR(100) NOT NULL,
  post_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  post_hidden BOOLEAN DEFAULT FALSE,
  post_rating INTEGER DEFAULT 0,
  post_author VARCHAR(50),
  member_id INTEGER,
  FOREIGN KEY (member_id) REFERENCES members (member_id)
);

--
-- INSERT some post data
INSERT INTO posts (post_title, post_description, post_rating, member_id, post_author)
SELECT 'Good scent samplers.', 'Check out these great scent samplers I found!', 10, 1, members.username
FROM members
WHERE members.member_id = 1;

INSERT INTO posts (post_title, post_description, post_rating, member_id, post_author)
SELECT 'mica plate on charcoal', 'Awesome way to burn your incense.', 5, 2, members.username
FROM members
WHERE members.member_id = 2;

INSERT INTO posts (post_title, post_description, post_rating, member_id, post_author)
SELECT 'Kunmeido Asuka and Tennendo Enkuu Horizon.', 'These are possibly my two favourite smelling sticks!', 2, 1, members.username
FROM members
WHERE members.member_id = 1;

INSERT INTO posts (post_title, post_description, post_rating, member_id, post_author)
SELECT 'Tibetan rope incense!', 'Get around it boys and girls!', 0, 3, members.username
FROM members
WHERE members.member_id = 3;

INSERT INTO posts (post_title, post_description, post_rating, member_id, post_author)
SELECT 'dragon blood incense?', 'Just tried this. Smells like farts?', -3, 2, members.username
FROM members
WHERE members.member_id = 2;

--
-- Postgres admin setup
--
-- Drop postgres user if they exist
DROP USER IF EXISTS incense;

--
-- Create postgres user - grant access
CREATE USER incense WITH PASSWORD 'pword123';
GRANT ALL PRIVILEGES ON DATABASE itech3108_30399545_a2 TO incense;
GRANT ALL PRIVILEGES ON TABLE members TO incense;
GRANT ALL PRIVILEGES ON TABLE posts TO incense;
GRANT USAGE ON SEQUENCE members_member_id_seq TO incense;
GRANT USAGE ON SEQUENCE posts_post_id_seq TO incense;
