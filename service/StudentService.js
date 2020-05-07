class StudentService {

    constructor(Student, SchemaValidation, StudentValidation, GPError, ModelRequests) {
        this.Student = Student;
        this.SchemaValidation = SchemaValidation;
        this.StudentValidation = StudentValidation;
        this.GPError = GPError;
        this.ModelRequests = ModelRequests
    }

    /**
     * 
     * @param {Object} studentDTO student data transfere object
     * @param {String} videoLink the user's face video
     */
    async addStudent(studentDTO, videoLink) {
        await this.SchemaValidation.validateNewStudent(studentDTO);
        await this.StudentValidation.validateStudentDoesntExist(studentDTO.email);

        const student = await new this.Student({
            ...studentDTO,
            videoLink
        }).save();

        await this.ModelRequests.addStudent(student._id, videoLink);
        return student;
    }

    async getAllStudnets() {
        const students = await this.Student.find();
        return students;
    }

    async findStudents(name, department) {
        const nameRegExp = new RegExp(name);
        const departmentRegExp = new RegExp(department);
        let students;
        
        if (name && department)
            students = await this.Student.find({ name: { $regex: nameRegExp, $options: 'ig' }, department: { $regex: departmentRegExp, $options: 'ig' } });
        else if (name)
            students = await this.Student.find({ name: { $regex: nameRegExp, $options: 'ig' } });
        else if (department)
            students = await this.Student.find({ department: { $regex: departmentRegExp, $options: 'ig' } });
        else 
            students = await this.Student.find();

        return students;
    }
}

module.exports = StudentService;