Use VHX_DataBase;

CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PhotoLink VARCHAR(255),
    language VARCHAR(255) DEFAULT 'english'                    
);

#CREATE TABLE files (
#  file_id INT AUTO_INCREMENT PRIMARY KEY,
#  user_id INT NOT NULL,
#  filename VARCHAR(255) NOT NULL,
# file_data BLOB,  -- Consider alternative for large files
#  file_type VARCHAR(255),  -- New column for video/photo distinction
#  FOREIGN KEY (user_id) REFERENCES users(user_id)
#); 
#Table files not in use

CREATE TABLE history (
    user_id INT NOT NULL,
    Subject VARCHAR(255) NOT NULL,
    PartofSubject VARCHAR(255) NOT NULL,
    text_file MEDIUMTEXT,
    video_file LONGTEXT
);
