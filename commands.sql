CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author VARCHAR(255),
    url VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    likes INTEGER DEFAULT 0
);

insert into blogs (author, url, title, likes) values ('author', 'www.url.com', 'title', 0)
insert into blogs (url, title) values ('www.blog.com', 'blog')