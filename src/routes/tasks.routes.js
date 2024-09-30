const { Router } = require('express');
const pool = require('../db');

const {     
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
} = require('../controllers/tasks.controllers')

// Rutas para responder a diferentes solicitudes HTTP en diferentes endpoints (URLs).

const router = Router();

router.get('/publications/species/:speciesName', getPublicationsBySpeciesName);
router.get('/publications', getAllPublications);
router.get('/publications/:id', getPublication);
router.post('/publications', createPublication);
router.put('/publications/:id', updatePublication);
router.delete('/publications/:id', deletePublication);

router.get('/collections', getCollections);
router.get('/publications/collection/:id', getPublicationsByCollectionId);

router.get('/species', getAllSpecies);

router.get('/institutions', getAllInstitutions);

router.get('/authors', getAllAuthors);

module.exports = router;