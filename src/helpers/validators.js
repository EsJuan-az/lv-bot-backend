const Plan = require("../models/plan");
const Memory = require("../models/memory");
const User = require("../models/user");


module.exports = {
    validUniquePlanId(){
        return async function(id){
            const regexp = `^${id}`;
            const plans = await Plan.find({id: { $regex: regexp }, status: { $ne:'e' }});
            if( plans.length > 1 ){
                throw new Error();
            }
        }
    },
    validUniqueMemoryId(){
        return async function(id){
            const regexp = `^${id}`;
            const memories = await Memory.find({id: { $regex: regexp }, deleted: false});
            if( memories.length > 1 ){
                throw new Error();
            }
        }
    },
    validUniqueUserId(){
        return async function(id){
            const users = await User.find({userId: id});
            if( users.length > 1 ){
                throw new Error();
            }
        }
    }
}