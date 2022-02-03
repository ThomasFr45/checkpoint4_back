CREATE TABLE `user` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `username` char(250) NOT NULL,
  `password` char(250) NOT NULL,
  `token` char(250)
);

CREATE TABLE `item` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` char(250) NOT NULL,
  `price` int NOT NULL,
  `toggle` boolean NOT NULL,
  `image` char(255) NOT NULL
);

CREATE TABLE `recipe` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `cost` int NOT NULL,
  `item_id` int NOT NULL
);

CREATE TABLE `orders` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `total` int NOT NULL,
  `buyer` char(250) NOT NULL,
  `user_id` int
);

ALTER TABLE `recipe` ADD FOREIGN KEY (`item_id`) REFERENCES `item` (`id`);

ALTER TABLE `orders` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
