-- Esse script representa a criação das tabelas no banco.

create table usuarios (
	id serial primary key,
	cpf varchar(11) not null unique check (cpf ~ '^[0-9]{11}$'),
	nome varchar(20) not null check (nome ~ '^[A-Za-zÁÀÂÃÉÊÍÓÔÕÚÜÇáàâãéêíóôõúüç]+$'),
	sobrenome varchar(40) not null check (sobrenome ~ '^[A-Za-zÁÀÂÃÉÊÍÓÔÕÚÜÇáàâãéêíóôõúüç ]+$'),
	data_nascimento date not null check (data_nascimento <= (current_date - interval '18 years')and data_nascimento > '1900-01-01')
);

create table transferencias (
	id bigserial primary key,
	emissor int,
	foreign key (emissor) references usuarios(id),
	destinatario int check (emissor != destinatario),
	foreign key (destinatario) references usuarios(id),
	data timestamptz default (current_timestamp),
	valor numeric(15,2) check (valor >= 0.01)
);