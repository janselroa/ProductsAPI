
CREATE DATABASE products;

CREATE TABLE users(
    id integer auto_increment primary key,
    name varchar(100) NOT NULL,
    email varchar(255) NOT NULL,
    password varchar(200) NOT NULL
);

CREATE TABLE products(
    id integer auto_increment primary key,
    name varchar(100) NOT NULL,
    category varchar(150) NOT NULL,
    price integer NOT NULL,
    inventory integer NOT NULL,
    maker varchar(100) NOT NULL,
    images varchar(255) NOT NULL,
    seller_id integer NOT NULL,
    FOREIGN KEY(seller_id) REFERENCES users(id)
);
