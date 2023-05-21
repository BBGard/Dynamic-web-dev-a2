--
-- ITECH 3108 Assignment 2
-- Benjamin Gardiner 30399545
-- This script sets up and populates
-- the datatbase for "Incense Voice"
--
-- USAGE: copy and paste into psql terminal or run: \i database_setup.sql
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
-- Drop tables if exists
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS members;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS votes;
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
  post_url VARCHAR(1000) NOT NULL DEFAULT '#',
  post_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  post_hidden BOOLEAN DEFAULT FALSE,
  post_rating INTEGER DEFAULT 0,
  post_author VARCHAR(50),
  member_id INTEGER,
  FOREIGN KEY (member_id) REFERENCES members (member_id)
);

--
-- INSERT some post data
INSERT INTO posts (post_title, post_description, post_url, post_rating, member_id, post_author)
SELECT 'Good scent samplers.', 'Check out these great scent samplers I found!', 'https://www.reddit.com/r/Incense/comments/13ic09k/good_scent_samplers/', 10, 1, members.username
FROM members
WHERE members.member_id = 1;

INSERT INTO posts (post_title, post_description, post_url, post_rating, member_id, post_author)
SELECT 'mica plate on charcoal', 'Awesome way to burn your incense.', 'https://www.reddit.com/r/Incense/comments/13i2asa/mica_plate_on_charcoal/', 5, 2, members.username
FROM members
WHERE members.member_id = 2;

INSERT INTO posts (post_title, post_description, post_url, post_rating, member_id, post_author)
SELECT 'Kunmeido Asuka and Tennendo Enkuu Horizon.', 'These are possibly my two favourite smelling sticks!', 'https://www.reddit.com/r/Incense/comments/13h3rbz/kunmeido_asuka_and_tennendo_enkuu_horizon_smell/', 2, 1, members.username
FROM members
WHERE members.member_id = 1;

INSERT INTO posts (post_title, post_description, post_url, post_rating, member_id, post_author)
SELECT 'Tibetan rope incense!', 'Get around it boys and girls!','https://www.reddit.com/r/Incense/comments/13gyg94/favorite_tibetan_rope_incense/', 0, 3, members.username
FROM members
WHERE members.member_id = 3;

INSERT INTO posts (post_title, post_description, post_url, post_rating, member_id, post_author)
SELECT 'dragon blood incense?', 'Just tried this. Smells like farts?', 'https://www.reddit.com/r/Incense/comments/13gkwkv/which_brand_has_the_best_dragon_blood_incense/', -3, 2, members.username
FROM members
WHERE members.member_id = 2;

-- Create votes table to track which posts members have voted on
CREATE TABLE votes (
  vote_id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts (post_id),
  member_id INTEGER REFERENCES members (member_id),
  vote_value INTEGER DEFAULT 0,
  vote_timestamp TIMESTAMP DEFAULT NOW()
);

-- Create favorites table to track which posts members favorited
CREATE TABLE favorites (
  member_id INTEGER REFERENCES members(member_id),
  post_id INTEGER REFERENCES posts(post_id),
  PRIMARY KEY (member_id, post_id)
);


--
-- Postgres admin setup
--

-- Revoke privileges from incense user
REVOKE ALL PRIVILEGES ON DATABASE itech3108_30399545_a2 FROM incense;
REVOKE ALL PRIVILEGES ON TABLE members FROM incense;
REVOKE ALL PRIVILEGES ON TABLE posts FROM incense;
REVOKE ALL PRIVILEGES ON TABLE votes FROM incense;
REVOKE ALL PRIVILEGES ON TABLE favorites FROM incense;
REVOKE USAGE ON SEQUENCE members_member_id_seq FROM incense;
REVOKE USAGE ON SEQUENCE posts_post_id_seq FROM incense;
REVOKE USAGE ON SEQUENCE votes_vote_id_seq FROM incense;

-- Drop postgres user if they exist
DROP USER IF EXISTS incense;

--
-- Create postgres user - grant access
CREATE USER incense WITH PASSWORD 'pword123';
GRANT ALL PRIVILEGES ON DATABASE itech3108_30399545_a2 TO incense;
GRANT ALL PRIVILEGES ON TABLE members TO incense;
GRANT ALL PRIVILEGES ON TABLE posts TO incense;
GRANT ALL PRIVILEGES ON TABLE votes TO incense;
GRANT ALL PRIVILEGES ON TABLE favorites TO incense;
GRANT USAGE ON SEQUENCE members_member_id_seq TO incense;
GRANT USAGE ON SEQUENCE posts_post_id_seq TO incense;
GRANT USAGE ON SEQUENCE votes_vote_id_seq TO incense;
