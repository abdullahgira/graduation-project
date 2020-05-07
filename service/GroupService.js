class GroupService {

    constructor(Group, mongoose, StudentGroup, SchemaValidation, GroupValidation, StudentValidation, ModelRequests) {
        this.Group = Group;
        this.mongoose = mongoose;
        this.StudentGroup = StudentGroup;
        this.SchemaValidation = SchemaValidation;
        this.GroupValidation = GroupValidation;
        this.StudentValidation = StudentValidation;
        this.ModelRequests = ModelRequests;
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

    async addStudentsToFacesModel(groupId) {
        await this.GroupValidation.validateGroupExistsAndReturn(groupId);
        const group = await this.Group.findById(groupId).populate('students');
        let students = [];
        group.students.forEach(s => students.push(s.student));
        await this.ModelRequests.createGroup(students, group.id);
    }
    
    /**
     * Get the group students and push todays date in the attendance column
     * and mark all students as absent
     * 
     * @param {mongoose.Schema.Types.ObjectId} groupId 
     */
    async addNewAttendanceRecord(groupId, date) {
        await this.GroupValidation.validateGroupExistsAndReturn(groupId);
        const group = await this.Group.findById(groupId).populate('students');

        const today = date;
        const _id = this.mongoose.Types.ObjectId(); // common id for that attendance to query the students later

        group.attendance.unshift({ _id, date: today });
        group.students.forEach(async student => {
            student.attendance.unshift({ _id, date: today });
            await student.save();
        });

        await group.save();
        return group.attendance;
    }

    /**
     * Sends the image to the face recognition model
     * and receives the id of the student. This id refers to a StudentGroup instance
     * 
     * @param {String} imageLink the student image
     */
    async recordStudentAttendance(groupId, attendanceId, imageLink) {
        await this.GroupValidation.validateGroupExistsAndReturn(groupId);
        await this.GroupValidation.validateAttendanceExists(groupId, attendanceId);

        const studentId = await this.ModelRequests.recordAttendance(groupId, imageLink);
        if (!studentId) {
            throw new this.GPError.ValidationError('Un recognized face');
        }

        const student = await this.StudentGroup.findOne({ student: studentId });
        student.attendance[0].attended = true;

        await student.save();
        return student;
    }

    async getAttendees(groupId, attendanceId) {
        await this.GroupValidation.validateGroupExistsAndReturn(groupId);
        const group = await this.Group.findById(groupId).populate({
            path: 'students',
            populate: { path: 'student' }
        });
        const attendees = [];
        group.students.filter(student => {
            for (let i = 0; i < student.attendance.length; i++) {
                if (student.attendance[i]._id.equals(attendanceId)) {
                    if (student.attendance[i].attended) {
                        attendees.push(student.student); // the .student is the student information
                    }
                    break;
                }
            }
        });
        return attendees;
    }

    async getAbsent(groupId, attendanceId) {
        await this.GroupValidation.validateGroupExistsAndReturn(groupId);
        const group = await this.Group.findById(groupId).populate({
            path: 'students',
            populate: { path: 'student' }
        });
        const absent = [];
        group.students.forEach(student => {
            for (let i = 0; i < student.attendance.length; i++) {
                if (student.attendance[i]._id.equals(attendanceId)) {
                    if (!student.attendance[i].attended) {
                        absent.push(student.student); // the .student is the student information
                    }
                    break;
                }
            }
        });
        return absent;
    }

    async getGroupAttendance(groupId) {
        const group = await this.GroupValidation.validateGroupExistsAndReturn(groupId);
        return group.attendance;
    }    
}

module.exports = GroupService;