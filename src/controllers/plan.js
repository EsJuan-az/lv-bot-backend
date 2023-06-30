const { validationResult } = require('express-validator');

const { v4: uuidv4 } = require('uuid');
const Plan = require('../models/plan');

module.exports = {
    // /plan GET
    async getAllPlans( req, res ){
        try{
            const plans = await Plan.find({ status: { $ne:'e' } });
            return res.json({ok: true, plans})
        }catch( err ){
            return res.status(500).json({ ok: false, msg: 'no se pudo obtener los planes', err })
        }
    },
    // /plan/:id GET
    async getPlanById( req, res ){
        //Here we verify bad requests
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ ok: false, msg: 'error en la validación', errors: errors.array() });
        }
        //Here we start
        try{
            const { id } = req.params;
            const regexp = `^${id}`;
            const plan = await Plan.findOne({ id:{ $regex: regexp }, status: { $ne:'e' }})
            if( !plan ){
                return res.status(400).json({ ok: false, msg: 'no existe este plan' });
            }
            return res.json({ ok: true, plan });
        }catch(err){
            return res.status(500).json({ ok: false, msg: 'no se pudo obtener el plan', err })
        }
    },
    // /plan POST - body{title}
    async postPlan( req, res ){
        //Here we verify bad requests
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ ok: false, msg: 'error en la validación', errors: errors.array() });
        }
        //Here we start
        try{
            const { title } = req.body;
            const plan = new Plan({title, id: uuidv4(), description: ''});
            await plan.save();
            res.json({ ok:true, plan })
        }catch(err){
            return res.status(500).json({ ok: false, msg: 'no se pudo crear el plan', err })
        }
    },
    // /plan/:id PUT - body{description, priority, status}
    async updatePlan( req, res ){
        //Here we verify bad requests
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ ok: false, msg: 'error en la validación', errors: errors.array() });
        }
        //Here we start
        try{
            const { id } = req.params;
            const regexp = `^${id}`;
            let { description, priority, status, title } = req.body;
            //Here we verify that status isn't deleted
            const update = {
                description,
                priority,
                status,
                title
            };


            //Updating and sending
            const newPlan = await Plan.findOneAndUpdate({id: { $regex: regexp }, status: { $ne:'e' }}, update, { new: true });
            if( !newPlan ){
                return res.status(400).json({ ok: false, msg: 'no existe este plan' });
            }
            return res.json({ ok: true, plan: newPlan });
        }catch(err){
            console.log(err);
            return res.status(500).json({ ok: false, msg: 'no se pudo actualizar el plan', err })
        }
    },
    // /plan/:id DELETE
    async deletePlan( req, res ){
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
            const newPlan = await Plan.findOneAndUpdate({id : { $regex: regexp }}, { status:'e' }, { new: true });
            if( !newPlan ){
                return res.status(400).json({ ok: false, msg: 'no existe este plan' });
            }
            return res.json({ ok: true, plan: newPlan });
        }catch(err){
            return res.status(500).json({ ok: false, msg: 'no se pudo eliminar el plan', err })
        }
    },
    // /plan/image/:id PUT body{ link }
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
            const newPlan = await Plan.findOneAndUpdate({id: { $regex: regexp }, status: { $ne:'e' }}, { $push:{ images: link } }, { new: true });
            if( !newPlan ){
                return res.status(400).json({ ok: false, msg: 'no existe este plan' });
            }
            return res.json({ ok: true, plan: newPlan });
        }catch(err){
            console.log(err);
            return res.status(500).json({ ok: false, msg: 'no se pudo actualizar el plan', err })
        }
    },
    // /plan/image/:id DELETE body{link}
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
            const newPlan = await Plan.findOneAndUpdate({id: { $regex: regexp }, status: { $ne:'e' }}, { $pull:{ images: link } }, { new: true }); 
            if( !newPlan ){
                return res.status(400).json({ ok: false, msg: 'no existe este plan' });
            }
            return res.json({ ok: true, plan: newPlan });
        }catch(err){
            console.log(err);
            return res.status(500).json({ ok: false, msg: 'no se pudo actualizar el plan', err })
        }
    },
    // /plan/tag/:id PUT body{ tag }
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
            const newPlan = await Plan.findOneAndUpdate({id: { $regex: regexp }, status: { $ne:'e' }}, { $push:{ tags: tag.toLowerCase().trim() } }, { new: true });
            if( !newPlan ){
                return res.status(400).json({ ok: false, msg: 'no existe este plan' });
            }
            return res.json({ ok: true, plan: newPlan });
        }catch(err){
            console.log(err);
            return res.status(500).json({ ok: false, msg: 'no se pudo actualizar el plan', err })
        }
    },
    // /plan/tag/:id PUT body{ tag }
    async removeTag( req, res ){
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
            const newPlan = await Plan.findOneAndUpdate({id: { $regex: regexp }, status: { $ne:'e' }}, { $pull:{ tags: tag.toLowerCase().trim() } }, { new: true });
            if( !newPlan ){
                return res.status(400).json({ ok: false, msg: 'no existe este plan' });
            }
            return res.json({ ok: true, plan: newPlan });
        }catch(err){
            console.log(err);
            return res.status(500).json({ ok: false, msg: 'no se pudo actualizar el plan', err })
        }
    }


}