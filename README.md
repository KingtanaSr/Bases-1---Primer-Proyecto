# Sistema de Gestión de Publicaciones sobre Biodiversidad

**Proyecto 1 - Bases de Datos 1**

Sistema web full-stack para la gestión y consulta de publicaciones científicas relacionadas con biodiversidad. Permite realizar operaciones CRUD sobre publicaciones, consultarlas por nombre científico de especies, y visualizarlas agrupadas por colecciones.

---

## Descripción del Proyecto

Esta aplicación permite administrar un catálogo de publicaciones científicas sobre biodiversidad. Las principales funcionalidades son:

- Consultar publicaciones filtradas por el **nombre científico** de la especie
- Crear, editar, consultar y eliminar publicaciones
- Visualizar publicaciones agrupadas por **colección**
- Gestionar información relacionada: especies, autores, instituciones y nombres comunes

El proyecto fue desarrollado como primer trabajo de la asignatura **Bases de Datos 1**, con énfasis en el diseño relacional y el uso de consultas SQL avanzadas en PostgreSQL.

---

## Tecnologías Utilizadas

| Capa              | Tecnología                          |
|-------------------|-------------------------------------|
| **Frontend**      | React 18 + Axios + React Select     |
| **Backend**       | Node.js + Express + Morgan + CORS   |
| **Base de Datos** | PostgreSQL 16                       |
| **Otros**         | Nodemon (desarrollo)                |

---

## Modelo de Base de Datos

### Tablas principales

| Tabla                   | Descripción                                      |
|-------------------------|--------------------------------------------------|
| `publication_`          | Publicaciones científicas                        |
| `author`                | Autores de las publicaciones                     |
| `author_publication`    | Relación muchos a muchos Autor ↔ Publicación     |
| `species`               | Especies científicas                             |
| `species_publication`   | Relación muchos a muchos Especie ↔ Publicación   |
| `collection`            | Colecciones de publicaciones                     |
| `collection_publication`| Relación muchos a muchos Colección ↔ Publicación |
| `institution`           | Instituciones asociadas                          |
| `common_names`          | Nombres comunes de las especies                  |

### Características destacadas de SQL

- Consultas con múltiples `JOIN`
- Uso de `STRING_AGG` + `CONCAT` + `COALESCE` para concatenar autores
- Transacciones (`BEGIN` / `COMMIT`) al crear publicaciones con autores
- Queries parametrizadas (`$1`, `$2`...) para prevenir SQL Injection
- Relaciones muchos a muchos correctamente normalizadas

---

Este repositorio se mantiene como evidencia de habilidades en:

Diseño de bases de datos relacionales
Consultas SQL avanzadas (JOINs, agregaciones, transacciones)
Desarrollo full-stack con React + Node.js + PostgreSQL
