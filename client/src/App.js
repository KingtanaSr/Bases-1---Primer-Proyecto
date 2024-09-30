
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select'

import './index.css'; // Asegúrate de importar tu archivo CSS

const App = () => {
    // Estados para las publicaciones, mostrar publicaciones, crear publicaciones
    const [publications, setPublications] = useState([]);
    const [showPublications, setShowPublications] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [authorsList, setAuthorsList] = useState([]);
    const [newPublication, setNewPublication] = useState({
        title: '',
        date: '',
        doi: '',
        isbn: '',
        publication_country: '',
        id_institution: '',
        authorIds: []
    });




    // Estados para publicaciones, editar publicaciones
    const [editPublicationId, setEditPublicationId] = useState(null);
    const [editPublication, setEditPublication] = useState({
        title: '',
        date: '',
        doi: '',
        isbn: '',
        publication_country: '',
        id_institution: ''
    });






    // Estados para especies, mostrar especies
    const [species, setSpecies] = useState([]);
    const [showSpecies, setShowSpecies] = useState(false);




    // Estados para instituciones, mostrar instituciones
    const [institutions, setInstitutions] = useState([]);
    const [showInstitutions, setShowInstitutions] = useState(false);




    // Estados para autores, mostrar autores
    const [authors, setAuthors] = useState([]);
    const [showAuthors, setShowAuthors] = useState(false);




    // Estados para búsqueda por especie
    const [searchSpeciesName, setSearchSpeciesName] = useState(''); // Nombre científico ingresado
    const [searchResults, setSearchResults] = useState([]); // Resultados de la búsqueda
    const [isLoadingSearch, setIsLoadingSearch] = useState(false); // Estado de carga para búsqueda
    const [errorSearch, setErrorSearch] = useState(null); // Estado de error para búsqueda




    // Estados para colecciones, mostrar colecciones, mostrar publicaciones por coleccion
    const [collections, setCollections] = useState([]);
    const [showCollections, setShowCollections] = useState(false);
    const [selectedCollectionPublications, setSelectedCollectionPublications] = useState([]);
    const [isLoadingCollections, setIsLoadingCollections] = useState(false);
    const [errorCollections, setErrorCollections] = useState(null);
    const [selectedCollectionId, setSelectedCollectionId] = useState(null);




    // Estados para el color de los botones
    const [buttonColors, setButtonColors] = useState({
        publications: false,
        createPublication: false,
        species: false,
        institutions: false,
        authors: false,
        collections: false, 
    });




    // Obtener todas las publicaciones, especies, instituciones, autores al montar el componente
    useEffect(() => {
        fetchPublications();
        fetchSpecies();
        fetchInstitutions();
        fetchAuthors();
        fetchAuthorsList();
    }, []);




    // Funciones para obtener datos de las API

    //Función para obtener lista de autores
    //Actualiza el estado de AuthorsList con los datos obtenidos
    const fetchAuthorsList = async () => {
        try {
            const response = await axios.get('http://localhost:3000/authors');
            setAuthorsList(response.data);
        } catch (error) {
            console.error('Error fetching authors:', error);
        }
    };


    const authorsOptions = authorsList.map(author => ({
        value: author.id_author,
        label: `${author.first_name} ${author.middle_name ? author.middle_name + ' ' : ''}${author.first_surname} ${author.second_surname ? author.second_surname : ''}`
    }));




    //Función para obtener las publicaciones
    //Actualiza el estado de Publications con los datos obtenidos
    const fetchPublications = async () => {
        try {
            const response = await axios.get('http://localhost:3000/publications');
            setPublications(response.data);
        } catch (error) {
            console.error('Error fetching publications:', error);
        }
    };




    //Función para obtener las especies
    //Actualiza el estado de Species con los datos obtenidos
    const fetchSpecies = async () => {
        try {
            const response = await axios.get('http://localhost:3000/species');
            setSpecies(response.data);
        } catch (error) {
            console.error('Error fetching species:', error);
        }
    };



    //Función para obtener las instituciones
    //Actualiza el estado de Institutions con los datos obtenidos
    const fetchInstitutions = async () => {
        try {
            const response = await axios.get('http://localhost:3000/institutions');
            setInstitutions(response.data);
        } catch (error) {
            console.error('Error fetching institutions:', error);
        }
    };

    const fetchAuthors = async () => {
        try {
            const response = await axios.get('http://localhost:3000/authors');
            setAuthors(response.data);
        } catch (error) {
            console.error('Error fetching authors:', error);
        }
    };




    //Función para obtener las colecciones
    //Actualiza el estado de Collections con los datos obtenidos
    const fetchCollections = async () => {
        try {
            setIsLoadingCollections(true);
            const response = await axios.get('http://localhost:3000/collections');
            setCollections(response.data);
            setErrorCollections(null);
        } catch (error) {
            console.error('Error fetching collections:', error);
            setErrorCollections('Error al obtener las colecciones.');
        } finally {
            setIsLoadingCollections(false);
        }
    };




    //Función para obtener las publicaciones por coleccion
    //Recibe el id de la coleccion
    //Actualiza el estado selectedCollectionPublications con los datos obtenidos
    const fetchPublicationsByCollectionId = async (id) => {
        try {
            setIsLoadingCollections(true);
            const response = await axios.get(`http://localhost:3000/publications/collection/${id}`);
            setSelectedCollectionPublications(response.data);
            setErrorCollections(null);
        } catch (error) {
            console.error('Error fetching publications by collection:', error);
            setErrorCollections('Error al obtener las publicaciones de la colección.');
        } finally {
            setIsLoadingCollections(false);
        }
    };




    // Función para crear una publicación
    const createPublication = async () => {
        try {
            const response = await axios.post('http://localhost:3000/publications', newPublication);
            setPublications([...publications, response.data]);
            setNewPublication({
                title: '',
                date: '',
                doi: '',
                isbn: '',
                publication_country: '',
                id_institution: ''
            });
            setShowCreateForm(false); // Ocultar el formulario después de crear la publicación
        } catch (error) {
            console.error('Error creating publication:', error);
        }
    };






    // Función para eliminar una publicación
    //Recibe el id de la publicacion a eliminar
    const deletePublication = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/publications/${id}`);
            setPublications(publications.filter(pub => pub.id_publication !== id));
        } catch (error) {
            console.error('Error deleting publication:', error);
        }
    };






    // Función para iniciar la edición de una publicación
    //Recibe la publicacion que se va a editar
    const startEditingPublication = (publication) => {
        setEditPublicationId(publication.id_publication);
        setEditPublication(publication);
    };






    // Función para cancelar la edición de una publicación
    const cancelEditingPublication = () => {
        setEditPublicationId(null);
        setEditPublication({
            title: '',
            date: '',
            doi: '',
            isbn: '',
            publication_country: '',
            id_institution: ''
        });
    };






    // Función para actualizar una publicación
    const updatePublication = async () => {
        try {
            const response = await axios.put(`http://localhost:3000/publications/${editPublicationId}`, editPublication);
            setPublications(publications.map(pub => pub.id_publication === editPublicationId ? response.data : pub));
            cancelEditingPublication(); // Ocultar el formulario después de actualizar
        } catch (error) {
            console.error('Error updating publication:', error);
        }
    };






    // Manejador de clics para cambiar color de los botones
    //Recibe el boton que fue presionado
    const handleButtonClick = (button) => {
        setButtonColors(prev => ({
            ...prev,
            [button]: !prev[button],
        }));
    };






    // Función para manejar la búsqueda de publicaciones por especie
    //Recibe cambios en el formulario de busqueda
    const handleSearch = async (e) => {
        e.preventDefault();
        const trimmedName = searchSpeciesName.trim();
        if (trimmedName === '') {
            setErrorSearch('Por favor, ingresa un nombre científico.');
            setSearchResults([]);
            return;
        }






        //Validar el formato del nombre científico 
        //Recibe el nombre cientifico formateado
        const regex = /^[A-Z][a-z]+ [a-z]+$/;
        if (!regex.test(trimmedName)) {
            setErrorSearch('El nombre científico debe estar en formato "Genus species" (ej. Homo sapiens).');
            setSearchResults([]);
            return;
        }

        setIsLoadingSearch(true);
        setErrorSearch(null);
        setSearchResults([]);

        try {
            const response = await axios.get(`http://localhost:3000/publications/species/${encodeURIComponent(trimmedName)}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error fetching publications by species:', error);
            setErrorSearch('Error al obtener las publicaciones. Verifica el nombre científico.');
        } finally {
            setIsLoadingSearch(false);
        }
    };




    // Función para manejar la visualización de colecciones
    const toggleCollections = () => {
        if (!showCollections && collections.length === 0) {
            fetchCollections();
        }
        setShowCollections(!showCollections);
        setSelectedCollectionPublications([]);
        setSelectedCollectionId(null);
    };






    // Función para manejar la selección de una colección
    //Recibe el id de la coleccion seleccionada
    const handleCollectionClick = (id) => {
        if (selectedCollectionId === id) {
            setSelectedCollectionId(null);
            setSelectedCollectionPublications([]);
        } else {
            setSelectedCollectionId(id);
            fetchPublicationsByCollectionId(id);
        }
    };




    // Todo lo que compone la app
    return (
        <div className="app-container">
            <h1 className="gradient-text2">HUMBLE BHL</h1>
            
            {/* Botones para mostrar publicaciones, crear nueva publicación, especies, instituciones, autores y colecciones, etc */}
            <div className="show-create-buttons">
                <button 
                    onClick={() => {
                        handleButtonClick('publications');
                        setShowPublications(!showPublications);
                        fetchPublications()
                    }}
                    className={buttonColors.publications ? 'button clicked' : 'button'}
                >
                    {showPublications ? 'Hide publications' : 'Show publications'}
                </button>

                <button 
                    onClick={() => {
                        handleButtonClick('createPublication');
                        setShowCreateForm(!showCreateForm);
                    }}
                    className={buttonColors.createPublication ? 'button clicked' : 'button'}
                >
                    {showCreateForm ? 'Cancel publication creation' : 'Create new publication'}
                </button>

                <button 
                    onClick={() => {
                        handleButtonClick('species');
                        setShowSpecies(!showSpecies);
                    }}
                    className={buttonColors.species ? 'button clicked' : 'button'}
                >
                    {showSpecies ? 'Hide species' : 'Show species'}
                </button>

                <button 
                    onClick={() => {
                        handleButtonClick('institutions');
                        setShowInstitutions(!showInstitutions);
                    }}
                    className={buttonColors.institutions ? 'button clicked' : 'button'}
                >
                    {showInstitutions ? 'Hide institutions' : 'Show institutions'}
                </button>

                <button 
                    onClick={() => {
                        handleButtonClick('authors');
                        setShowAuthors(!showAuthors);
                    }}
                    className={buttonColors.authors ? 'button clicked' : 'button'}
                >
                    {showAuthors ? 'Hide authors' : 'Show authors'}
                </button>

                <button 
                    onClick={toggleCollections}
                    className={buttonColors.collections ? 'button clicked' : 'button'}
                >
                    {showCollections ? 'Hide collections' : 'Show collections'}
                </button>              
            </div>

            {/* Campo de búsqueda para publicaciones por especie */}
            <div className="search-section">
                <h2 className="gradient-text">Search publications by species</h2>
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Species scientific name (ex. Homo sapiens)"
                        value={searchSpeciesName}
                        onChange={(e) => setSearchSpeciesName(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="button button-search">Search</button>
                </form>
                {isLoadingSearch && <p>Loading publications...</p>}
                {errorSearch && <p className="error">{errorSearch}</p>}

                {/* Mostrar resultados de la búsqueda */}
                {searchResults.length > 0 && (
                    <div className="search-results">
                        <h3 className="gradient-text">Search Results</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Date</th>
                                    <th>DOI</th>
                                    <th>ISBN</th>
                                    <th>Contry of publication</th>
                                    <th>Institution</th>
                                    <th>Authors</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchResults.map(publication => (
                                    <tr key={publication.id_publication}>
                                        <td>{publication.id_publication}</td>
                                        <td>{publication.title}</td>
                                        <td>{new Date(publication.date).toLocaleDateString()}</td>
                                        <td>{publication.doi}</td>
                                        <td>{publication.isbn}</td>
                                        <td>{publication.publication_country}</td>
                                        <td>{publication.institution_name}</td>
                                        <td>{publication.authors}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Manejo de búsquedas sin resultados */}
                {!isLoadingSearch && searchResults.length === 0 && searchSpeciesName.trim() !== '' && !errorSearch && (
                    <p>No publications found for the species "{searchSpeciesName}".</p>
                )}
            </div>

            {/* Mostrar publicaciones generales si el botón está activado */}
            {showPublications && (
                <div className="publications-section">
                    <h2 className="gradient-text">Publications</h2>
                    <ul>
                        {publications.map(publication => (
                            <li key={publication.id_publication} className="publication-item">
                                <div className="publication-details">
                                    <span className="publication-text">
                                        <strong>{publication.title}</strong> - {new Date(publication.date).toLocaleDateString()} - <strong> DOI: </strong> {publication.doi} - <strong> ISBN: </strong> {publication.isbn} - {publication.publication_country} - {publication.institution_name}
                                    </span>
                                </div>
                                <div className="publication-buttons">
                                    <button onClick={() => startEditingPublication(publication)} className="button button-edit">Edit</button>
                                    <button onClick={() => deletePublication(publication.id_publication)} className="button button-delete">Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Mostrar especies si el botón está activado */}
            {showSpecies && (
                <div className="species-section">
                    <h2 className="gradient-text">Species</h2>
                    <ul>
                        {species.map(specie => (
                            <li key={specie.scientific_name} className="species-item">
                                <div className="species-details">
                                    <span className="species-text">
                                        <strong> Scientific name: </strong>{specie.scientific_name} - <strong> Common names: </strong> {specie.common_names}  
                                    </span>
                                    {/* Puedes añadir más funcionalidades para cada especie aquí si lo deseas */}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Mostrar colecciones si el botón está activado */}
            {showCollections && (
                <div className="collections-section">
                    <h2 className="gradient-text">Collections</h2>
                    {/* Mostrar estado de carga */}
                    {isLoadingCollections && <p>Loading collections...</p>}
                    {/* Mostrar errores */}
                    {errorCollections && <p className="error">{errorCollections}</p>}
                    {/* Mostrar lista de colecciones */}
                    {!isLoadingCollections && !errorCollections && (
                        <ul>
                            {collections.map(collection => (
                                <li key={collection.id_collection} className="collection-item">
                                    <div className="collection-details">
                                        <span className="collection-text">
                                            <strong>{collection.name_coll}</strong> - {collection.description}
                                        </span>
                                        <button 
                                            onClick={() => handleCollectionClick(collection.id_collection)}
                                            className="button button-collection"
                                        >
                                            {selectedCollectionId === collection.id_collection ? 'Hide publications' : 'Show publications'}
                                        </button>
                                    </div>
                                    {/* Mostrar publicaciones asociadas si la colección está seleccionada */}
                                    {selectedCollectionId === collection.id_collection && (
                                        <div className="publications-by-collection">
                                            {isLoadingCollections && <p>Loading publications...</p>}
                                            {errorCollections && <p className="error">{errorCollections}</p>}
                                            {!isLoadingCollections && !errorCollections && (
                                                selectedCollectionPublications.length > 0 ? (
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th>ID</th>
                                                                <th>Title</th>
                                                                <th>Date</th>
                                                                <th>DOI</th>
                                                                <th>ISBN</th>
                                                                <th>Country of publication</th>
                                                                <th>Institution</th>
                                                                <th>Authors</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {selectedCollectionPublications.map(publication => (
                                                                <tr key={publication.id_publication}>
                                                                    <td>{publication.id_publication}</td>
                                                                    <td>{publication.title}</td>
                                                                    <td>{new Date(publication.date).toLocaleDateString()}</td>
                                                                    <td>{publication.doi}</td>
                                                                    <td>{publication.isbn}</td>
                                                                    <td>{publication.publication_country}</td>
                                                                    <td>{publication.institution_name}</td>
                                                                    <td>{publication.authors}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                ) : (
                                                    <p>There are no publications associated with this collection</p>
                                                )
                                            )}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* Mostrar instituciones si el botón está activado */}
            {showInstitutions && (
                <div className="institutions-section">
                    <h2 className="gradient-text">Institutions</h2>
                    <ul>
                        {institutions.map(institution => (
                            <li key={institution.id_institution} className="institutions-item">
                                <span className="institutions-text">
                                    <strong>ID:</strong> {institution.id_institution} - <strong>Name:</strong> {institution.name_}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Mostrar autores si el botón está activado */}
            {showAuthors && (
                <div className="authors-section">
                    <h2 className="gradient-text">Authors</h2>
                    <ul>
                        {authors.map(author => (
                            <li key={author.id_author} className="authors-item">
                                <span className="authors-text">
                                    <strong>DNI:</strong> {author.dni} - <strong>Name:</strong> {author.first_name} {author.middle_name} {author.first_surname} {author.second_surname} - <strong>Email:</strong> {author.email} - <strong>Tel:</strong> {author.phone_number}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}            

            {/* Mostrar formulario para crear nueva publicación si el botón está activado */}
            {showCreateForm && (
            <div className="form-container">
                <h2 className="gradient-text">Create a New Publication</h2>
                <input
                    type="text"
                    placeholder="Title"
                    value={newPublication.title}
                    onChange={(e) => setNewPublication({ ...newPublication, title: e.target.value })}
                />
                <input
                    type="date"
                    placeholder="Date"
                    value={newPublication.date}
                    onChange={(e) => setNewPublication({ ...newPublication, date: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="DOI"
                    value={newPublication.doi}
                    onChange={(e) => setNewPublication({ ...newPublication, doi: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="ISBN"
                    value={newPublication.isbn}
                    onChange={(e) => setNewPublication({ ...newPublication, isbn: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Publication Country"
                    value={newPublication.publication_country}
                    onChange={(e) => setNewPublication({ ...newPublication, publication_country: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Institution ID"
                    value={newPublication.id_institution}
                    onChange={(e) => setNewPublication({ ...newPublication, id_institution: e.target.value })}
                />
                
                {/* Campo de selección múltiple para autores usando React Select */}
                <div className="form-group">
                    <label htmlFor="authors">Select Authors:</label>
                    <Select
                        isMulti
                        name="authors"
                        options={authorsOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        value={authorsOptions.filter(option => newPublication.authorIds.includes(option.value))}
                        onChange={(selectedOptions) => {
                            const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
                            setNewPublication({ ...newPublication, authorIds: selectedIds });
                        }}
                        placeholder="Select authors..."
                    />
                </div>
                 

                <button onClick={createPublication} className="button button-create">Create Publication</button>
            </div>
        )}


            {/* Mostrar formulario para editar publicación si se ha seleccionado alguna publicación */}
            {editPublicationId && (
                <div className="form-container">
                    <h2 className="gradient-text">Edit Publication</h2>
                    <input
                        type="text"
                        placeholder="Title"
                        value={editPublication.title}
                        onChange={(e) => setEditPublication({ ...editPublication, title: e.target.value })}
                    />
                    <input
                        type="date"
                        placeholder="Date"
                        value={editPublication.date}
                        onChange={(e) => setEditPublication({ ...editPublication, date: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="DOI"
                        value={editPublication.doi}
                        onChange={(e) => setEditPublication({ ...editPublication, doi: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="ISBN"
                        value={editPublication.isbn}
                        onChange={(e) => setEditPublication({ ...editPublication, isbn: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Publication Country"
                        value={editPublication.publication_country}
                        onChange={(e) => setEditPublication({ ...editPublication, publication_country: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Institution ID"
                        value={editPublication.id_institution}
                        onChange={(e) => setEditPublication({ ...editPublication, id_institution: e.target.value })}
                    />
                    <div className="edit-buttons">
                        <button onClick={updatePublication} className="button button-edit">Update Publication</button>
                        <button onClick={cancelEditingPublication} className="button button-cancel">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );

};

export default App;
