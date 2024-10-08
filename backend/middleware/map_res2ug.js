const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {User} = require("../utils/roles")

const resource_map = async (req,res) => {
    const r_id = req.rid
    const obj = req.user
    console.log("Object" ,obj)

    try{
        const UserGroups = await prisma.userGroup.findMany({
            where: {
                organizationId : obj.organizationId
            }
        })
        if(!UserGroups) return res.status(400).json({message: "Error in fetching all User Groups"})

        
        for (var key in UserGroups){
            
            ug_id = UserGroups[key]
            console.log(ug_id)
            const res_map = await prisma.resource_ug_map.create({
                data: {
                    resource_id: r_id,
                    ug_id: ug_id["id"],
                    organizationId: obj.organizationId,
                    read_op: false,
                    edit_op: false
                }
            })
            // if(!res_map) return res.status(400).json({message: "Error in inserting value to table"})
        }

        if(obj.role == User){
            const user = await prisma.userLogin.findUnique({
                where:{
                    id: obj.id
                }
            })
            if(!user) return res.status(404).json({message: "User not found"})

            const p_id = await prisma.resource_ug_map.findFirst({
                where : {
                    ug_id: user.usergroupid,
                    resource_id: parseInt(r_id),
                    organizationId : obj.organizationId
                }
            })

            const edit_role_user = await prisma.resource_ug_map.update({
                where: {
                    id : parseInt(p_id.id),
                    ug_id: user.usergroupid,
                    resource_id: parseInt(r_id),
                    organizationId : obj.organizationId
                },
                data:{
                    edit_op: true
                }
            })
            console.log("Edit access given to User group")
        }
        
        // return res.status(200).json({message: "Successfully inserted values"})
        return res.status(200).json({message: "Resource created successfully"})

    }
    catch(error){
        console.log(error)
        return res.status(400).json({message: "Internal Server Error"})
    }
}

module.exports =  {resource_map}
