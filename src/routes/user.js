const { Router } = require('express');
const { body, param } = require('express-validator');
const { getAllUsers, getUserById, updateUserBirthday, postUser, increaseUserExp, getAllGroupUsers } = require('../controllers/user');
const { validUniqueUserId } = require('../helpers/validators');

const router = Router();

router.get('/', getAllUsers);
router.get('/group/:groupId', [
    param('groupId')
        .notEmpty()
        .withMessage('id del grupo es obligatorio')
], getAllGroupUsers)

router.get('/:id', [
    param('id')
        .custom( validUniqueUserId() )
        .withMessage('id poco específico'),
] ,getUserById);

router.post('/', [
    body('userId')
        .notEmpty()
        .withMessage('El id del usuario no debe de estar vacío'),
    body('name')
        .notEmpty()
        .withMessage('El nombre del usuario no debe de estar vacío')
], postUser)

router.put('/birthday/:id', [
    param('id')
        .custom( validUniqueUserId() )
        .withMessage('id poco específico'),
    body('birthday')
        .notEmpty()
        .withMessage('El cumpleaños es obligatorio')
        .isDate()
        .withMessage('El cumpleaños debe de ser una fecha')
], updateUserBirthday)

router.put('/group/:id', [
    param('id')
        .custom( validUniqueUserId() )
        .withMessage('id poco específico'),
    body('groupId')
        .notEmpty()
        .withMessage('El id del grupo es obligatorio'),
    body('increase')
        .notEmpty()
        .withMessage('El incremento no debe estar vacío')
        .isFloat()
        .withMessage('El incremento debe ser un número'),
    body('name')
        .notEmpty()
        .withMessage('El nombre no debe estar vacío')
], increaseUserExp)

module.exports = router