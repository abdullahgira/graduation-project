class GroupService {

    constructor(Group, SchemaValidation) {
        this.Group = Group;
        this.SchemaValidation = SchemaValidation;
    }

    /**
     * 
     * @param {mongoose.Schema.Types.ObjectId} doctorId a valid id for the creator of the group
     * @param {Object} groupDTO 
     */
    async createGroup(doctorId, groupDTO) {
        await this.SchemaValidation.validateNewGroup(groupDTO);
        
        const group = await new this.Group({
            ...groupDTO,
            doctor: doctorId
        }).save();

        return group;
    }

}

module.exports = GroupService;