const User = require("../models/user");

module.exports = {
    async baseGet(req, res){
        res.json({ ok: true })

    },
    async planUsers( req, res ){
        const { attemp } = req.params;
        let keywords = {
            'vanem': '573234876013@c.us',
            'juanem': '573233725613@c.us'
        };
        try{
            if( !!keywords[attemp] ) return res.json({
                ok: true,
                user: await User.findOne({ userId: keywords[attemp] }) 
            });
            return res.status(400).json({ ok:false })
        }catch(err){
            return res.status(500).json({ ok:false, err })
        }
        
    }
}