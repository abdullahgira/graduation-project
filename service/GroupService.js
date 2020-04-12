class GroupService {

    constructor(Group, SchemaValidation, GroupValidation, StudentValidation) {
        this.Group = Group;
        this.SchemaValidation = SchemaValidation;
        this.GroupValidation = GroupValidation;
        this.StudentValidation = StudentValidation;
    }

    /**
     * Get all groups created by that doctor
     * 
     * @param {mongoose.Schema.Types.ObjectId} doctorId 
     */
    async getGroups(doctorId) {
        const groups = await this.Group
            .find({ doctor: doctorId })
            .populate('students');
        return groups;
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

    /**
     * 
     * @param {mongoose.Schema.Types.ObjectId} groupId a valid group id
     * @param {mongoose.Schema.Types.ObjectId} studentId a valid id for the creator of the group
     */
    async addStudent(groupId, studentDTO) {
        await this.SchemaValidation.validateAddStudentToGroup(studentDTO);
        const student = await this.StudentValidation.validateStudentExists(studentDTO.studentId);
        const group = await this.GroupValidation.validateGroupExistsAndReturn(groupId);
        await this.GroupValidation.vlaidateStudentIsNotInGroup(groupId, student.id);

        group.students.push(student.id);
        await group.save();

        return group;
    }
}

module.exports = GroupService;