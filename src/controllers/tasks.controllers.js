const pool = require('../db'); //Import de la base de datos

// Función para obtener todas las publicaciones
//Toma dos parámetros: req (la solicitud del cliente) y res (la respuesta que se enviará al cliente).
//Envia el resultado de la consulta como respuesta JSON al cliente
const getAllPublications = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT publication_.id_publication, 
                publication_.title, 
                publication_.date, 
                publication_.doi, 
                publication_.isbn, 
                publication_.publication_country, 
                institution.name_ AS institution_name,
                STRING_AGG(
                        CONCAT(
                            author.first_name, ' ', 
                            author.middle_name, ' ',
                            author.first_surname, ' ', 
                            author.second_surname
                        ), ', '
                    ) AS authors     
                FROM publication_, institution, author_publication, author
                        WHERE publication_.id_institution = institution.id_institution
                        AND author.id_author = author_publication.id_author
                        AND publication_.id_publication = author_publication.id_publication
                    GROUP BY 
                        publication_.id_publication, 
                        publication_.title, 
                        publication_.date, 
                        publication_.doi, 
                        publication_.isbn, 
                        publication_.publication_country, 
                        institution.name_;

        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching publications:', error);
        res.status(500).json({ error: 'Error fetching publications' });
    }
};


// Función para obtener publicaciones por nombre científico de la especie
//Toma dos parámetros: req (la solicitud del cliente) y res (la respuesta que se enviará al cliente).
//Envia el resultado de la consulta como respuesta JSON al cliente
const getPublicationsBySpeciesName = async (req, res) => {
    const { speciesName } = req.params; // Obtener speciesName desde req.params
    try {
        const query = `
            SELECT publication_.id_publication, 
                publication_.title, 
                publication_.date, 
                publication_.doi, 
                publication_.isbn, 
                publication_.publication_country, 
                institution.name_ AS institution_name,
                STRING_AGG(
                    CONCAT(
                        author.first_name, ' ', 
                        COALESCE(author.middle_name || ' ', ''), 
                        author.first_surname, ' ', 
                        author.second_surname
                    ), ', '
                ) AS authors     
            FROM publication_, institution, author_publication, author, species, species_publication
            WHERE publication_.id_institution = institution.id_institution
                AND author.id_author = author_publication.id_author
                AND publication_.id_publication = author_publication.id_publication
                AND species_publication.id_publication = publication_.id_publication
                AND species_publication.id_species = species.id_species
                AND species.scientific_name = $1
            GROUP BY 
                publication_.id_publication, 
                publication_.title, 
                publication_.date, 
                publication_.doi, 
                publication_.isbn, 
                publication_.publication_country, 
                institution.name_;
        `;
        
        const values = [speciesName];
        
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching publications by species:', error);
        res.status(500).json({ error: 'Error fetching publications by species' });
    }
};


// Función para obtener una publicación por ID
//Toma dos parámetros: req (la solicitud del cliente) y res (la respuesta que se enviará al cliente).
//Envia el resultado de la consulta como respuesta JSON al cliente
const getPublication = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM publication_ WHERE id_publication = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Publication not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching publication:', error);
        res.status(500).json({ error: 'Error fetching publication' });
    }
};


// Funcion para crear una nueva publicación
//Toma dos parámetros: req (la solicitud del cliente) y res (la respuesta que se enviará al cliente).
//Envia el resultado de la consulta como respuesta JSON al cliente
const createPublication = async (req, res) => { 
    const { title, date, doi, isbn, publication_country, id_institution, authorIds } = req.body;

    // Validar los datos de entrada
    if (!title || !authorIds || !Array.isArray(authorIds) || authorIds.length === 0) {
        return res.status(400).json({ error: 'Título y al menos un autor son requeridos.' });
    }

    const client = await pool.connect();

    try {
        // Iniciar una transacción
        await client.query('BEGIN');

        // Insertar la nueva publicación
        const insertPublicationQuery = `
            INSERT INTO publication_ (title, date, doi, isbn, publication_country, id_institution) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *;
        `;
        const publicationValues = [title, date, doi, isbn, publication_country, id_institution];
        const publicationResult = await client.query(insertPublicationQuery, publicationValues);
        const newPublication = publicationResult.rows[0];

        // Insertar las asociaciones en author_publication
        const insertAuthorPublicationQuery = `
            INSERT INTO author_publication (id_author, id_publication) 
            VALUES ($1, $2);
        `;
        for (const authorId of authorIds) {
            await client.query(insertAuthorPublicationQuery, [authorId, newPublication.id_publication]);
        }

        // Confirmar la transacción
        await client.query('COMMIT');

        // Enviar la respuesta al cliente
        res.status(201).json({
            message: 'Publicación creada exitosamente.',
            publication: newPublication
        });
    } catch (error) {
        // Revertir la transacción en caso de error
        console.error('Error creating publication:', error);
        res.status(500).json({ error: 'Error al crear la publicación.' });
    } 
};

