const { Router } = require('express');
const { body, param } = require('express-validator');
const { getAllMemories, getMemoryById, postMemory, updateMemory, addImg, addTag, removeImg, removeTag, deleteMemory } = require('../controllers/memory');
const { validUniqueMemoryId, validUniquePlanId } = require('../helpers/validators');
const Memory = require('../models/memory');
const Plan = require('../models/plan');

const router = Router();

router.get('/', getAllMemories);
router.get('/:id', [
    param('id')
        .custom( validUniqueMemoryId() )
        .withMessage('id poco específico'),
], getMemoryById)

router.post('/', [
    body('title')
        .notEmpty()
        .withMessage('el titulo es obligatorio'),
    body('authorId')
        .notEmpty()
        .withMessage('el autor es obligatorio'),
], postMemory);
router.post('/plan/:id',[
    param('id')
        .custom( validUniquePlanId(  ) )
        .withMessage('id poco específico'),
])
router.put('/:id', [
    param('id')
        .custom( validUniqueMemoryId() )
        .withMessage('id poco específico'),
    body('stars')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('prioridad inválida'),
    body('title')
        .optional()
], updateMemory);

router.put('/image/:id', [
    param('id')
        .custom( validUniqueMemoryId() )
        .withMessage('id poco específico'),
    body('link')
        .notEmpty()
        .withMessage('la imagen es obligatoria')
        .isURL()
        .withMessage('debe de ser una url')
], addImg);

router.put('/tag/:id', [
    param('id')
        .custom( validUniqueMemoryId() )
        .withMessage('id poco específico'),
    body('tag')
        .notEmpty()
        .withMessage('la etiqueta es obligatoria')
], addTag);

router.delete('/image/:id', [
    param('id')
        .custom( validUniqueMemoryId() )
        .withMessage('id poco específico'),
    body('link')
        .notEmpty()
        .withMessage('la imagen es obligatoria')
        .isURL()
        .withMessage('debe de ser una url')
], removeImg);

router.delete('/tag/:id', [
    param('id')
        .custom( validUniqueMemoryId() )
        .withMessage('id poco específico'),
    body('tag')
        .notEmpty()
        .withMessage('la etiqueta es obligatoria')
], removeTag)


router.delete('/:id', [
    param('id')
        .custom( validUniqueMemoryId() )
        .withMessage('id poco específico'),
], deleteMemory);


module.exports = router