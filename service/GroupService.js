class GroupService {

    constructor(Group, StudentGroup, SchemaValidation, GroupValidation, StudentValidation) {
        this.Group = Group;
        this.StudentGroup = StudentGroup;
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
            .populate({ path: 'students', populate: { path: 'student' }});
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
     * @param {studentDTO} studentDTO that contains a valid id for the student
     */
    async addStudent(groupId, studentDTO) {
        await this.SchemaValidation.validateAddStudentToGroup(studentDTO);
        const student = await this.StudentValidation.validateStudentExists(studentDTO.studentId);
        const group = await this.GroupValidation.validateGroupExistsAndReturn(groupId);
        await this.GroupValidation.vlaidateStudentIsNotInGroup(groupId, student.id);

        const studentGroup = await new this.StudentGroup({
            group: groupId,
            student: student.id
        }).save();

        group.students.push(studentGroup.id);
        student.groups.push(studentGroup.id);

        await group.save();
        await student.save();

        return group;
    }
    
    /**
     * Get the group students and push todays date in the attendance column
     * and mark all students as absent
     * 
     * @param {mongoose.Schema.Types.ObjectId} groupId 
     */
    async addNewAttendanceRecord(groupId) {
        await this.GroupValidation.validateGroupExistsAndReturn(groupId);
        const group = await this.Group.findById(groupId).populate('students');

        const today = Date.now();
        group.students.forEach(async student => {
            student.attendance.push({ date: today });
            await student.save();
        });

        await group.save();
        return group;
    }
}

module.exports = GroupService;