// Función para actualizar una publicación
//Toma dos parámetros: req (la solicitud del cliente) y res (la respuesta que se enviará al cliente).
//Envia el resultado de la consulta como respuesta JSON al cliente
const updatePublication = async (req, res) => {
    const { id } = req.params;
    const { title, date, doi, isbn, publication_country, id_institution } = req.body;
    try {
        const result = await pool.query(
            'UPDATE publication_ SET title = $1, date = $2, doi = $3, isbn = $4, publication_country = $5, id_institution = $6 WHERE id_publication = $7 RETURNING *',
            [title, date, doi, isbn, publication_country, id_institution, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Publication not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating publication:', error);
        res.status(500).json({ error: 'Error updating publication' });
    }
};

// Función para eliminar una publicacion
//Toma dos parámetros: req (la solicitud del cliente) y res (la respuesta que se enviará al cliente).
//Envia el resultado de la consulta como respuesta JSON al cliente
const deletePublication = async (req, res) => {
    const { id } = req.params;
    try {
        // Primero eliminar las referencias en author_publication
        await pool.query('DELETE FROM author_publication WHERE id_publication = $1', [id]);
        
        // Luego eliminar las referencias en collection_publication
        await pool.query('DELETE FROM collection_publication WHERE id_publication = $1', [id]);

        // Luego eliminar las referencias en species_publication
        await pool.query('DELETE FROM species_publication WHERE id_publication = $1', [id]);

        // Ahora eliminar la publicación
        const result = await pool.query('DELETE FROM publication_ WHERE id_publication = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Publication not found' });
        }
        res.json({ message: 'Publication deleted successfully' });
    } catch (error) {
        console.error('Error deleting publication:', error);
        res.status(500).json({ error: 'Error deleting publication' });
    }
};


// Función para obtener todas las colecciones
//Toma dos parámetros: req (la solicitud del cliente) y res (la respuesta que se enviará al cliente).
//Envia el resultado de la consulta como respuesta JSON al cliente
const getCollections = async (req, res) => {
    try {
        const query = `
            SELECT id_collection, name_coll, description
            FROM collection;
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching collections:', error);
        res.status(500).json({ error: 'Error fetching collections' });
    }
};


// Función para obtener publicaciones por ID de colección
//Toma dos parámetros: req (la solicitud del cliente) y res (la respuesta que se enviará al cliente).
//Envia el resultado de la consulta como respuesta JSON al cliente
const getPublicationsByCollectionId = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT publication_.id_publication, 
                publication_.title, 
                publication_.date, 
                publication_.doi, 
                publication_.isbn, 
                publication_.publication_country, 
                institution.name_ AS institution_name,
                STRING_AGG(
                    CONCAT(
                        author.first_name, ' ', 
                        COALESCE(author.middle_name || ' ', ''), 
                        author.first_surname, ' ', 
                        author.second_surname
                    ), ', '
                ) AS authors     
            FROM publication_
            JOIN institution ON publication_.id_institution = institution.id_institution
            JOIN author_publication ON publication_.id_publication = author_publication.id_publication
            JOIN author ON author_publication.id_author = author.id_author
            JOIN collection_publication ON publication_.id_publication = collection_publication.id_publication
            JOIN collection ON collection_publication.id_collection = collection.id_collection
            WHERE collection.id_collection = $1
            GROUP BY 
                publication_.id_publication, 
                publication_.title, 
                publication_.date, 
                publication_.doi, 
                publication_.isbn, 
                publication_.publication_country, 
                institution.name_;
        `;
        const values = [id];
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching publications by collection:', error);
        res.status(500).json({ error: 'Error fetching publications by collection' });
    }
};


// Función para obtener todas las especies
//Toma dos parámetros: req (la solicitud del cliente) y res (la respuesta que se enviará al cliente).
//Envia el resultado de la consulta como respuesta JSON al cliente
const getAllSpecies = async (req, res) => {
    try {
        const result = await pool.query(`SELECT 
                                        species.scientific_name, 
                                        STRING_AGG(common_names.common_name, ' - ') AS common_names
                                        FROM 
                                            species
                                        JOIN 
                                            common_names ON species.id_species = common_names.id_species
                                        GROUP BY 
                                            species.scientific_name;
                                        `);
    res.json(result.rows);
    } catch (error) {
        console.error('Error fetching species:', error);
        res.status(500).json({ error: 'Error fetching species' });
    }
};



// Función para obtener todas las instituciones
//Toma dos parámetros: req (la solicitud del cliente) y res (la respuesta que se enviará al cliente).
//Envia el resultado de la consulta como respuesta JSON al cliente
const getAllInstitutions = async (req, res) => {
    try {
        const result = await pool.query(`SELECT institution.id_institution, institution.name_ FROM institution;`);
    res.json(result.rows);
    } catch (error) {
        console.error('Error fetching institutions:', error);
        res.status(500).json({ error: 'Error fetching institutions' });
    }
};


// Función para obtener todas las instituciones
//Toma dos parámetros: req (la solicitud del cliente) y res (la respuesta que se enviará al cliente).
//Envia el resultado de la consulta como respuesta JSON al cliente
const getAllAuthors = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM author;`);
    res.json(result.rows);
    } catch (error) {
        console.error('Error fetching authors:', error);
        res.status(500).json({ error: 'Error fetching authors' });
    }
};

module.exports = {
    getAllPublications,
    getPublication,
    createPublication,
    updatePublication,
    deletePublication,
    getAllSpecies,
    getAllInstitutions,
    getAllAuthors,
    getPublicationsBySpeciesName,
    getCollections,
    getPublicationsByCollectionId
};


//  Si la consulta se ejecuta con éxito, 
//  se envía la respuesta al cliente utilizando res.json(result.rows). 
//  Se convierte el resultado (que es un array de filas) 
//  en formato JSON y se envía como respuesta a la solicitud HTTP.