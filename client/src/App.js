
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select'

import './index.css'; // Importar archivo CSS

const App = () => {
    // Estados para las publicaciones, mostrar publicaciones, crear publicaciones
    const [publications, set_Publications] = useState([]);
    const [show_Publications, set_Show_Publications] = useState(false);
    const [show_Create_Form, set_Show_Create_Form] = useState(false);
    const [authors_List, set_Authors_List] = useState([]);
    const [new_Publication, set_New_Publication] = useState({
        title: '',
        date: '',
        doi: '',
        isbn: '',
        publication_country: '',
        id_institution: '',
        authorIds: []
    });




    // Estados para publicaciones, editar publicaciones
    const [edit_Publication_Id, set_Edit_Publication_Id] = useState(null);
    const [edit_Publication, set_Edit_Publication] = useState({
        title: '',
        date: '',
        doi: '',
        isbn: '',
        publication_country: '',
        id_institution: ''
    });






    // Estados para especies, mostrar especies
    const [species, set_Species] = useState([]);
    const [show_Species, set_Show_Species] = useState(false);




    // Estados para instituciones, mostrar instituciones
    const [institutions, set_Institutions] = useState([]);
    const [show_Institutions, set_Show_Institutions] = useState(false);




    // Estados para autores, mostrar autores
    const [authors, set_Authors] = useState([]);
    const [show_Authors, set_Show_Authors] = useState(false);




    // Estados para búsqueda por especie
    const [search_Species_Name, set_Search_Species_Name] = useState(''); // Nombre científico ingresado
    const [search_Results, set_Search_Results] = useState([]); // Resultados de la búsqueda
    const [is_Loading_Search, set_Is_Loading_Search] = useState(false); // Estado de carga para búsqueda
    const [error_Search, set_Error_Search] = useState(null); // Estado de error para búsqueda




    // Estados para colecciones, mostrar colecciones, mostrar publicaciones por coleccion
    const [collections, set_Collections] = useState([]);
    const [show_Collections, set_Show_Collections] = useState(false);
    const [selected_Collection_Publications, set_Selected_Collection_Publications] = useState([]);
    const [is_Loading_Collections, set_Is_Loading_Collections] = useState(false);
    const [error_Collections, set_Error_Collections] = useState(null);
    const [selected_Collection_Id, set_Selected_Collection_Id] = useState(null);




    // Estados para el color de los botones
    const [buttonColors, set_Button_Colors] = useState({
        publications: false,
        create_Publication: false,
        species: false,
        institutions: false,
        authors: false,
        collections: false, 
    });




    // Obtener todas las publicaciones, especies, instituciones, autores al montar el componente
    useEffect(() => {
        fetch_Publications();
        fetch_Species();
        fetch_Institutions();
        fetch_Authors();
        fetch_AuthorsList();
    }, []);




    // Las funciones fetch están diseñadas para realizar una solicitud HTTP 
    //al servidor backend para recuperar datos almacenados en la base de datos.

    //Función para obtener lista de autores
    //Actualiza el estado de AuthorsList con los datos obtenidos

    //Se utiliza la librería axios para realizar una solicitud HTTP al endpoint

    // Se almacena el objeto de respuesta completo recibido del servidor en la constante response

    //response.data contiene los datos enviados por el servidor.

    const fetch_AuthorsList = async () => {
        try {
            const response = await axios.get('http://localhost:3000/authors'); 
            set_Authors_List(response.data);
        } catch (error) {
            console.error('Error fetching authors:', error);
        }
    };


    const authors_Options = authors_List.map(author => ({
        value: author.id_author,
        label: `${author.first_name} ${author.middle_name ? author.middle_name + ' ' : ''}${author.first_surname} ${author.second_surname ? author.second_surname : ''}`
    }));




    //Función para obtener las publicaciones
    //Actualiza el estado de Publications con los datos obtenidos
    const fetch_Publications = async () => {
        try {
            const response = await axios.get('http://localhost:3000/publications');
            set_Publications(response.data);
        } catch (error) {
            console.error('Error fetching publications:', error);
        }
    };




    //Función para obtener las especies
    //Actualiza el estado de Species con los datos obtenidos
    const fetch_Species = async () => {
        try {
            const response = await axios.get('http://localhost:3000/species');
            set_Species(response.data);
        } catch (error) {
            console.error('Error fetching species:', error);
        }
    };



    //Función para obtener las instituciones
    //Actualiza el estado de Institutions con los datos obtenidos
    const fetch_Institutions = async () => {
        try {
            const response = await axios.get('http://localhost:3000/institutions');
            set_Institutions(response.data);
        } catch (error) {
            console.error('Error fetching institutions:', error);
        }
    };


    //Función para obtener los autores
    //Actualiza el estado de Authors con los datos obtenidos

    const fetch_Authors = async () => {
        try {
            const response = await axios.get('http://localhost:3000/authors');
            set_Authors(response.data);
        } catch (error) {
            console.error('Error fetching authors:', error);
        }
    };




    //Función para obtener las colecciones
    //Actualiza el estado de Collections con los datos obtenidos
    const fetch_Collections = async () => {
        try {
            set_Is_Loading_Collections(true);
            const response = await axios.get('http://localhost:3000/collections');
            set_Collections(response.data);
            set_Error_Collections(null);
        } catch (error) {
            console.error('Error fetching collections:', error);
            set_Error_Collections('Error al obtener las colecciones.');
        } finally {
            set_Is_Loading_Collections(false);
        }
    };




    //Función para obtener las publicaciones por coleccion
    //Recibe el id de la coleccion
    //Actualiza el estado selectedCollectionPublications con los datos obtenidos
    const fetch_Publications_By_Collection_Id = async (id) => {
        try {
            set_Is_Loading_Collections(true);
            const response = await axios.get(`http://localhost:3000/publications/collection/${id}`);
            set_Selected_Collection_Publications(response.data);
            set_Error_Collections(null);
        } catch (error) {
            console.error('Error fetching publications by collection:', error);
            set_Error_Collections('Error al obtener las publicaciones de la colección.');
        } finally {
            set_Is_Loading_Collections(false);
        }
    };




    // Función para crear una publicación
    const create_Publication = async () => {
        try {
            const response = await axios.post('http://localhost:3000/publications', new_Publication);
            set_Publications([...publications, response.data]);
            set_New_Publication({
                title: '',
                date: '',
                doi: '',
                isbn: '',
                publication_country: '',
                id_institution: ''
            });
            set_Show_Create_Form(false); // Ocultar el formulario después de crear la publicación
        } catch (error) {
            console.error('Error creating publication:', error);
        }
    };






    // Función para eliminar una publicación
    //Recibe el id de la publicacion a eliminar
    const delete_Publication = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/publications/${id}`);
            set_Publications(publications.filter(pub => pub.id_publication !== id));
        } catch (error) {
            console.error('Error deleting publication:', error);
        }
    };






    // Función para iniciar la edición de una publicación
    //Recibe la publicacion que se va a editar
    const start_Editing_Publication = (publication) => {
        set_Edit_Publication_Id(publication.id_publication);
        set_Edit_Publication(publication);
    };






    // Función para cancelar la edición de una publicación
    const cancel_Editing_Publication = () => {
        set_Edit_Publication_Id(null);
        set_Edit_Publication({
            title: '',
            date: '',
            doi: '',
            isbn: '',
            publication_country: '',
            id_institution: ''
        });
    };






    // Función para actualizar una publicación
    const update_Publication = async () => {
        try {
            const response = await axios.put(`http://localhost:3000/publications/${edit_Publication_Id}`, edit_Publication);
            set_Publications(publications.map(pub => pub.id_publication === edit_Publication_Id ? response.data : pub));
            cancel_Editing_Publication(); // Ocultar el formulario después de actualizar
        } catch (error) {
            console.error('Error updating publication:', error);
        }
    };






    // Manejador de clics para cambiar color de los botones
    //Recibe el boton que fue presionado
    const handle_Button_Click = (button) => {
        set_Button_Colors(prev => ({
            ...prev,
            [button]: !prev[button],
        }));
    };






    // Función para manejar la búsqueda de publicaciones por especie
    //Recibe cambios en el formulario de busqueda
    const handle_Search = async (e) => {
        e.preventDefault();
        const trimmedName = search_Species_Name.trim();
        if (trimmedName === '') {
            set_Error_Search('Por favor, ingresa un nombre científico.');
            set_Search_Results([]);
            return;
        }






        //Validar el formato del nombre científico 
        //Recibe el nombre cientifico formateado
        const regex = /^[A-Z][a-z]+ [a-z]+$/;
        if (!regex.test(trimmedName)) {
            set_Error_Search('El nombre científico debe estar en formato "Genus species" (ej. Homo sapiens).');
            set_Search_Results([]);
            return;
        }

        set_Is_Loading_Search(true);
        set_Error_Search(null);
        set_Search_Results([]);

        try {
            const response = await axios.get(`http://localhost:3000/publications/species/${encodeURIComponent(trimmedName)}`);
            set_Search_Results(response.data);
        } catch (error) {
            console.error('Error fetching publications by species:', error);
            set_Error_Search('Error al obtener las publicaciones. Verifica el nombre científico.');
        } finally {
            set_Is_Loading_Search(false);
        }
    };




    // Función para manejar la visualización de colecciones
    const toggle_Collections = () => {
        if (!show_Collections && collections.length === 0) {
            fetch_Collections();
        }
        set_Show_Collections(!show_Collections);
        set_Selected_Collection_Publications([]);
        set_Selected_Collection_Id(null);
    };






    // Función para manejar la selección de una colección
    //Recibe el id de la coleccion seleccionada
    const handle_Collection_Click = (id) => {
        if (selected_Collection_Id === id) {
            set_Selected_Collection_Id(null);
            set_Selected_Collection_Publications([]);
        } else {
            set_Selected_Collection_Id(id);
            fetch_Publications_By_Collection_Id(id);
        }
    };




    // Todo lo que compone la app
    return (
        <div className="app-container">
            <h1 className="normal-text">👽 HUMBLE BHL 🤓</h1>
            
            {/* Botones para mostrar publicaciones, crear nueva publicación, especies, instituciones, autores y colecciones, etc */}
            <div className="show-create-buttons">
                <button 
                    onClick={() => {
                        handle_Button_Click('publications');
                        set_Show_Publications(!show_Publications);
                        fetch_Publications()
                    }}
                    className={buttonColors.publications ? 'button clicked' : 'button'}
                >
                    {show_Publications ? 'Hide publications' : 'Show publications'}
                </button>

                <button 
                    onClick={() => {
                        handle_Button_Click('createPublication');
                        set_Show_Create_Form(!show_Create_Form);
                    }}
                    className={buttonColors.create_Publication ? 'button clicked' : 'button'}
                >
                    {show_Create_Form ? 'Cancel publication creation' : 'Create new publication'}
                </button>

                <button 
                    onClick={() => {
                        handle_Button_Click('species');
                        set_Show_Species(!show_Species);
                    }}
                    className={buttonColors.species ? 'button clicked' : 'button'}
                >
                    {show_Species ? 'Hide species' : 'Show species'}
                </button>

                <button 
                    onClick={() => {
                        handle_Button_Click('institutions');
                        set_Show_Institutions(!show_Institutions);
                    }}
                    className={buttonColors.institutions ? 'button clicked' : 'button'}
                >
                    {show_Institutions ? 'Hide institutions' : 'Show institutions'}
                </button>

                <button 
                    onClick={() => {
                        handle_Button_Click('authors');
                        set_Show_Authors(!show_Authors);
                    }}
                    className={buttonColors.authors ? 'button clicked' : 'button'}
                >
                    {show_Authors ? 'Hide authors' : 'Show authors'}
                </button>

                <button 
                    onClick={toggle_Collections}
                    className={buttonColors.collections ? 'button clicked' : 'button'}
                >
                    {show_Collections ? 'Hide collections' : 'Show collections'}
                </button>              
            </div>

            {/* Campo de búsqueda para publicaciones por especie */}
            <div className="search-section">
                <h2 className="gradient-text">Search publications by species </h2>
                <form onSubmit={handle_Search} className="search-form">
                    <input
                        type="text"
                        placeholder="Species scientific name (ex. Homo sapiens)"
                        value={search_Species_Name}
                        onChange={(e) => set_Search_Species_Name(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="button button-search">Search</button>
                </form>
                {is_Loading_Search && <p>Loading publications...</p>}
                {error_Search && <p className="error">{error_Search}</p>}

                {/* Mostrar resultados de la búsqueda */}
                {search_Results.length > 0 && (
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
                                {search_Results.map(publication => (
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
                {!is_Loading_Search && search_Results.length === 0 && search_Species_Name.trim() !== '' && !error_Search && (
                    <p>No publications found for the species "{search_Species_Name}".</p>
                )}
            </div>

            {/* Mostrar publicaciones generales si el botón está activado */}
            {show_Publications && (
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
                                    <button onClick={() => start_Editing_Publication(publication)} className="button button-edit">Edit</button>
                                    <button onClick={() => delete_Publication(publication.id_publication)} className="button button-delete">Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Mostrar especies si el botón está activado */}
            {show_Species && (
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
            {show_Collections && (
                <div className="collections-section">
                    <h2 className="gradient-text">Collections</h2>
                    {/* Mostrar estado de carga */}
                    {is_Loading_Collections && <p>Loading collections...</p>}
                    {/* Mostrar errores */}
                    {error_Collections && <p className="error">{error_Collections}</p>}
                    {/* Mostrar lista de colecciones */}
                    {!is_Loading_Collections && !error_Collections && (
                        <ul>
                            {collections.map(collection => (
                                <li key={collection.id_collection} className="collection-item">
                                    <div className="collection-details">
                                        <span className="collection-text">
                                            <strong>{collection.name_coll}</strong> - {collection.description}
                                        </span>
                                        <button 
                                            onClick={() => handle_Collection_Click(collection.id_collection)}
                                            className="button button-collection"
                                        >
                                            {selected_Collection_Id === collection.id_collection ? 'Hide publications' : 'Show publications'}
                                        </button>
                                    </div>
                                    {/* Mostrar publicaciones asociadas si la colección está seleccionada */}
                                    {selected_Collection_Id === collection.id_collection && (
                                        <div className="publications-by-collection">
                                            {is_Loading_Collections && <p>Loading publications...</p>}
                                            {error_Collections && <p className="error">{error_Collections}</p>}
                                            {!is_Loading_Collections && !error_Collections && (
                                                selected_Collection_Publications.length > 0 ? (
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
                                                            {selected_Collection_Publications.map(publication => (
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
            {show_Institutions && (
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
            {show_Authors && (
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
            {show_Create_Form && (
            <div className="form-container">
                <h2 className="gradient-text">Create a New Publication</h2>
                <input
                    type="text"
                    placeholder="Title"
                    value={new_Publication.title}
                    onChange={(e) => set_New_Publication({ ...new_Publication, title: e.target.value })}
                />
                <input
                    type="date"
                    placeholder="Date"
                    value={new_Publication.date}
                    onChange={(e) => set_New_Publication({ ...new_Publication, date: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="DOI"
                    value={new_Publication.doi}
                    onChange={(e) => set_New_Publication({ ...new_Publication, doi: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="ISBN"
                    value={new_Publication.isbn}
                    onChange={(e) => set_New_Publication({ ...new_Publication, isbn: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Publication Country"
                    value={new_Publication.publication_country}
                    onChange={(e) => set_New_Publication({ ...new_Publication, publication_country: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Institution ID"
                    value={new_Publication.id_institution}
                    onChange={(e) => set_New_Publication({ ...new_Publication, id_institution: e.target.value })}
                />
                
                {/* Campo de selección múltiple para autores usando React Select */}
                <div className="form-group">
                    <label htmlFor="authors">Select Authors:</label>
                    <Select
                        isMulti
                        name="authors"
                        options={authors_Options}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        value={authors_Options.filter(option => new_Publication.authorIds.includes(option.value))}
                        onChange={(selectedOptions) => {
                            const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
                            set_New_Publication({ ...new_Publication, authorIds: selectedIds });
                        }}
                        placeholder="Select authors..."
                    />
                </div>
                 

                <button onClick={create_Publication} className="button button-create">Create Publication</button>
            </div>
        )}


            {/* Mostrar formulario para editar publicación si se ha seleccionado alguna publicación */}
            {edit_Publication_Id && (
                <div className="form-container">
                    <h2 className="gradient-text">Edit Publication</h2>
                    <input
                        type="text"
                        placeholder="Title"
                        value={edit_Publication.title}
                        onChange={(e) => set_Edit_Publication({ ...edit_Publication, title: e.target.value })}
                    />
                    <input
                        type="date"
                        placeholder="Date"
                        value={edit_Publication.date}
                        onChange={(e) => set_Edit_Publication({ ...edit_Publication, date: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="DOI"
                        value={edit_Publication.doi}
                        onChange={(e) => set_Edit_Publication({ ...edit_Publication, doi: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="ISBN"
                        value={edit_Publication.isbn}
                        onChange={(e) => set_Edit_Publication({ ...edit_Publication, isbn: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Publication Country"
                        value={edit_Publication.publication_country}
                        onChange={(e) => set_Edit_Publication({ ...edit_Publication, publication_country: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Institution ID"
                        value={edit_Publication.id_institution}
                        onChange={(e) => set_Edit_Publication({ ...edit_Publication, id_institution: e.target.value })}
                    />
                    <div className="edit-buttons">
                        <button onClick={update_Publication} className="button button-edit">Update Publication</button>
                        <button onClick={cancel_Editing_Publication} className="button button-cancel">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );

};

export default App;
