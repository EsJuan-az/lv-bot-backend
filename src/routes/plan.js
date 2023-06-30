const { Router } = require('express');
const { getAllPlans, getPlanById, postPlan, updatePlan, deletePlan, addImg, removeImg, addTag, removeTag } = require('../controllers/plan');
const router = Router()
const { body, param } = require('express-validator');
const { validUniquePlanId } = require('../helpers/validators');
const Plan = require('../models/plan');

router.get('/', getAllPlans);

router.get('/:id', [
    param('id')
        .custom( validUniquePlanId() )
        .withMessage('id poco específico'),
], getPlanById);

router.post('/', [
    body('title')
        .notEmpty()
        .withMessage('el titulo es obligatorio'),
], postPlan);

router.put('/:id', [
    param('id')
        .custom( validUniquePlanId( Plan ) )
        .withMessage('id poco específico'),
    body('priority')
        .optional()
        .isInt({ min: 1, max: 4 })
        .withMessage('prioridad inválida'),
    body('status')
        .optional()
        .isIn(['r', 'pn', 'pl', 'h'])
        .withMessage('el valor del status no está permitido')
        .not()
        .equals('e')
        .withMessage('status inválido'),
    body('title')
        .optional()
], updatePlan);

router.put('/image/:id', [
    param('id')
        .custom( validUniquePlanId() )
        .withMessage('id poco específico'),
    body('link')
        .notEmpty()
        .withMessage('la imagen es obligatoria')
        .isURL()
        .withMessage('debe de ser una url')
], addImg);

router.put('/tag/:id', [
    param('id')
        .custom( validUniquePlanId() )
        .withMessage('id poco específico'),
    body('tag')
        .notEmpty()
        .withMessage('la etiqueta es obligatoria')
], addTag);

router.delete('/image/:id', [
    param('id')
        .custom( validUniquePlanId() )
        .withMessage('id poco específico'),
    body('link')
        .notEmpty()
        .withMessage('la imagen es obligatoria')
        .isURL()
        .withMessage('debe de ser una url')
], removeImg);

router.delete('/tag/:id', [
    param('id')
        .custom( validUniquePlanId() )
        .withMessage('id poco específico'),
    body('tag')
        .notEmpty()
        .withMessage('la etiqueta es obligatoria')
], removeTag)


router.delete('/:id', [
    param('id')
        .custom( validUniquePlanId() )
        .withMessage('id poco específico'),
], deletePlan);

module.exports = router;