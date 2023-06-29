const { validationResult } = require('express-validator');
const User = require('../models/user');

module.exports = {
    // /user/ GET
    async getAllUsers( req, res ){
        try{
            const users = await User.find({});
            return res.json({ok: true, users})
        }catch( err ){
            return res.status(500).json({ ok: false, msg: 'no se pudo obtener los usuarios', err })
        }
    },
   // /user/group/:groupId GET 
    async getAllGroupUsers( req, res ){
        try{

            const { groupId } = req.params;
            const users = await User.aggregate([
                // Filtrar los documentos que tengan un grupo con el chatId específico
                { $match: { 'groups.chatId': groupId } },
                // Desenrollar (unwind) el campo "groups" para procesar cada grupo por separado
                { $unwind: '$groups' },
                // Filtrar los grupos que tengan el chatId específico
                { $match: { 'groups.chatId': groupId } },
                // Ordenar los documentos por los campos "level" y "exp" de los grupos
                { $sort: { 'groups.level': -1, 'groups.exp': -1 } }
            ]);
            return res.json({ok: true, users})
        }catch( err ){
            console.log(err);
            return res.status(500).json({ ok: false, msg: 'no se pudo obtener los usuarios', err })
        }
    },
    // /user/:id GET
    async getUserById( req, res ){
        //Here we verify bad requests
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ ok: false, msg: 'error en la validación', errors: errors.array() });
        }
        //Here we start
        try{
            const { id } = req.params;
            console.log(id);
            const user = await User.findOne({ userId: id })
            console.log(user);
            if( !user ){
                return res.status(400).json({ ok: false, msg: 'no existe este usuario' });
            }
            return res.json({ ok: true, user });
        }catch(err){
            console.log(err);
            return res.status(500).json({ ok: false, msg: 'no se pudo obtener el usuario', err })
        }
    },
    // /user/ POST  body{userId, name}
    async postUser( req, res ){
        //Here we verify bad requests
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ ok: false, msg: 'error en la validación', errors: errors.array() });
        }
        //Here we start
        try{
            const { userId, name } = req.body;
            const user = new User({userId, name});
            await user.save();
            res.json({ ok:true, user })
        }catch(err){
            return res.status(500).json({ ok: false, msg: 'no se pudo crear el usuario', err })
        }
    },
    // /user/:id PUT - body{ birthday}
    async updateUserBirthday( req, res ){
        //Here we verify bad requests
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ ok: false, msg: 'error en la validación', errors: errors.array() });
        }
        //Here we start
        try{
            const { id } = req.params;
            let { birthday } = req.body;
            //Here we verify that status isn't deleted
            const update = {};

            if( !!birthday ) update.birthday = birthday;

            //Updating and sending
            const newUser = await User.findOneAndUpdate({userId: id}, update, { new: true });
            if( !newUser ){
                return res.status(400).json({ ok: false, msg: 'no existe este usuario' });
            }
            return res.json({ ok: true, user: newUser });
        }catch(err){
            console.log(err);
            return res.status(500).json({ ok: false, msg: 'no se pudo actualizar el usuario', err })
        }
    },
    //  /user/group/:id PUT - body{increase, groupId, name}
    async increaseUserExp( req, res ){
        //Here we verify bad requests
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ ok: false, msg: 'error en la validación', errors: errors.array() });
        }
        //Here we start
        try{
            const { id } = req.params;
            let { increase, groupId,name } = req.body;
            //Here we verify that status isn't deleted

            //Updating and sending
            let newUser = await User.findOneAndUpdate({
                userId: id,
                'groups.chatId': groupId
            }, {
                name,
                $cond: [
                    {
                        $gte: ['$groups.$.exp', { $multiply: ['$groups.$.level', 10] }]
                    },
                    {
                        'groups.$.exp': increase,
                        $inc: {
                            'groups.$.level': 1
                        }
                    },
                    {
                        $inc:{
                            'groups.$.exp': increase,
                        },
                    }
                ],
                $inc: {
                    'groups.$.totalMsg': 1
                }
            }, { new: true });
            if( !newUser ){
                newUser = await User.findOneAndUpdate({ userId: id }, { $push: { groups: { chatId: groupId } } }, { new: true } );   
            }
            if( !newUser ){
                return res.status(400).json({ ok: false, msg: 'no existe este usuario' });
            }
            return res.json({ ok: true, user: newUser });
        }catch(err){
            console.log(err);
            return res.status(500).json({ ok: false, msg: 'no se pudo actualizar el usuario', err })
        }
    },

}