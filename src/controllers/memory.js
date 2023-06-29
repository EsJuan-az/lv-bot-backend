const Memory = require('../models/memory');
const { validationResult } = require('express-validator');

const { v4: uuidv4 } = require('uuid');
const Plan = require('../models/plan');
module.exports = {
    // /memory GET
    async getAllMemories( req, res ){
        try{
            const memories = await Memory.find({ deleted: false });
            return res.json({ok: true, memories})
        }catch( err ){
            return res.status(500).json({ ok: false, msg: 'no se pudo obtener los recuerdos', err })
        }
    },
    // /memory/:id GET
    async getMemoryById( req, res ){
        //Here we verify bad requests
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ ok: false, msg: 'error en la validación', errors: errors.array() });
        }
        //Here we start
        try{
            const { id } = req.params;
            const regexp = `^${id}`;
            const memory = await Memory.findOne({ id:{ $regex: regexp }, deleted: false})
            if( !memory ){
                return res.status(400).json({ ok: false, msg: 'no existe este recuerdo' });
            }
            return res.json({ ok: true, memory });
        }catch(err){
            return res.status(500).json({ ok: false, msg: 'no se pudo obtener el recuerdo', err })
        }
    },
    // /memory/fromPlan/:id
    async memoryFromPlan( req, res ){
        try{
            const { id } = req.params;
            const regexp = `^${id}`;
            const plan = await Plan.findOne({ id:{ $regex: regexp }, status: { $ne:'e' }})
            if( !plan ){
                return res.status(400).json({ ok: false, msg: 'no existe este plan' });
            }
            const { tags, title, description  } = plan;
            const memory = new Memory({
                id: uuidv4(),
                tags,
                title,
                description
            })
            await memory.save();
            return res.json({ ok: true, memory });
        }catch(err){
            return res.status(500).json({ ok: false, msg: 'no se pudo crear el recuerdo', err })
        }
    },
    // /memory POST - body{title}
    async postMemory( req, res ){
        //Here we verify bad requests
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ ok: false, msg: 'error en la validación', errors: errors.array() });
        }
        //Here we start
        try{
            const { title } = req.body;
            const memory = new Memory({title, id: uuidv4()});
            await memory.save();
            res.json({ ok:true, memory })
        }catch(err){
            return res.status(500).json({ ok: false, msg: 'no se pudo crear el recuerdo', err })
        }
    },
    // /memory/:id PUT - body{description, stars}
    async updateMemory( req, res ){
        //Here we verify bad requests
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ ok: false, msg: 'error en la validación', errors: errors.array() });
        }
        //Here we start
        try{
            const { id } = req.params;
            const regexp = `^${id}`;
            let { description, stars } = req.body;
            //Here we verify that status isn't deleted
            const update = {};

            if( !!description ) update.description = description.trim();
            if( !!stars ) update.priority = priority;

            //Updating and sending
            const newMemory = await Memory.findOneAndUpdate({id: { $regex: regexp }, deleted: false}, update, { new: true });
            if( !newMemory ){
                return res.status(400).json({ ok: false, msg: 'no existe este recuerdo' });
            }
            return res.json({ ok: true, memory: newMemory });
        }catch(err){
            console.log(err);
            return res.status(500).json({ ok: false, msg: 'no se pudo actualizar el recuerdo', err })
        }
    },
    // /memory/:id DELETE
    async deleteMemory( req, res ){
        //Here we verify bad requests
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ ok: false, msg: 'error en la validación', errors: errors.array() });
        }
        //Here we start
        try{
            const { id } = req.params;
            const regexp = `^${id}`;
            //Updating and sending
            const newMemory = await Memory.findOneAndUpdate({id : { $regex: regexp }}, { deleted: true }, { new: true });
            if( !newMemory ){
                return res.status(400).json({ ok: false, msg: 'no existe este recuerdo' });
            }
            return res.json({ ok: true, memory: newMemory });
        }catch(err){
            return res.status(500).json({ ok: false, msg: 'no se pudo eliminar el recuerdo', err })
        }
    },
    // /memory/image/:id PUT body{ link }
    async addImg( req, res ){
        //Here we verify bad requests
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ ok: false, msg: 'error en la validación', errors: errors.array() });
        }
        //Here we start
        try{
            const { id } = req.params;
            const regexp = `^${id}`;
            let { link } = req.body;
            //Updating and sending
            const newMemory = await Memory.findOneAndUpdate({id: { $regex: regexp }, deleted: false}, { $push:{ images: link } }, { new: true });
            if( !newMemory ){
                return res.status(400).json({ ok: false, msg: 'no existe este recuerdo' });
            }
            return res.json({ ok: true, memory: newMemory });
        }catch(err){
            console.log(err);
            return res.status(500).json({ ok: false, msg: 'no se pudo actualizar el recuerdo', err })
        }
    },
    // /memory/image/:id DELETE body{link}
    async removeImg( req, res ){
        //Here we verify bad requests
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ ok: false, msg: 'error en la validación', errors: errors.array() });
        }
        //Here we start
        try{
            const { id } = req.params;
            const regexp = `^${id}`;
            let { link } = req.body;
            //Updating and sending
            const newMemory = await Memory.findOneAndUpdate({id: { $regex: regexp }, deleted: false}, { $pull:{ images: link } }, { new: true });
            if( !newMemory ){
                return res.status(400).json({ ok: false, msg: 'no existe este recuerdo' });
            }
            return res.json({ ok: true, memory: newMemory });
        }catch(err){
            console.log(err);
            return res.status(500).json({ ok: false, msg: 'no se pudo actualizar el recuerdo', err })
        }
    },
    // /memory/tag/:id PUT body{ tag }
    async addTag( req, res ){
        //Here we verify bad requests
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ ok: false, msg: 'error en la validación', errors: errors.array() });
        }
        //Here we start
        try{
            const { id } = req.params;
            const regexp = `^${id}`;
            let { tag } = req.body;
            //Updating and sending
            const newMemory = await Memory.findOneAndUpdate({id: { $regex: regexp }, deleted: false}, { $push:{ tags: tag.toLowerCase().trim() } }, { new: true });
            if( !newMemory ){
                return res.status(400).json({ ok: false, msg: 'no existe este recuerdo' });
            }
            return res.json({ ok: true, memory: newMemory });
        }catch(err){
            console.log(err);
            return res.status(500).json({ ok: false, msg: 'no se pudo actualizar el recuerdo', err })
        }
    },
    // /memory/tag/:id PUT body{ tag }
    async removeTag( req, res ){
        //Here we verify bad requests
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ ok: false, msg: 'Error en la validación', errors: errors.array() });
        }
        //Here we start
        try{
            const { id } = req.params;
            const regexp = `^${id}`;
            let { tag } = req.body;
            
            //Updating and sending
            const newMemory = await Memory.findOneAndUpdate({id: { $regex: regexp }, deleted: false}, { $pull:{ tags: tag.toLowerCase().trim() } }, { new: true });
            if( !newMemory ){
                return res.status(400).json({ ok: false, msg: 'no existe este recuerdo' });
            }
            return res.json({ ok: true, memory: newMemory });
        }catch(err){
            console.log(err);
            return res.status(500).json({ ok: false, msg: 'no se pudo actualizar el recuerdo', err })
        }
    }


}