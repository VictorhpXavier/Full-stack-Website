Use VHX_DataBase;

CREATE TABLE Users (
  id int NOT NULL AUTO_INCREMENT,
  email varchar(255) NOT NULL,
  password_hash varchar(255) NOT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PhotoLink varchar(255) DEFAULT NULL,
  language varchar(255) DEFAULT 'english',
  PRIMARY KEY (id),
  UNIQUE KEY email (email)
)

--CREATE TABLE subject (
--  user_id int NOT NULL,
--  Math tinyint(1) DEFAULT NULL,
--  Physic tinyint(1) DEFAULT NULL,
--  Chemistry tinyint(1) DEFAULT NULL,
--  CS tinyint(1) DEFAULT NULL,
--  History tinyint(1) DEFAULT NULL,
--  Portuguese tinyint(1) DEFAULT NULL,
--  English tinyint(1) DEFAULT NULL,
--  French tinyint(1) DEFAULT NULL,
--  Spanish tinyint(1) DEFAULT NULL,
--  Biology tinyint(1) DEFAULT NULL,
--  Geography tinyint(1) DEFAULT NULL
--)

CREATE TABLE Chats (
    chat_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    chat_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    chat_id INT NOT NULL,
    user_id INT NOT NULL,
    message_content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES Chats(chat_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);